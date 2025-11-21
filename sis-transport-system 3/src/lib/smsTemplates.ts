import type { Student, TransportRegistration, Bus, Route } from '@/types';

export interface SMSData {
  studentName: string;
  enrollmentNo: string;
  busNumber: string;
  routeNumber: string;
  routeName: string;
  stopName: string;
  driverName: string;
  driverContact: string;
  conductorName: string;
  conductorContact: string;
  effectiveDate: string;
  oldBusNumber?: string;
  newBusNumber?: string;
  oldRoute?: string;
  newRoute?: string;
}

export class SMSTemplateService {
  /**
   * Generate SMS for new transport registration
   */
  static generateRegistrationSMS(data: SMSData): string {
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

For any queries, contact the transport office.

Shantiniketan Indian School
Transport Department`;
  }

  /**
   * Generate SMS for transport cancellation
   */
  static generateCancellationSMS(data: SMSData): string {
    return `Dear Parent,

Transport service for ${data.studentName} (${data.enrollmentNo}) has been cancelled as per your request.

Previous Transport Details:
Bus No: ${data.busNumber}
Route: ${data.routeName}
Stop: ${data.stopName}

Cancellation Date: ${data.effectiveDate}

If this was done in error, please contact the transport office immediately.

Thank you.

Shantiniketan Indian School
Transport Department`;
  }

  /**
   * Generate SMS for bus/route change
   */
  static generateRouteChangeSMS(data: SMSData): string {
    const changedItems: string[] = [];
    
    if (data.oldBusNumber && data.newBusNumber && data.oldBusNumber !== data.newBusNumber) {
      changedItems.push(`Bus: ${data.oldBusNumber} → ${data.newBusNumber}`);
    }
    
    if (data.oldRoute && data.newRoute && data.oldRoute !== data.newRoute) {
      changedItems.push(`Route: ${data.oldRoute} → ${data.newRoute}`);
    }

    return `Dear Parent,

Transport details have been updated for ${data.studentName} (${data.enrollmentNo}).

${changedItems.length > 0 ? 'Changes:\n' + changedItems.join('\n') : ''}

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

  /**
   * Generate SMS for bus stop change
   */
  static generateStopChangeSMS(data: SMSData & { oldStop: string; newStop: string }): string {
    return `Dear Parent,

Transport pickup/drop point has been changed for ${data.studentName} (${data.enrollmentNo}).

Previous Stop: ${data.oldStop}
New Stop: ${data.newStop}

Bus No: ${data.busNumber}
Route: ${data.routeName}

Driver: ${data.driverName} (${data.driverContact})

Effective From: ${data.effectiveDate}

Please ensure your child uses the new stop location.

Shantiniketan Indian School
Transport Department`;
  }

  /**
   * Generate SMS for transport reminder
   */
  static generateReminderSMS(data: SMSData): string {
    return `Dear Parent,

This is a reminder about the transport service for ${data.studentName} (${data.enrollmentNo}).

Bus No: ${data.busNumber}
Route: ${data.routeName}
Stop: ${data.stopName}

Driver: ${data.driverName} (${data.driverContact})
Conductor: ${data.conductorName} (${data.conductorContact})

Important Reminders:
• Be at stop 5 minutes early
• Carry school ID card
• Follow safety rules
• Inform driver about absence

Shantiniketan Indian School
Transport Department`;
  }

  /**
   * Generate SMS for driver/conductor change
   */
  static generateStaffChangeSMS(data: SMSData & { 
    oldDriver?: string; 
    newDriver?: string;
    oldConductor?: string;
    newConductor?: string;
  }): string {
    const changes: string[] = [];
    
    if (data.oldDriver && data.newDriver) {
      changes.push(`Driver: ${data.oldDriver} → ${data.newDriver}`);
    }
    
    if (data.oldConductor && data.newConductor) {
      changes.push(`Conductor: ${data.oldConductor} → ${data.newConductor}`);
    }

    return `Dear Parent,

Transport staff has been updated for Bus ${data.busNumber} serving ${data.routeName}.

${changes.length > 0 ? 'Changes:\n' + changes.join('\n') : ''}

Current Staff:
Driver: ${data.driverName} (${data.driverContact})
Conductor: ${data.conductorName} (${data.conductorContact})

All other transport details remain unchanged.

Shantiniketan Indian School
Transport Department`;
  }

  /**
   * Generate SMS for emergency/urgent notice
   */
  static generateEmergencySMS(
    studentName: string,
    enrollmentNo: string,
    busNumber: string,
    message: string
  ): string {
    return `URGENT NOTICE

Dear Parent of ${studentName} (${enrollmentNo}),

${message}

Bus No: ${busNumber}

For immediate assistance, please contact:
Transport Office: [Transport Office Number]

Shantiniketan Indian School
Transport Department`;
  }

  /**
   * Generate SMS for delay notification
   */
  static generateDelaySMS(
    busNumber: string,
    routeName: string,
    delayMinutes: number,
    reason: string
  ): string {
    return `Dear Parents,

Bus ${busNumber} (${routeName}) is running approximately ${delayMinutes} minutes late.

Reason: ${reason}

We apologize for the inconvenience. Please wait at your designated stop.

Thank you for your patience.

Shantiniketan Indian School
Transport Department`;
  }

  /**
   * Generate SMS for route suspension
   */
  static generateRouteSuspensionSMS(
    date: string,
    busNumber: string,
    routeName: string,
    reason: string
  ): string {
    return `Dear Parents,

Transport service is temporarily suspended for:

Date: ${date}
Bus No: ${busNumber}
Route: ${routeName}

Reason: ${reason}

Please make alternative arrangements for this date.

Regular service will resume on the next scheduled day.

Shantiniketan Indian School
Transport Department`;
  }

  /**
   * Format phone number for SMS sending
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add Qatar country code if not present
    if (!cleaned.startsWith('974')) {
      cleaned = '974' + cleaned;
    }
    
    return '+' + cleaned;
  }

  /**
   * Validate SMS data
   */
  static validateSMSData(data: Partial<SMSData>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.studentName) errors.push('Student name is required');
    if (!data.enrollmentNo) errors.push('Enrollment number is required');
    if (!data.busNumber) errors.push('Bus number is required');
    if (!data.routeNumber) errors.push('Route number is required');
    if (!data.effectiveDate) errors.push('Effective date is required');

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get SMS template by type
   */
  static getSMSTemplate(type: 'registration' | 'cancellation' | 'route_change' | 'reminder'): string {
    const templates = {
      registration: 'New transport registration confirmation',
      cancellation: 'Transport service cancellation notice',
      route_change: 'Transport route/bus change notification',
      reminder: 'Transport service reminder',
    };

    return templates[type] || 'General transport notification';
  }

  /**
   * Get character count for SMS (useful for determining message segments)
   */
  static getCharacterCount(message: string): { 
    count: number; 
    segments: number;
    remaining: number;
  } {
    const count = message.length;
    const segmentSize = 160; // Standard SMS segment size
    const segments = Math.ceil(count / segmentSize);
    const remaining = (segments * segmentSize) - count;

    return { count, segments, remaining };
  }

  /**
   * Batch SMS generation for multiple students
   */
  static generateBatchSMS(
    type: 'registration' | 'cancellation' | 'route_change',
    students: SMSData[]
  ): Array<{ enrollmentNo: string; message: string; phoneNumbers: string[] }> {
    return students.map(student => ({
      enrollmentNo: student.enrollmentNo,
      message: type === 'registration' 
        ? this.generateRegistrationSMS(student)
        : type === 'cancellation'
        ? this.generateCancellationSMS(student)
        : this.generateRouteChangeSMS(student),
      phoneNumbers: [], // To be filled with actual phone numbers
    }));
  }
}

// Export convenience functions
export const {
  generateRegistrationSMS,
  generateCancellationSMS,
  generateRouteChangeSMS,
  generateStopChangeSMS,
  generateReminderSMS,
  generateStaffChangeSMS,
  generateEmergencySMS,
  generateDelaySMS,
  generateRouteSuspensionSMS,
  formatPhoneNumber,
  validateSMSData,
  getSMSTemplate,
  getCharacterCount,
  generateBatchSMS,
} = SMSTemplateService;
