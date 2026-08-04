import type { User, Employee, LeaveRequest, LeaveBalance, Department, Holiday, Notification } from '../types';

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'employee@demo.com',
    role: 'employee',
    department: 'Engineering',
    designation: 'Software Engineer',
    phone: '+1 555-0101',
    employeeId: 'EMP001',
    joinDate: '2022-03-15',
    status: 'active',
    managerId: 'u2',
  },
  {
    id: 'u2',
    name: 'Sarah Mitchell',
    email: 'manager@demo.com',
    role: 'manager',
    department: 'Engineering',
    designation: 'Engineering Manager',
    phone: '+1 555-0102',
    employeeId: 'EMP002',
    joinDate: '2019-06-01',
    status: 'active',
  },
  {
    id: 'u3',
    name: 'Michael Chen',
    email: 'admin@demo.com',
    role: 'admin',
    department: 'Human Resources',
    designation: 'HR Manager',
    phone: '+1 555-0103',
    employeeId: 'EMP003',
    joinDate: '2018-01-10',
    status: 'active',
  },
];

export const CREDENTIALS: Record<string, string> = {
  'employee@demo.com': 'password123',
  'manager@demo.com': 'password123',
  'admin@demo.com': 'password123',
};

export const LEAVE_BALANCES: LeaveBalance[] = [
  { type: 'casual', label: 'Casual Leave', total: 12, used: 4, remaining: 8, color: '#3b82f6' },
  { type: 'sick', label: 'Sick Leave', total: 10, used: 2, remaining: 8, color: '#ef4444' },
  { type: 'earned', label: 'Earned Leave', total: 20, used: 7, remaining: 13, color: '#10b981' },
  { type: 'maternity', label: 'Maternity Leave', total: 90, used: 0, remaining: 90, color: '#f59e0b' },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1', employeeId: 'u1', employeeName: 'Alex Johnson', department: 'Engineering',
    designation: 'Software Engineer', leaveType: 'casual', leaveLabel: 'Casual Leave',
    fromDate: '2024-07-10', toDate: '2024-07-12', days: 3, halfDay: false,
    reason: 'Family function and personal commitments', status: 'pending',
    appliedDate: '2024-07-05', emergencyContact: '+1 555-9999',
  },
  {
    id: 'lr2', employeeId: 'u4', employeeName: 'Priya Sharma', department: 'Design',
    designation: 'UI Designer', leaveType: 'sick', leaveLabel: 'Sick Leave',
    fromDate: '2024-07-08', toDate: '2024-07-09', days: 2, halfDay: false,
    reason: 'Not feeling well, doctor advised rest', status: 'approved',
    appliedDate: '2024-07-07', approvedBy: 'Sarah Mitchell', approvedDate: '2024-07-07',
  },
  {
    id: 'lr3', employeeId: 'u5', employeeName: 'David Park', department: 'Marketing',
    designation: 'Marketing Specialist', leaveType: 'earned', leaveLabel: 'Earned Leave',
    fromDate: '2024-07-15', toDate: '2024-07-19', days: 5, halfDay: false,
    reason: 'Annual vacation trip', status: 'approved',
    appliedDate: '2024-07-01', approvedBy: 'Sarah Mitchell', approvedDate: '2024-07-03',
  },
  {
    id: 'lr4', employeeId: 'u6', employeeName: 'Emma Wilson', department: 'Finance',
    designation: 'Financial Analyst', leaveType: 'casual', leaveLabel: 'Casual Leave',
    fromDate: '2024-07-20', toDate: '2024-07-20', days: 1, halfDay: false,
    reason: 'Personal work', status: 'rejected',
    appliedDate: '2024-07-18', approvedBy: 'Sarah Mitchell', approvedDate: '2024-07-18',
    rejectionReason: 'Critical deadline scheduled on that day',
  },
  {
    id: 'lr5', employeeId: 'u7', employeeName: 'James Rodriguez', department: 'Engineering',
    designation: 'DevOps Engineer', leaveType: 'sick', leaveLabel: 'Sick Leave',
    fromDate: '2024-07-22', toDate: '2024-07-23', days: 2, halfDay: false,
    reason: 'Medical appointment and recovery', status: 'pending',
    appliedDate: '2024-07-20',
  },
  {
    id: 'lr6', employeeId: 'u1', employeeName: 'Alex Johnson', department: 'Engineering',
    designation: 'Software Engineer', leaveType: 'casual', leaveLabel: 'Casual Leave',
    fromDate: '2024-06-05', toDate: '2024-06-07', days: 3, halfDay: false,
    reason: 'Birthday celebration', status: 'approved',
    appliedDate: '2024-06-01', approvedBy: 'Sarah Mitchell', approvedDate: '2024-06-02',
  },
  {
    id: 'lr7', employeeId: 'u8', employeeName: 'Lisa Chen', department: 'Product',
    designation: 'Product Manager', leaveType: 'earned', leaveLabel: 'Earned Leave',
    fromDate: '2024-07-25', toDate: '2024-07-31', days: 7, halfDay: false,
    reason: 'Family vacation', status: 'pending',
    appliedDate: '2024-07-12',
  },
  {
    id: 'lr8', employeeId: 'u9', employeeName: 'Tom Harris', department: 'Sales',
    designation: 'Sales Executive', leaveType: 'casual', leaveLabel: 'Casual Leave',
    fromDate: '2024-07-18', toDate: '2024-07-18', days: 1, halfDay: true,
    reason: 'Medical check-up', status: 'approved',
    appliedDate: '2024-07-17', approvedBy: 'Sarah Mitchell', approvedDate: '2024-07-17',
  },
];

