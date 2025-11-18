export enum LogStatus {
  REPORTED = 'Reported',
  IN_PROGRESS = 'In Progress',
  PENDING_PARTS = 'Pending Parts',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export interface MaintenanceLog {
  id: string;
  computerModel: string;
  serialNumber: string;
  owner: string;
  ipAddress?: string;
  reportedIssue: string;
  diagnosis: string;
  actionsTaken: string;
  status: LogStatus;
  imageUrl?: string;
  logDate: string;
}
