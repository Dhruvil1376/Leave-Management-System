import { format, parseISO, differenceInBusinessDays, addDays } from 'date-fns';
import type { LeaveType } from '../types';

export const formatDate = (date: string) => {
  try { return format(parseISO(date), 'MMM dd, yyyy'); } catch { return date; }
};

export const formatDateTime = (date: string) => {
  try { return format(parseISO(date), 'MMM dd, yyyy • h:mm a'); } catch { return date; }
};

export const formatShort = (date: string) => {
  try { return format(parseISO(date), 'dd MMM'); } catch { return date; }
};

export const calculateWorkingDays = (from: string, to: string): number => {
  try {
    const start = parseISO(from);
    const end = parseISO(to);
    return Math.max(1, differenceInBusinessDays(addDays(end, 1), start));
  } catch { return 1; }
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  casual: 'Casual Leave',
  sick: 'Sick Leave',
  earned: 'Earned Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  unpaid: 'Unpaid Leave',
};

export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  casual: '#3b82f6',
  sick: '#ef4444',
  earned: '#10b981',
  maternity: '#f59e0b',
  paternity: '#8b5cf6',
  unpaid: '#6b7280',
};

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getAvatarColor = (name: string): string => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');