export const EMPLOYEES: Employee[] = [
  { id: 'u1', employeeId: 'EMP001', name: 'Alex Johnson', email: 'alex@company.com', phone: '+1 555-0101', department: 'Engineering', designation: 'Software Engineer', role: 'employee', status: 'active', joinDate: '2022-03-15', managerId: 'u2' },
  { id: 'u2', employeeId: 'EMP002', name: 'Sarah Mitchell', email: 'sarah@company.com', phone: '+1 555-0102', department: 'Engineering', designation: 'Engineering Manager', role: 'manager', status: 'active', joinDate: '2019-06-01' },
  { id: 'u3', employeeId: 'EMP003', name: 'Michael Chen', email: 'michael@company.com', phone: '+1 555-0103', department: 'Human Resources', designation: 'HR Manager', role: 'admin', status: 'active', joinDate: '2018-01-10' },
  { id: 'u4', employeeId: 'EMP004', name: 'Priya Sharma', email: 'priya@company.com', phone: '+1 555-0104', department: 'Design', designation: 'UI Designer', role: 'employee', status: 'active', joinDate: '2021-08-20', managerId: 'u2' },
  { id: 'u5', employeeId: 'EMP005', name: 'David Park', email: 'david@company.com', phone: '+1 555-0105', department: 'Marketing', designation: 'Marketing Specialist', role: 'employee', status: 'active', joinDate: '2020-11-05', managerId: 'u2' },
  { id: 'u6', employeeId: 'EMP006', name: 'Emma Wilson', email: 'emma@company.com', phone: '+1 555-0106', department: 'Finance', designation: 'Financial Analyst', role: 'employee', status: 'active', joinDate: '2023-01-12', managerId: 'u2' },
  { id: 'u7', employeeId: 'EMP007', name: 'James Rodriguez', email: 'james@company.com', phone: '+1 555-0107', department: 'Engineering', designation: 'DevOps Engineer', role: 'employee', status: 'active', joinDate: '2021-05-18', managerId: 'u2' },
  { id: 'u8', employeeId: 'EMP008', name: 'Lisa Chen', email: 'lisa@company.com', phone: '+1 555-0108', department: 'Product', designation: 'Product Manager', role: 'manager', status: 'active', joinDate: '2020-03-22' },
  { id: 'u9', employeeId: 'EMP009', name: 'Tom Harris', email: 'tom@company.com', phone: '+1 555-0109', department: 'Sales', designation: 'Sales Executive', role: 'employee', status: 'active', joinDate: '2022-09-10', managerId: 'u8' },
  { id: 'u10', employeeId: 'EMP010', name: 'Anna Brown', email: 'anna@company.com', phone: '+1 555-0110', department: 'Engineering', designation: 'QA Engineer', role: 'employee', status: 'inactive', joinDate: '2021-07-01', managerId: 'u2' },
];

