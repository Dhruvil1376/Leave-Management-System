import axios from 'axios';
import { LEAVE_REQUESTS, EMPLOYEES, DEPARTMENTS, HOLIDAYS, NOTIFICATIONS, LEAVE_BALANCES } from '../data/mockData';
import type { LeaveRequest, Employee, Department, Holiday, Notification, LeaveBalance } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const api = axios.create({ baseURL: '/api', timeout: 5000 });

// Leave Requests
export const leaveService = {
  getAll: async (): Promise<LeaveRequest[]> => {
    await delay(400);
    return [...LEAVE_REQUESTS];
  },
  getById: async (id: string): Promise<LeaveRequest | undefined> => {
    await delay(200);
    return LEAVE_REQUESTS.find(r => r.id === id);
  },
  getByEmployee: async (employeeId: string): Promise<LeaveRequest[]> => {
    await delay(300);
    return LEAVE_REQUESTS.filter(r => r.employeeId === employeeId);
  },
  getPending: async (): Promise<LeaveRequest[]> => {
    await delay(300);
    return LEAVE_REQUESTS.filter(r => r.status === 'pending');
  },
  create: async (data: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    await delay(600);
    const newRequest: LeaveRequest = {
      id: `lr${Date.now()}`,
      employeeId: data.employeeId || '',
      employeeName: data.employeeName || '',
      department: data.department || '',
      designation: data.designation || '',
      leaveType: data.leaveType || 'casual',
      leaveLabel: data.leaveLabel || 'Casual Leave',
      fromDate: data.fromDate || '',
      toDate: data.toDate || '',
      days: data.days || 1,
      halfDay: data.halfDay || false,
      reason: data.reason || '',
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      emergencyContact: data.emergencyContact,
    };
    LEAVE_REQUESTS.push(newRequest);
    return newRequest;
  },
  approve: async (id: string, approvedBy: string): Promise<LeaveRequest> => {
    await delay(400);
    const req = LEAVE_REQUESTS.find(r => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = 'approved';
    req.approvedBy = approvedBy;
    req.approvedDate = new Date().toISOString().split('T')[0];
    return req;
  },
  reject: async (id: string, reason: string, rejectedBy: string): Promise<LeaveRequest> => {
    await delay(400);
    const req = LEAVE_REQUESTS.find(r => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = 'rejected';
    req.rejectionReason = reason;
    req.approvedBy = rejectedBy;
    req.approvedDate = new Date().toISOString().split('T')[0];
    return req;
  },
  cancel: async (id: string): Promise<LeaveRequest> => {
    await delay(400);
    const req = LEAVE_REQUESTS.find(r => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = 'cancelled';
    return req;
  },
};

export const employeeService = {
  getAll: async (): Promise<Employee[]> => { await delay(400); return [...EMPLOYEES]; },
  getById: async (id: string): Promise<Employee | undefined> => { await delay(200); return EMPLOYEES.find(e => e.id === id); },
  create: async (data: Partial<Employee>): Promise<Employee> => {
    await delay(600);
    const newEmp: Employee = { id: `u${Date.now()}`, employeeId: `EMP${String(EMPLOYEES.length + 1).padStart(3, '0')}`, name: data.name || '', email: data.email || '', phone: data.phone || '', department: data.department || '', designation: data.designation || '', role: data.role || 'employee', status: 'active', joinDate: new Date().toISOString().split('T')[0] };
    EMPLOYEES.push(newEmp);
    return newEmp;
  },
  update: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    await delay(400);
    const idx = EMPLOYEES.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Employee not found');
    EMPLOYEES[idx] = { ...EMPLOYEES[idx], ...data };
    return EMPLOYEES[idx];
  },
  delete: async (id: string): Promise<void> => {
    await delay(400);
    const idx = EMPLOYEES.findIndex(e => e.id === id);
    if (idx !== -1) EMPLOYEES.splice(idx, 1);
  },
};

export const departmentService = {
  getAll: async (): Promise<Department[]> => { await delay(300); return [...DEPARTMENTS]; },
  create: async (data: Partial<Department>): Promise<Department> => {
    await delay(500);
    const d: Department = { id: `d${Date.now()}`, name: data.name || '', head: data.head || '', headId: data.headId || '', totalEmployees: 0, description: data.description || '' };
    DEPARTMENTS.push(d);
    return d;
  },
  update: async (id: string, data: Partial<Department>): Promise<Department> => {
    await delay(400);
    const idx = DEPARTMENTS.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Department not found');
    DEPARTMENTS[idx] = { ...DEPARTMENTS[idx], ...data };
    return DEPARTMENTS[idx];
  },
  delete: async (id: string): Promise<void> => {
    await delay(400);
    const idx = DEPARTMENTS.findIndex(d => d.id === id);
    if (idx !== -1) DEPARTMENTS.splice(idx, 1);
  },
};

export const holidayService = {
  getAll: async (): Promise<Holiday[]> => { await delay(300); return [...HOLIDAYS]; },
  create: async (data: Partial<Holiday>): Promise<Holiday> => {
    await delay(400);
    const h: Holiday = { id: `h${Date.now()}`, name: data.name || '', date: data.date || '', type: data.type || 'national', description: data.description };
    HOLIDAYS.push(h);
    return h;
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const idx = HOLIDAYS.findIndex(h => h.id === id);
    if (idx !== -1) HOLIDAYS.splice(idx, 1);
  },
};

export const notificationService = {
  getAll: async (): Promise<Notification[]> => { await delay(200); return [...NOTIFICATIONS]; },
  markRead: async (id: string): Promise<void> => {
    await delay(200);
    const n = NOTIFICATIONS.find(n => n.id === id);
    if (n) n.read = true;
  },
  markAllRead: async (): Promise<void> => {
    await delay(200);
    NOTIFICATIONS.forEach(n => n.read = true);
  },
};

export const leaveBalanceService = {
  getByEmployee: async (_employeeId: string): Promise<LeaveBalance[]> => {
    await delay(300);
    return [...LEAVE_BALANCES];
  },
};

export default api;
