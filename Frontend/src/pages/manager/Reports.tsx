import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { leaveService } from '../../services/api';
import type { LeaveRequest } from '../../types';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterDropdown from '../../components/ui/FilterDropdown';
import { MONTHLY_LEAVE_DATA, DEPT_LEAVE_DATA } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const PIE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ManagerReports() {
  const { info } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [period, setPeriod] = useState('2024');

  useEffect(() => { leaveService.getAll().then(setRequests); }, []);

  const leaveTypeData = [
    { name: 'Casual', value: requests.filter(r => r.leaveType === 'casual').length },
    { name: 'Sick', value: requests.filter(r => r.leaveType === 'sick').length },
    { name: 'Earned', value: requests.filter(r => r.leaveType === 'earned').length },
    { name: 'Others', value: requests.filter(r => !['casual','sick','earned'].includes(r.leaveType)).length },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Reports' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Reports & Analytics</h1><p className="page-subtitle">Team leave insights</p></div>
        <div className="flex items-center gap-3">
          <FilterDropdown value={period} onChange={setPeriod} options={[
            { value: '2024', label: '2024' }, { value: '2023', label: '2023' }
          ]} />
          <button className="btn-outline text-xs" onClick={() => info('Export functionality coming soon')}><FiDownload size={14} /> Export</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Leave Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_LEAVE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="casual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Casual" />
              <Line type="monotone" dataKey="sick" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Sick" />
              <Line type="monotone" dataKey="earned" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Earned" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Leave Type Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leaveTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {leaveTypeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Department-wise Leave</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={DEPT_LEAVE_DATA} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
            <Bar dataKey="leaves" fill="#3b82f6" radius={[4,4,0,0]} name="Total Leaves" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
