/**
 * Transport Management Functions
 */

/**
 * Get transport registration by enrollment number
 */
function getTransportRegistration(enrollmentNo) {
  const sheet = getSheet(SHEETS.TRANSPORT);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === enrollmentNo && data[i][5] === 'Active') {
      return {
        enrollmentNo: data[i][0],
        busNumber: data[i][1],
        routeNumber: data[i][2],
        stopName: data[i][3],
        registrationDate: data[i][4],
        status: data[i][5],
        cancellationDate: data[i][6],
        lastUpdated: data[i][7]
      };
    }
  }
  
  return null;
}

/**
 * Check for duplicate registration
 */
function checkDuplicateRegistration(enrollmentNo) {
  const existing = getTransportRegistration(enrollmentNo);
  return {
    isDuplicate: !!existing,
    existingRegistration: existing
  };
}

/**
 * Register student for transport
 */
function registerTransport(data) {
  // Validate student exists
  const student = getStudentByEnrollment(data.enrollmentNo);
  if (!student) {
    throw new Error('Student not found');
  }
  
  // Check for existing active registration
  const duplicate = checkDuplicateRegistration(data.enrollmentNo);
  if (duplicate.isDuplicate) {
    throw new Error('Student already registered for transport. Please cancel existing registration first.');
  }
  
  // Validate bus exists
  const bus = getBus(data.busNumber);
  if (!bus) {
    throw new Error('Bus not found');
  }
  
  // Validate route exists
  const route = getRoute(data.routeNumber);
  if (!route) {
    throw new Error('Route not found');
  }
  
  // Check bus capacity
  const currentOccupancy = getBusOccupancy(data.busNumber);
  if (currentOccupancy >= bus.capacity) {
    throw new Error('Bus is at full capacity');
  }
  
  const timestamp = getCurrentTimestamp();
  const sheet = getSheet(SHEETS.TRANSPORT);
  
  sheet.appendRow([
    data.enrollmentNo,
    data.busNumber,
    data.routeNumber,
    data.stopName,
    timestamp,
    'Active',
    '',
    timestamp
  ]);
  
  // Generate and send SMS
  try {
    const smsData = {
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      busNumber: data.busNumber,
      routeNumber: data.routeNumber,
      routeName: route.routeName,
      stopName: data.stopName,
      driverName: bus.driverName,
      driverContact: bus.driverContact,
      conductorName: bus.conductorName,
      conductorContact: bus.conductorContact,
      effectiveDate: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd-MM-yyyy')
    };
    
    const smsMessage = generateRegistrationSMS(smsData);
    
    // Send to both contact numbers if available
    if (student.contactNo1) {
      sendSMS(student.contactNo1, smsMessage);
    }
    if (student.contactNo2) {
      sendSMS(student.contactNo2, smsMessage);
    }
  } catch (smsError) {
    Logger.log('SMS sending failed: ' + smsError.toString());
    // Don't throw error - registration was successful
  }
  
  return {
    success: true,
    message: 'Transport registered successfully',
    data: {
      enrollmentNo: data.enrollmentNo,
      busNumber: data.busNumber,
      registrationDate: timestamp
    }
  };
}

/**
 * Update transport registration
 */
