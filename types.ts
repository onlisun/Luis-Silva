
export enum LeaveType {
  ZOR = 'ZOR',
  DOK = 'DOK',
  THU = 'THU',
}

export interface LeaveEntry {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  type: LeaveType;
  note: string;
}

export interface LeaveConfig {
  label: string;
  maxDays: number;
  color: string;
  description: string;
}
