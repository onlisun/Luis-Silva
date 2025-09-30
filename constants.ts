
import { LeaveType, LeaveConfig } from './types';

export const HOURS_PER_DAY = 8;

export const LEAVE_CONFIG: Record<LeaveType, LeaveConfig> = {
  [LeaveType.ZOR]: {
    label: 'Zorgverlof (Care Leave)',
    maxDays: 56,
    color: 'bg-blue-500',
    description: 'Max 56 days',
  },
  [LeaveType.DOK]: {
    label: 'Doktersbezoek (Doctor Visit)',
    maxDays: 10,
    color: 'bg-green-500',
    description: 'Max 10 days',
  },
  [LeaveType.THU]: {
    label: 'Thuiswerk (Work From Home)',
    maxDays: 120,
    color: 'bg-purple-500',
    description: 'Max 120 days',
  },
};
