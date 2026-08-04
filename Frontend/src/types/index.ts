export type Role = 'employee' | 'manager' | 'admin';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type LeaveType = 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'unpaid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  designation: string;
  phone: string;
  avatar?: string;
  employeeId: string;
  joinDate: string;
  status: 'active' | 'inactive';
  managerId?: string;
}

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  avatar?: string;
  leaveType: LeaveType;
  leaveLabel: string;
  fromDate: string;
  toDate: string;
  days: number;
  halfDay: boolean;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  attachments?: string[];
  emergencyContact?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  role: Role;
  status: 'active' | 'inactive';
  joinDate: string;
  avatar?: string;
  managerId?: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  headId: string;
  totalEmployees: number;
  description: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'regional' | 'optional';
  description?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'leave_summary' | 'employee' | 'department' | 'monthly' | 'yearly';
  generatedAt: string;
  data: Record<string, unknown>;
}