export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Engineering', head: 'Sarah Mitchell', headId: 'u2', totalEmployees: 5, description: 'Software development and infrastructure' },
  { id: 'd2', name: 'Design', head: 'Priya Sharma', headId: 'u4', totalEmployees: 3, description: 'UI/UX and visual design' },
  { id: 'd3', name: 'Marketing', head: 'David Park', headId: 'u5', totalEmployees: 4, description: 'Brand and growth marketing' },
  { id: 'd4', name: 'Finance', head: 'Emma Wilson', headId: 'u6', totalEmployees: 3, description: 'Financial planning and analysis' },
  { id: 'd5', name: 'Human Resources', head: 'Michael Chen', headId: 'u3', totalEmployees: 2, description: 'People operations and culture' },
  { id: 'd6', name: 'Product', head: 'Lisa Chen', headId: 'u8', totalEmployees: 4, description: 'Product strategy and management' },
  { id: 'd7', name: 'Sales', head: 'Tom Harris', headId: 'u9', totalEmployees: 6, description: 'Sales and business development' },
];

export const HOLIDAYS: Holiday[] = [
  { id: 'h1', name: "New Year's Day", date: '2024-01-01', type: 'national' },
  { id: 'h2', name: 'Martin Luther King Jr. Day', date: '2024-01-15', type: 'national' },
  { id: 'h3', name: "Presidents' Day", date: '2024-02-19', type: 'national' },
  { id: 'h4', name: 'Memorial Day', date: '2024-05-27', type: 'national' },
  { id: 'h5', name: 'Independence Day', date: '2024-07-04', type: 'national' },
  { id: 'h6', name: 'Labor Day', date: '2024-09-02', type: 'national' },
  { id: 'h7', name: 'Thanksgiving Day', date: '2024-11-28', type: 'national' },
  { id: 'h8', name: 'Christmas Day', date: '2024-12-25', type: 'national' },
  { id: 'h9', name: 'Company Foundation Day', date: '2024-08-15', type: 'optional' },
  { id: 'h10', name: 'Diwali', date: '2024-11-01', type: 'regional' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Leave Request Approved', message: 'Your casual leave request for Jun 5–7 has been approved.', type: 'success', read: false, createdAt: '2024-06-02T10:30:00Z' },
  { id: 'n2', title: 'Leave Request Submitted', message: 'Your leave request has been submitted for approval.', type: 'info', read: false, createdAt: '2024-07-05T09:00:00Z' },
  { id: 'n3', title: 'Holiday Reminder', message: 'Independence Day holiday on July 4th, 2024.', type: 'info', read: true, createdAt: '2024-07-01T08:00:00Z' },
  { id: 'n4', title: 'Leave Balance Low', message: 'Your sick leave balance is running low (2 days remaining).', type: 'warning', read: true, createdAt: '2024-06-25T11:00:00Z' },
];

export const MONTHLY_LEAVE_DATA = [
  { month: 'Jan', casual: 3, sick: 2, earned: 1, maternity: 0 },
  { month: 'Feb', casual: 2, sick: 4, earned: 0, maternity: 0 },
  { month: 'Mar', casual: 5, sick: 1, earned: 2, maternity: 1 },
  { month: 'Apr', casual: 4, sick: 3, earned: 3, maternity: 0 },
  { month: 'May', casual: 3, sick: 2, earned: 5, maternity: 0 },
  { month: 'Jun', casual: 6, sick: 1, earned: 4, maternity: 0 },
  { month: 'Jul', casual: 4, sick: 5, earned: 2, maternity: 0 },
  { month: 'Aug', casual: 2, sick: 3, earned: 6, maternity: 0 },
  { month: 'Sep', casual: 5, sick: 2, earned: 3, maternity: 1 },
  { month: 'Oct', casual: 3, sick: 4, earned: 1, maternity: 0 },
  { month: 'Nov', casual: 4, sick: 2, earned: 4, maternity: 0 },
  { month: 'Dec', casual: 7, sick: 3, earned: 5, maternity: 0 },
];

export const DEPT_LEAVE_DATA = [
  { department: 'Engineering', leaves: 18 },
  { department: 'Design', leaves: 9 },
  { department: 'Marketing', leaves: 12 },
  { department: 'Finance', leaves: 7 },
  { department: 'HR', leaves: 5 },
  { department: 'Product', leaves: 11 },
  { department: 'Sales', leaves: 14 },
];