function updateTransport(data) {
  const sheet = getSheet(SHEETS.TRANSPORT);
  const rowIndex = findTransportRow(data.enrollmentNo);
  
  if (rowIndex === -1) {
    throw new Error('Active transport registration not found');
  }
  
  const student = getStudentByEnrollment(data.enrollmentNo);
  const oldRegistration = getTransportRegistration(data.enrollmentNo);
  
  // Validate new bus and route if changed
  if (data.busNumber && data.busNumber !== oldRegistration.busNumber) {
    const bus = getBus(data.busNumber);
    if (!bus) {
      throw new Error('New bus not found');
    }
    
    const occupancy = getBusOccupancy(data.busNumber);
    if (occupancy >= bus.capacity) {
      throw new Error('New bus is at full capacity');
    }
  }
  
  if (data.routeNumber && data.routeNumber !== oldRegistration.routeNumber) {
    const route = getRoute(data.routeNumber);
    if (!route) {
      throw new Error('New route not found');
    }
  }
  
  const timestamp = getCurrentTimestamp();
  const row = sheet.getRange(rowIndex, 1, 1, 8);
  const currentData = row.getValues()[0];
  
  row.setValues([[
    currentData[0], // enrollmentNo
    data.busNumber || currentData[1],
    data.routeNumber || currentData[2],
    data.stopName || currentData[3],
    currentData[4], // registrationDate
    currentData[5], // status
    currentData[6], // cancellationDate
    timestamp // lastUpdated
  ]]);
  
  // Send route change SMS if bus or route changed
  if ((data.busNumber && data.busNumber !== oldRegistration.busNumber) ||
      (data.routeNumber && data.routeNumber !== oldRegistration.routeNumber)) {
    try {
      const newBus = getBus(data.busNumber || oldRegistration.busNumber);
      const newRoute = getRoute(data.routeNumber || oldRegistration.routeNumber);
      
      const smsData = {
        studentName: student.name,
        enrollmentNo: student.enrollmentNo,
        busNumber: data.busNumber || oldRegistration.busNumber,
        routeNumber: data.routeNumber || oldRegistration.routeNumber,
        routeName: newRoute.routeName,
        stopName: data.stopName || oldRegistration.stopName,
        driverName: newBus.driverName,
        driverContact: newBus.driverContact,
        conductorName: newBus.conductorName,
        conductorContact: newBus.conductorContact,
        effectiveDate: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd-MM-yyyy'),
        oldBusNumber: oldRegistration.busNumber,
        newBusNumber: data.busNumber || oldRegistration.busNumber,
        oldRoute: oldRegistration.routeNumber,
        newRoute: data.routeNumber || oldRegistration.routeNumber
      };
      
      const smsMessage = generateRouteChangeSMS(smsData);
      
      if (student.contactNo1) sendSMS(student.contactNo1, smsMessage);
      if (student.contactNo2) sendSMS(student.contactNo2, smsMessage);
    } catch (smsError) {
      Logger.log('SMS sending failed: ' + smsError.toString());
    }
  }
  
  return {
    success: true,
    message: 'Transport updated successfully'
  };
}

/**
 * Cancel transport registration
 */
function cancelTransport(enrollmentNo) {
  const sheet = getSheet(SHEETS.TRANSPORT);
  const rowIndex = findTransportRow(enrollmentNo);
  
  if (rowIndex === -1) {
    throw new Error('Active transport registration not found');
  }
  
  const student = getStudentByEnrollment(enrollmentNo);
  const registration = getTransportRegistration(enrollmentNo);
  
  const timestamp = getCurrentTimestamp();
  const row = sheet.getRange(rowIndex, 1, 1, 8);
  const currentData = row.getValues()[0];
  
  row.setValues([[
    currentData[0], // enrollmentNo
    currentData[1], // busNumber
    currentData[2], // routeNumber
    currentData[3], // stopName
    currentData[4], // registrationDate
    'Cancelled',
    timestamp,
    timestamp
  ]]);
  
  // Send cancellation SMS
  try {
    const bus = getBus(registration.busNumber);
    const route = getRoute(registration.routeNumber);
    
    const smsData = {
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      busNumber: registration.busNumber,
      routeNumber: registration.routeNumber,
      routeName: route.routeName,
      stopName: registration.stopName,
      effectiveDate: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd-MM-yyyy')
    };
    
    const smsMessage = generateCancellationSMS(smsData);
    
    if (student.contactNo1) sendSMS(student.contactNo1, smsMessage);
    if (student.contactNo2) sendSMS(student.contactNo2, smsMessage);
  } catch (smsError) {
    Logger.log('SMS sending failed: ' + smsError.toString());
  }
  
  return {
    success: true,
    message: 'Transport cancelled successfully'
  };
}

/**
 * Get all transport registrations
 */
function getAllTransportRegistrations(busNumber, status) {
  const sheet = getSheet(SHEETS.TRANSPORT);
  const data = sheet.getDataRange().getValues();
  const registrations = [];
  
  for (let i = 1; i < data.length; i++) {
    if ((!status || data[i][5] === status) && (!busNumber || data[i][1] === busNumber)) {
      registrations.push({
        enrollmentNo: data[i][0],
        busNumber: data[i][1],
        routeNumber: data[i][2],
        stopName: data[i][3],
        registrationDate: data[i][4],
        status: data[i][5],
        cancellationDate: data[i][6],
        lastUpdated: data[i][7]
      });
    }
  }
  
  return registrations;
}

