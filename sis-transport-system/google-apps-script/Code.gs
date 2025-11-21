/**
 * SIS Transport Management System - Google Apps Script Backend
 * Main entry point and configuration
 */

// Spreadsheet configuration
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

// Sheet names
const SHEETS = {
  STUDENTS: 'Students',
  TRANSPORT: 'Transport_Registrations',
  BUSES: 'Buses',
  ROUTES: 'Routes',
  TEACHERS: 'Teachers',
  SMS_TEMPLATES: 'SMS_Templates'
};

/**
 * Web App Entry Point
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'SIS Transport Management API is running',
    version: '1.0.0'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST Request Handler
 */
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const data = request.data;
    
    let response;
    
    switch(action) {
      // Student operations
      case 'getStudent':
        response = getStudentByEnrollment(data.enrollmentNo);
        break;
      case 'getAllStudents':
        response = getAllStudents(data.shift);
        break;
        
      // Transport operations
      case 'getTransportRegistration':
        response = getTransportRegistration(data.enrollmentNo);
        break;
      case 'registerTransport':
        response = registerTransport(data);
        break;
      case 'updateTransport':
        response = updateTransport(data);
        break;
      case 'cancelTransport':
        response = cancelTransport(data.enrollmentNo);
        break;
      case 'checkDuplicate':
        response = checkDuplicateRegistration(data.enrollmentNo);
        break;
        
      // Bus operations
      case 'getBus':
        response = getBus(data.busNumber);
        break;
      case 'getAllBuses':
        response = getAllBuses(data.shift);
        break;
      case 'createBus':
        response = createBus(data);
        break;
      case 'updateBus':
        response = updateBus(data);
        break;
      case 'deleteBus':
        response = deleteBus(data.busNumber);
        break;
        
      // Route operations
      case 'getRoute':
        response = getRoute(data.routeNumber);
        break;
      case 'getAllRoutes':
        response = getAllRoutes();
        break;
      case 'createRoute':
        response = createRoute(data);
        break;
      case 'updateRoute':
        response = updateRoute(data);
        break;
      case 'deleteRoute':
        response = deleteRoute(data.routeNumber);
        break;
        
      // Teacher operations
      case 'getAllTeachers':
        response = getAllTeachers();
        break;
      case 'createTeacher':
        response = createTeacher(data);
        break;
      case 'updateTeacher':
        response = updateTeacher(data);
        break;
      case 'deleteTeacher':
        response = deleteTeacher(data.teacherId);
        break;
        
      // Report operations
      case 'getAttendanceData':
        response = getAttendanceData(data);
        break;
      case 'getRouteSheetData':
        response = getRouteSheetData(data.busNumber);
        break;
      case 'getBusSummary':
        response = getBusSummaryData();
        break;
        
      // Search operations
      case 'search':
        response = searchRecords(data.query, data.type);
        break;
        
      default:
        throw new Error('Invalid action: ' + action);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: response
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Utility function to get sheet by name
 */
function getSheet(sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  return sheet;
}

/**
 * Utility function to find row by value in column
 */
function findRowByValue(sheet, column, value) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][column] === value) {
      return i + 1;
    }
  }
  return -1;
}

/**
 * Utility function to get current timestamp
 */
function getCurrentTimestamp() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Utility function to send SMS (placeholder - integrate with SMS provider)
 */
function sendSMS(phoneNumber, message) {
  // TODO: Integrate with SMS provider API
  // For now, just log the message
  Logger.log('SMS to ' + phoneNumber + ': ' + message);
  
  // Example integration with a generic SMS API:
  /*
  const url = 'https://api.smsprovider.com/send';
  const payload = {
    to: phoneNumber,
    message: message,
    apiKey: PropertiesService.getScriptProperties().getProperty('SMS_API_KEY')
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log('SMS send error: ' + error.toString());
    throw error;
  }
  */
  
  return { success: true, message: 'SMS logged (integration pending)' };
}

