export type AttendanceStatus = 'present' | 'absent';

export interface WorkSession {
  clockIn: number; // timestamp
  clockOut?: number; // timestamp, undefined if still present
}

export interface MemberWorkStatus {
  status: AttendanceStatus;
  sessions: WorkSession[];
}

export type AllMemberWorkStatus = Record<string, MemberWorkStatus>;

export type NotificationMessage = {
  text: string;
  type: 'success' | 'error';
};

export interface Shift {
  time: string;
  startHour: number;
  endHour: number;
  members: string[];
}

export interface ShiftDay {
  date: string; // "YYYY-MM-DD"
  shifts: Shift[];
}