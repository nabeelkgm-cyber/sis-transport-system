// Type Definitions for SIS Transport System

export interface Student {
  enrollmentNo: string;
  name: string;
  class: string;
  division: string;
  shift: 'FN' | 'AN';
  contactNo1: string;
  contactNo2?: string;
  address?: string;
  parentName?: string;
}

export interface TransportRegistration {
  enrollmentNo: string;
  busNumber: string;
  routeNumber: string;
  stopName: string;
  registrationDate: string;
  status: 'Active' | 'Cancelled';
  cancellationDate?: string;
  lastUpdated: string;
  studentDetails?: Student;
}

export interface Bus {
  busNumber: string;
  capacity: number;
  routeNumber: string;
  driverName: string;
  driverContact: string;
  conductorName: string;
  conductorContact: string;
  teacherAssigned?: string;
  shift: 'FN' | 'AN';
  currentOccupancy?: number;
}

export interface Route {
  routeNumber: string;
  routeName: string;
  stops: string[];
  totalDistance?: string;
  area?: string;
}

export interface Teacher {
  teacherId: string;
  name: string;
  contact: string;
  subject?: string;
  assignedBus?: string;
}

export interface AttendanceSheetParams {
  busNumber: string;
  startDate: string;
  endDate: string;
  shift: 'FN' | 'AN';
}

export interface AttendanceRecord {
  slNo: number;
  enrollmentNo: string;
  studentName: string;
  class: string;
  contactNo: string;
  dates: AttendanceDate[];
}

export interface AttendanceDate {
  date: string;
  dayName: string;
  am?: boolean;
  pm?: boolean;
}

export interface RouteSheetData {
  busNumber: string;
  routeNumber: string;
  routeName: string;
  driverName: string;
  driverContact: string;
  conductorName: string;
  conductorContact: string;
  teacherAssigned?: string;
  capacity: number;
  currentOccupancy: number;
  shift: 'FN' | 'AN';
  students: RouteSheetStudent[];
}

export interface RouteSheetStudent {
  enrollmentNo: string;
  name: string;
  class: string;
  stopName: string;
  contactNo: string;
}

export interface EventRouteSheet {
  eventName: string;
  eventDate: string;
  buses: EventBus[];
}

export interface EventBus {
  busNumber: string;
  driverName: string;
  conductorName: string;
  teacherAssigned?: string;
  students: EventStudent[];
}

export interface EventStudent {
  enrollmentNo: string;
  name: string;
  class: string;
  contactNo: string;
  stopName?: string;
}

export interface SMSTemplate {
  type: 'registration' | 'cancellation' | 'route_change';
  template: string;
  variables: string[];
}

export interface DashboardStats {
  totalBuses: number;
  totalRoutes: number;
  totalTransportUsers: number;
  fnTransportUsers: number;
  anTransportUsers: number;
  totalStudents: number;
  averageOccupancy: number;
}

export interface BusSummary {
  busNumber: string;
  routeNumber: string;
  shift: 'FN' | 'AN';
  capacity: number;
  currentOccupancy: number;
  utilizationPercentage: number;
  driverName: string;
  conductorName: string;
  teacherAssigned?: string;
  students: number;
}

export interface SearchResult {
  type: 'student' | 'bus' | 'route';
  data: Student | Bus | Route;
  transportDetails?: TransportRegistration;
}

export interface AnnexureParams {
  type: 'fn_transport' | 'an_transport' | 'fn_all' | 'an_all' | 'non_transport';
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TransportAction = 'register' | 'cancel' | 'update';

export interface TransportActionPayload {
  action: TransportAction;
  enrollmentNo: string;
  busNumber?: string;
  routeNumber?: string;
  stopName?: string;
}

// Form types
export interface TransportRegistrationForm {
  enrollmentNo: string;
  busNumber: string;
  routeNumber: string;
  stopName: string;
}

export interface BusForm {
  busNumber: string;
  capacity: number;
  routeNumber: string;
  driverName: string;
  driverContact: string;
  conductorName: string;
  conductorContact: string;
  teacherAssigned?: string;
  shift: 'FN' | 'AN';
}

export interface RouteForm {
  routeNumber: string;
  routeName: string;
  stops: string;
  totalDistance?: string;
  area?: string;
}

export interface TeacherForm {
  teacherId: string;
  name: string;
  contact: string;
  subject?: string;
  assignedBus?: string;
}

// Context types
export interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'viewer';
}

export interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
