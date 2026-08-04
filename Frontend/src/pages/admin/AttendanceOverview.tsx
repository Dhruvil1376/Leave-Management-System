import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMap, FiUsers, FiCheck } from 'react-icons/fi';
import { employeeService, leaveService } from '../../services/api';
import type { Employee, LeaveRequest } from '../../types';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Avatar from '../../components/ui/Avatar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import SearchBar from '../../components/ui/SearchBar';
import { formatDate } from '../../utils/helpers';
import { DEPARTMENTS } from '../../data/mockData';

export default function AttendanceOverview() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  useEffect(() => {
    Promise.all([employeeService.getAll(), leaveService.getAll()]).then(([e, r]) => { setEmployees(e); setRequests(r); });
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const onLeaveToday = requests.filter(r => {
    const from = new Date(r.fromDate);
    const to = new Date(r.toDate);
    const t = new Date(today);
    return r.status === 'approved' && t >= from && t <= to;
  });

  const onLeaveTodayIds = new Set(onLeaveToday.map(r => r.employeeId));

  const filteredEmp = employees.filter(e =>
    (!search || e.name.toLowerCase().includes(search.toLowerCase())) &&
    (!deptFilter || e.department === deptFilter)
  );

  const present = filteredEmp.filter(e => !onLeaveTodayIds.has(e.id) && e.status === 'active');
  const absent = filteredEmp.filter(e => onLeaveTodayIds.has(e.id));

  return (
    <div>
      <Breadcrumb items={[{ label: 'Attendance' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Attendance Overview</h1><p className="page-subtitle">Today: {formatDate(today)}</p></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Present Today', value: present.length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'On Leave', value: absent.length, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Total Active', value: employees.filter(e => e.status === 'active').length, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        ].map(s => (
          <div key={s.label} className={`card p-5 ${s.bg}`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." className="flex-1 min-w-48" />
        <FilterDropdown value={deptFilter} onChange={setDeptFilter} placeholder="All Departments" options={DEPARTMENTS.map(d => ({ value: d.name, label: d.name }))} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiCheck size={16} className="text-emerald-500" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Present ({present.length})</h3>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {present.map(emp => (
              <div key={emp.id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <Avatar name={emp.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{emp.name}</p>
                  <p className="text-xs text-gray-400 truncate">{emp.department}</p>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Present</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiMap size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">On Leave ({absent.length})</h3>
          </div>
          {absent.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No employees on leave today</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {absent.map(emp => {
                const req = onLeaveToday.find(r => r.employeeId === emp.id);
                return (
                  <div key={emp.id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <Avatar name={emp.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{emp.name}</p>
                      <p className="text-xs text-gray-400 truncate">{req?.leaveLabel || 'Leave'}</p>
                    </div>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">On Leave</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
