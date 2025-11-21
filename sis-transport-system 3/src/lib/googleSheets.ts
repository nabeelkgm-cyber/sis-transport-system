import { google } from 'googleapis';
import type { 
  Student, 
  TransportRegistration, 
  Bus, 
  Route, 
  Teacher 
} from '@/types';

// Initialize Google Sheets API
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export class GoogleSheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: SCOPES,
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID || '';
  }

  // ==================== STUDENTS ====================
  
  async getStudentByEnrollment(enrollmentNo: string): Promise<Student | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Students!A:I',
      });

      const rows = response.data.values || [];
      const studentRow = rows.find(row => row[0] === enrollmentNo);

      if (!studentRow) return null;

      return {
        enrollmentNo: studentRow[0],
        name: studentRow[1],
        class: studentRow[2],
        division: studentRow[3],
        shift: studentRow[4] as 'FN' | 'AN',
        contactNo1: studentRow[5],
        contactNo2: studentRow[6],
        address: studentRow[7],
        parentName: studentRow[8],
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      throw new Error('Failed to fetch student data');
    }
  }

  async getAllStudents(shift?: 'FN' | 'AN'): Promise<Student[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Students!A2:I',
      });

      const rows = response.data.values || [];
      const students = rows.map(row => ({
        enrollmentNo: row[0],
        name: row[1],
        class: row[2],
        division: row[3],
        shift: row[4] as 'FN' | 'AN',
        contactNo1: row[5],
        contactNo2: row[6],
        address: row[7],
        parentName: row[8],
      }));

      return shift ? students.filter(s => s.shift === shift) : students;
    } catch (error) {
      console.error('Error fetching all students:', error);
      throw new Error('Failed to fetch students data');
    }
  }

  // ==================== TRANSPORT REGISTRATIONS ====================

  async getTransportRegistration(enrollmentNo: string): Promise<TransportRegistration | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Transport_Registrations!A:H',
      });

      const rows = response.data.values || [];
      const regRow = rows.find(row => row[0] === enrollmentNo && row[5] === 'Active');

      if (!regRow) return null;

      return {
        enrollmentNo: regRow[0],
        busNumber: regRow[1],
        routeNumber: regRow[2],
        stopName: regRow[3],
        registrationDate: regRow[4],
        status: regRow[5] as 'Active' | 'Cancelled',
        cancellationDate: regRow[6],
        lastUpdated: regRow[7],
      };
    } catch (error) {
      console.error('Error fetching transport registration:', error);
      throw new Error('Failed to fetch transport registration');
    }
  }

  async getAllTransportRegistrations(busNumber?: string): Promise<TransportRegistration[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Transport_Registrations!A2:H',
      });

      const rows = response.data.values || [];
      const registrations = rows
        .filter(row => row[5] === 'Active')
        .map(row => ({
          enrollmentNo: row[0],
          busNumber: row[1],
          routeNumber: row[2],
          stopName: row[3],
          registrationDate: row[4],
          status: row[5] as 'Active' | 'Cancelled',
          cancellationDate: row[6],
          lastUpdated: row[7],
        }));

      return busNumber 
        ? registrations.filter(r => r.busNumber === busNumber)
        : registrations;
    } catch (error) {
      console.error('Error fetching transport registrations:', error);
      throw new Error('Failed to fetch transport registrations');
    }
  }

  async registerTransport(data: {
    enrollmentNo: string;
    busNumber: string;
    routeNumber: string;
    stopName: string;
  }): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Transport_Registrations!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            data.enrollmentNo,
            data.busNumber,
            data.routeNumber,
            data.stopName,
            now,
            'Active',
            '',
            now,
          ]],
        },
      });
    } catch (error) {
      console.error('Error registering transport:', error);
      throw new Error('Failed to register transport');
    }
  }

  async updateTransport(
    enrollmentNo: string,
    data: Partial<TransportRegistration>
  ): Promise<void> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Transport_Registrations!A:H',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(
        row => row[0] === enrollmentNo && row[5] === 'Active'
      );

      if (rowIndex === -1) {
        throw new Error('Active registration not found');
      }

      const row = rows[rowIndex];
      const updatedRow = [
        row[0], // enrollmentNo
        data.busNumber || row[1],
        data.routeNumber || row[2],
        data.stopName || row[3],
        row[4], // registrationDate
        data.status || row[5],
        data.cancellationDate || row[6],
        new Date().toISOString(), // lastUpdated
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Transport_Registrations!A${rowIndex + 1}:H${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [updatedRow],
        },
      });
    } catch (error) {
      console.error('Error updating transport:', error);
      throw new Error('Failed to update transport');
    }
  }

  async cancelTransport(enrollmentNo: string): Promise<void> {
    await this.updateTransport(enrollmentNo, {
      status: 'Cancelled',
      cancellationDate: new Date().toISOString(),
    });
  }

  // ==================== BUSES ====================

  async getBus(busNumber: string): Promise<Bus | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Buses!A:I',
      });

      const rows = response.data.values || [];
      const busRow = rows.find(row => row[0] === busNumber);

      if (!busRow) return null;

      return {
        busNumber: busRow[0],
        capacity: parseInt(busRow[1]),
        routeNumber: busRow[2],
        driverName: busRow[3],
        driverContact: busRow[4],
        conductorName: busRow[5],
        conductorContact: busRow[6],
        teacherAssigned: busRow[7],
        shift: busRow[8] as 'FN' | 'AN',
      };
    } catch (error) {
      console.error('Error fetching bus:', error);
      throw new Error('Failed to fetch bus data');
    }
  }

  async getAllBuses(shift?: 'FN' | 'AN'): Promise<Bus[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Buses!A2:I',
      });

      const rows = response.data.values || [];
      const buses = rows.map(row => ({
        busNumber: row[0],
        capacity: parseInt(row[1]),
        routeNumber: row[2],
        driverName: row[3],
        driverContact: row[4],
        conductorName: row[5],
        conductorContact: row[6],
        teacherAssigned: row[7],
        shift: row[8] as 'FN' | 'AN',
      }));

      return shift ? buses.filter(b => b.shift === shift) : buses;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw new Error('Failed to fetch buses data');
    }
  }

  async createBus(bus: Bus): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Buses!A:I',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            bus.busNumber,
            bus.capacity,
            bus.routeNumber,
            bus.driverName,
            bus.driverContact,
            bus.conductorName,
            bus.conductorContact,
            bus.teacherAssigned || '',
            bus.shift,
          ]],
        },
      });
    } catch (error) {
      console.error('Error creating bus:', error);
      throw new Error('Failed to create bus');
    }
  }

  async updateBus(busNumber: string, bus: Partial<Bus>): Promise<void> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Buses!A:I',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === busNumber);

      if (rowIndex === -1) {
        throw new Error('Bus not found');
      }

      const row = rows[rowIndex];
      const updatedRow = [
        row[0], // busNumber
        bus.capacity?.toString() || row[1],
        bus.routeNumber || row[2],
        bus.driverName || row[3],
        bus.driverContact || row[4],
        bus.conductorName || row[5],
        bus.conductorContact || row[6],
        bus.teacherAssigned || row[7],
        bus.shift || row[8],
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Buses!A${rowIndex + 1}:I${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [updatedRow],
        },
      });
    } catch (error) {
      console.error('Error updating bus:', error);
      throw new Error('Failed to update bus');
    }
  }

  async deleteBus(busNumber: string): Promise<void> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Buses!A:I',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === busNumber);

      if (rowIndex === -1) {
        throw new Error('Bus not found');
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // Adjust based on actual sheet ID
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          }],
        },
      });
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw new Error('Failed to delete bus');
    }
  }

  // ==================== ROUTES ====================

  async getRoute(routeNumber: string): Promise<Route | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Routes!A:E',
      });

      const rows = response.data.values || [];
      const routeRow = rows.find(row => row[0] === routeNumber);

      if (!routeRow) return null;

      return {
        routeNumber: routeRow[0],
        routeName: routeRow[1],
        stops: routeRow[2].split(',').map((s: string) => s.trim()),
        totalDistance: routeRow[3],
        area: routeRow[4],
      };
    } catch (error) {
      console.error('Error fetching route:', error);
      throw new Error('Failed to fetch route data');
    }
  }

  async getAllRoutes(): Promise<Route[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Routes!A2:E',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        routeNumber: row[0],
        routeName: row[1],
        stops: row[2].split(',').map((s: string) => s.trim()),
        totalDistance: row[3],
        area: row[4],
      }));
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw new Error('Failed to fetch routes data');
    }
  }

  async createRoute(route: Route): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Routes!A:E',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            route.routeNumber,
            route.routeName,
            route.stops.join(', '),
            route.totalDistance || '',
            route.area || '',
          ]],
        },
      });
    } catch (error) {
      console.error('Error creating route:', error);
      throw new Error('Failed to create route');
    }
  }

  async updateRoute(routeNumber: string, route: Partial<Route>): Promise<void> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Routes!A:E',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === routeNumber);

      if (rowIndex === -1) {
        throw new Error('Route not found');
      }

      const row = rows[rowIndex];
      const updatedRow = [
        row[0], // routeNumber
        route.routeName || row[1],
        route.stops ? route.stops.join(', ') : row[2],
        route.totalDistance || row[3],
        route.area || row[4],
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Routes!A${rowIndex + 1}:E${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [updatedRow],
        },
      });
    } catch (error) {
      console.error('Error updating route:', error);
      throw new Error('Failed to update route');
    }
  }

  async deleteRoute(routeNumber: string): Promise<void> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Routes!A:E',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === routeNumber);

      if (rowIndex === -1) {
        throw new Error('Route not found');
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 1, // Adjust based on actual sheet ID
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          }],
        },
      });
    } catch (error) {
      console.error('Error deleting route:', error);
      throw new Error('Failed to delete route');
    }
  }

  // ==================== TEACHERS ====================

  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Teachers!A2:E',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        teacherId: row[0],
        name: row[1],
        contact: row[2],
        subject: row[3],
        assignedBus: row[4],
      }));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw new Error('Failed to fetch teachers data');
    }
  }

  async createTeacher(teacher: Teacher): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Teachers!A:E',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            teacher.teacherId,
            teacher.name,
            teacher.contact,
            teacher.subject || '',
            teacher.assignedBus || '',
          ]],
        },
      });
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw new Error('Failed to create teacher');
    }
  }

  async updateTeacher(teacherId: string, teacher: Partial<Teacher>): Promise<void> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Teachers!A:E',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === teacherId);

      if (rowIndex === -1) {
        throw new Error('Teacher not found');
      }

      const row = rows[rowIndex];
      const updatedRow = [
        row[0], // teacherId
        teacher.name || row[1],
        teacher.contact || row[2],
        teacher.subject || row[3],
        teacher.assignedBus || row[4],
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Teachers!A${rowIndex + 1}:E${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [updatedRow],
        },
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw new Error('Failed to update teacher');
    }
  }

  async deleteTeacher(teacherId: string): Promise<void> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Teachers!A:E',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === teacherId);

      if (rowIndex === -1) {
        throw new Error('Teacher not found');
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 2, // Adjust based on actual sheet ID
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          }],
        },
      });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw new Error('Failed to delete teacher');
    }
  }
}

export const sheetsService = new GoogleSheetsService();
