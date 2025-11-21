/**
 * Student Management Functions
 */

/**
 * Get student by enrollment number
 */
function getStudentByEnrollment(enrollmentNo) {
  const sheet = getSheet(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === enrollmentNo) {
      return {
        enrollmentNo: data[i][0],
        name: data[i][1],
        class: data[i][2],
        division: data[i][3],
        shift: data[i][4],
        contactNo1: data[i][5],
        contactNo2: data[i][6],
        address: data[i][7],
        parentName: data[i][8]
      };
    }
  }
  
  return null;
}

/**
 * Get all students (optionally filtered by shift)
 */
function getAllStudents(shift) {
  const sheet = getSheet(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();
  const students = [];
  
  for (let i = 1; i < data.length; i++) {
    if (!shift || data[i][4] === shift) {
      students.push({
        enrollmentNo: data[i][0],
        name: data[i][1],
        class: data[i][2],
        division: data[i][3],
        shift: data[i][4],
        contactNo1: data[i][5],
        contactNo2: data[i][6],
        address: data[i][7],
        parentName: data[i][8]
      });
    }
  }
  
  return students;
}

/**
 * Search students by name or enrollment number
 */
function searchStudents(query) {
  const sheet = getSheet(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();
  const results = [];
  const queryLower = query.toLowerCase();
  
  for (let i = 1; i < data.length; i++) {
    const enrollmentNo = data[i][0].toString().toLowerCase();
    const name = data[i][1].toString().toLowerCase();
    
    if (enrollmentNo.includes(queryLower) || name.includes(queryLower)) {
      results.push({
        enrollmentNo: data[i][0],
        name: data[i][1],
        class: data[i][2],
        division: data[i][3],
        shift: data[i][4],
        contactNo1: data[i][5],
        contactNo2: data[i][6],
        address: data[i][7],
        parentName: data[i][8]
      });
    }
  }
  
  return results;
}

/**
 * Get students by class
 */
function getStudentsByClass(className) {
  const sheet = getSheet(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();
  const students = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === className) {
      students.push({
        enrollmentNo: data[i][0],
        name: data[i][1],
        class: data[i][2],
        division: data[i][3],
        shift: data[i][4],
        contactNo1: data[i][5],
        contactNo2: data[i][6],
        address: data[i][7],
        parentName: data[i][8]
      });
    }
  }
  
  return students;
}

/**
 * Get students by shift
 */
function getStudentsByShift(shift) {
  return getAllStudents(shift);
}

/**
 * Validate student data
 */
function validateStudentData(studentData) {
  const errors = [];
  
  if (!studentData.enrollmentNo) {
    errors.push('Enrollment number is required');
  }
  
  if (!studentData.name) {
    errors.push('Student name is required');
  }
  
  if (!studentData.class) {
    errors.push('Class is required');
  }
  
  if (!studentData.shift || !['FN', 'AN'].includes(studentData.shift)) {
    errors.push('Valid shift (FN or AN) is required');
  }
  
  if (!studentData.contactNo1) {
    errors.push('At least one contact number is required');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Add new student (admin function)
 */
function addStudent(studentData) {
  const validation = validateStudentData(studentData);
  if (!validation.valid) {
    throw new Error('Validation failed: ' + validation.errors.join(', '));
  }
  
  // Check for duplicate enrollment number
  const existing = getStudentByEnrollment(studentData.enrollmentNo);
  if (existing) {
    throw new Error('Student with this enrollment number already exists');
  }
  
  const sheet = getSheet(SHEETS.STUDENTS);
  sheet.appendRow([
    studentData.enrollmentNo,
    studentData.name,
    studentData.class,
    studentData.division || '',
    studentData.shift,
    studentData.contactNo1,
    studentData.contactNo2 || '',
    studentData.address || '',
    studentData.parentName || ''
  ]);
  
  return { success: true, message: 'Student added successfully' };
}

/**
 * Update student information
 */
function updateStudent(enrollmentNo, studentData) {
  const sheet = getSheet(SHEETS.STUDENTS);
  const rowIndex = findRowByValue(sheet, 0, enrollmentNo);
  
  if (rowIndex === -1) {
    throw new Error('Student not found');
  }
  
  const row = sheet.getRange(rowIndex, 1, 1, 9);
  const currentData = row.getValues()[0];
  
  row.setValues([[
    currentData[0], // enrollmentNo (cannot be changed)
    studentData.name || currentData[1],
    studentData.class || currentData[2],
    studentData.division || currentData[3],
    studentData.shift || currentData[4],
    studentData.contactNo1 || currentData[5],
    studentData.contactNo2 || currentData[6],
    studentData.address || currentData[7],
    studentData.parentName || currentData[8]
  ]]);
  
  return { success: true, message: 'Student updated successfully' };
}

/**
 * Get student count by shift
 */
function getStudentCountByShift() {
  const sheet = getSheet(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();
  
  let fnCount = 0;
  let anCount = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === 'FN') fnCount++;
    else if (data[i][4] === 'AN') anCount++;
  }
  
  return {
    FN: fnCount,
    AN: anCount,
    total: fnCount + anCount
  };
}

/**
 * Get students with transport details
 */
function getStudentsWithTransport(shift) {
  const students = getAllStudents(shift);
  const transportSheet = getSheet(SHEETS.TRANSPORT);
  const transportData = transportSheet.getDataRange().getValues();
  
  const result = students.map(student => {
    const transport = transportData.find(row => 
      row[0] === student.enrollmentNo && row[5] === 'Active'
    );
    
    return {
      ...student,
      hasTransport: !!transport,
      transportDetails: transport ? {
        busNumber: transport[1],
        routeNumber: transport[2],
        stopName: transport[3],
        registrationDate: transport[4]
      } : null
    };
  });
  
  return result;
}

/**
 * Get students without transport
 */
function getStudentsWithoutTransport(shift) {
  const studentsWithTransport = getStudentsWithTransport(shift);
  return studentsWithTransport.filter(s => !s.hasTransport);
}

/**
 * Bulk import students from array
 */
function bulkImportStudents(studentsArray) {
  const sheet = getSheet(SHEETS.STUDENTS);
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  studentsArray.forEach((student, index) => {
    try {
      const validation = validateStudentData(student);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
      
      // Check for duplicate
      const existing = getStudentByEnrollment(student.enrollmentNo);
      if (existing) {
        throw new Error('Duplicate enrollment number');
      }
      
      sheet.appendRow([
        student.enrollmentNo,
        student.name,
        student.class,
        student.division || '',
        student.shift,
        student.contactNo1,
        student.contactNo2 || '',
        student.address || '',
        student.parentName || ''
      ]);
      
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        row: index + 1,
        enrollmentNo: student.enrollmentNo,
        error: error.toString()
      });
    }
  });
  
  return results;
}