/**
 * Setup function - Run once to initialize
 */
function setupScript() {
  // Set script properties
  const scriptProperties = PropertiesService.getScriptProperties();
  
  // Prompt for Spreadsheet ID if not set
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Enter Spreadsheet ID', 'Please enter the Google Sheets Spreadsheet ID:', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() === ui.Button.OK) {
    const spreadsheetId = response.getResponseText();
    scriptProperties.setProperty('SPREADSHEET_ID', spreadsheetId);
    ui.alert('Setup complete! Spreadsheet ID saved.');
  }
  
  // Create required sheets if they don't exist
  createRequiredSheets();
}

/**
 * Create required sheets structure
 */
function createRequiredSheets() {
  const requiredSheets = [
    {
      name: SHEETS.STUDENTS,
      headers: ['Enrollment No', 'Name', 'Class', 'Division', 'Shift', 'Contact No 1', 'Contact No 2', 'Address', 'Parent Name']
    },
    {
      name: SHEETS.TRANSPORT,
      headers: ['Enrollment No', 'Bus Number', 'Route Number', 'Stop Name', 'Registration Date', 'Status', 'Cancellation Date', 'Last Updated']
    },
    {
      name: SHEETS.BUSES,
      headers: ['Bus Number', 'Capacity', 'Route Number', 'Driver Name', 'Driver Contact', 'Conductor Name', 'Conductor Contact', 'Teacher Assigned', 'Shift']
    },
    {
      name: SHEETS.ROUTES,
      headers: ['Route Number', 'Route Name', 'Stops', 'Total Distance', 'Area']
    },
    {
      name: SHEETS.TEACHERS,
      headers: ['Teacher ID', 'Name', 'Contact', 'Subject', 'Assigned Bus']
    },
    {
      name: SHEETS.SMS_TEMPLATES,
      headers: ['Template Type', 'Template Text', 'Variables']
    }
  ];
  
  requiredSheets.forEach(sheetConfig => {
    let sheet = ss.getSheetByName(sheetConfig.name);
    if (!sheet) {
      sheet = ss.insertSheet(sheetConfig.name);
      sheet.getRange(1, 1, 1, sheetConfig.headers.length).setValues([sheetConfig.headers]);
      sheet.getRange(1, 1, 1, sheetConfig.headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  });
}

/**
 * Test function to verify API connectivity
 */
function testAPI() {
  Logger.log('Testing API endpoints...');
  
  // Test student retrieval
  const testEnrollment = 'P12299';
  const student = getStudentByEnrollment(testEnrollment);
  Logger.log('Student test: ' + JSON.stringify(student));
  
  // Test bus retrieval
  const buses = getAllBuses();
  Logger.log('Buses count: ' + buses.length);
  
  Logger.log('API test completed successfully!');
}

/**
 * Create custom menu in Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Transport System')
    .addItem('Setup Script', 'setupScript')
    .addItem('Test API', 'testAPI')
    .addItem('Deploy as Web App', 'deployInfo')
    .addSeparator()
    .addItem('Refresh All Data', 'refreshAllData')
    .addToUi();
}

/**
 * Show deployment information
 */
function deployInfo() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Deployment Instructions',
    'To deploy this script as a web app:\n\n' +
    '1. Click on Deploy > New deployment\n' +
    '2. Select "Web app" as deployment type\n' +
    '3. Set "Execute as" to "Me"\n' +
    '4. Set "Who has access" to "Anyone"\n' +
    '5. Click "Deploy"\n' +
    '6. Copy the Web App URL\n' +
    '7. Use this URL in your Next.js application',
    ui.ButtonSet.OK
  );
}

/**
 * Refresh all data (utility function)
 */
function refreshAllData() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    'Confirm Refresh',
    'This will recalculate all formulas and refresh data. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (result === ui.Button.YES) {
    SpreadsheetApp.flush();
    ui.alert('Data refreshed successfully!');
  }
}