/**
 * Get bus occupancy
 */
function getBusOccupancy(busNumber) {
  const sheet = getSheet(SHEETS.TRANSPORT);
  const data = sheet.getDataRange().getValues();
  let count = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === busNumber && data[i][5] === 'Active') {
      count++;
    }
  }
  
  return count;
}

/**
 * Get transport registrations by route
 */
function getTransportByRoute(routeNumber) {
  const sheet = getSheet(SHEETS.TRANSPORT);
  const data = sheet.getDataRange().getValues();
  const registrations = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === routeNumber && data[i][5] === 'Active') {
      const student = getStudentByEnrollment(data[i][0]);
      registrations.push({
        enrollmentNo: data[i][0],
        studentName: student ? student.name : '',
        class: student ? student.class : '',
        busNumber: data[i][1],
        stopName: data[i][3],
        contactNo: student ? student.contactNo1 : ''
      });
    }
  }
  
  return registrations;
}

/**
 * Helper function to find transport row
 */
function findTransportRow(enrollmentNo) {
  const sheet = getSheet(SHEETS.TRANSPORT);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === enrollmentNo && data[i][5] === 'Active') {
      return i + 1;
    }
  }
  
  return -1;
}

/**
 * Get transport statistics
 */
function getTransportStatistics() {
  const sheet = getSheet(SHEETS.TRANSPORT);
  const data = sheet.getDataRange().getValues();
  
  let activeRegistrations = 0;
  let cancelledRegistrations = 0;
  const busUsage = {};
  const routeUsage = {};
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][5] === 'Active') {
      activeRegistrations++;
      
      const busNumber = data[i][1];
      const routeNumber = data[i][2];
      
      busUsage[busNumber] = (busUsage[busNumber] || 0) + 1;
      routeUsage[routeNumber] = (routeUsage[routeNumber] || 0) + 1;
    } else if (data[i][5] === 'Cancelled') {
      cancelledRegistrations++;
    }
  }
  
  return {
    activeRegistrations,
    cancelledRegistrations,
    totalRegistrations: activeRegistrations + cancelledRegistrations,
    busUsage,
    routeUsage
  };
}

/**
 * SMS Template Generation Functions
 */
function generateRegistrationSMS(data) {
  return `Dear Parent,

Your child ${data.studentName} (${data.enrollmentNo}) has been successfully registered for school transport.

Transport Details:
Bus No: ${data.busNumber}
Route: ${data.routeName} (${data.routeNumber})
Stop: ${data.stopName}

Driver: ${data.driverName} (${data.driverContact})
Conductor: ${data.conductorName} (${data.conductorContact})

Effective From: ${data.effectiveDate}

Please ensure your child is at the designated stop 5 minutes before the scheduled pick-up time.

Shantiniketan Indian School
Transport Department`;
}

function generateCancellationSMS(data) {
  return `Dear Parent,

Transport service for ${data.studentName} (${data.enrollmentNo}) has been cancelled as per your request.

Previous Transport Details:
Bus No: ${data.busNumber}
Route: ${data.routeName}
Stop: ${data.stopName}

Cancellation Date: ${data.effectiveDate}

If this was done in error, please contact the transport office immediately.

Shantiniketan Indian School
Transport Department`;
}

function generateRouteChangeSMS(data) {
  let changeInfo = '';
  if (data.oldBusNumber !== data.newBusNumber) {
    changeInfo += `Bus: ${data.oldBusNumber} → ${data.newBusNumber}\n`;
  }
  if (data.oldRoute !== data.newRoute) {
    changeInfo += `Route: ${data.oldRoute} → ${data.newRoute}\n`;
  }
  
  return `Dear Parent,

Transport details have been updated for ${data.studentName} (${data.enrollmentNo}).

${changeInfo}
Updated Transport Details:
Bus No: ${data.busNumber}
Route: ${data.routeName} (${data.routeNumber})
Stop: ${data.stopName}

Driver: ${data.driverName} (${data.driverContact})
Conductor: ${data.conductorName} (${data.conductorContact})

Effective From: ${data.effectiveDate}

Please note the changes and ensure your child boards the correct bus.

Shantiniketan Indian School
Transport Department`;
}
