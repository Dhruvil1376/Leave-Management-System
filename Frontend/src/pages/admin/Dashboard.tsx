import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiBriefcase, FiClock, FiCheck, FiX, FiActivity } from 'react-icons/fi';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { leaveService, employeeService, departmentService } from '../../services/api';
import type { LeaveRequest } from '../../types';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/helpers';
import { MONTHLY_LEAVE_DATA, DEPT_LEAVE_DATA } from '../../data/mockData';

const PIE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export default function AdminDashboard() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [empCount, setEmpCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([leaveService.getAll(), employeeService.getAll(), departmentService.getAll()])
      .then(([r, e, d]) => { setRequests(r); setEmpCount(e.length); setDeptCount(d.length); setLoading(false); });
  }, []);

  if (loading) return <DashboardSkeleton />;

  const pending = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;
  const activeEmp = empCount - 1;
  const recent = requests.slice(0, 8);

  const leaveTypeData = [
    { name: 'Casual', value: requests.filter(r => r.leaveType === 'casual').length },
    { name: 'Sick', value: requests.filter(r => r.leaveType === 'sick').length },
    { name: 'Earned', value: requests.filter(r => r.leaveType === 'earned').length },
    { name: 'Others', value: requests.filter(r => !['casual','sick','earned'].includes(r.leaveType)).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">HR / Admin Dashboard</h1>
        <p className="page-subtitle">Complete organizational overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Employees" value={empCount} icon={<FiUsers size={20} />} color="blue" delay={0} />
        <StatCard title="Departments" value={deptCount} icon={<FiBriefcase size={20} />} color="cyan" delay={0.05} />
        <StatCard title="Active Employees" value={activeEmp} icon={<FiActivity size={20} />} color="green" delay={0.1} />
        <StatCard title="Pending" value={pending} icon={<FiClock size={20} />} color="amber" delay={0.15} />
        <StatCard title="Approved" value={approved} icon={<FiCheck size={20} />} color="green" delay={0.2} />
        <StatCard title="Rejected" value={rejected} icon={<FiX size={20} />} color="red" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Leave Statistics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_LEAVE_DATA} barSize={8} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="casual" fill="#3b82f6" name="Casual" radius={[2,2,0,0]} />
              <Bar dataKey="sick" fill="#ef4444" name="Sick" radius={[2,2,0,0]} />
              <Bar dataKey="earned" fill="#10b981" name="Earned" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Leave Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leaveTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {leaveTypeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Department-wise Leave Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={MONTHLY_LEAVE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="casual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Casual" />
            <Line type="monotone" dataKey="sick" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Sick" />
            <Line type="monotone" dataKey="earned" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Earned" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Leave Requests</h3>
          <Link to="/admin/leave-requests" className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">View all</Link>
        </div>
        <div className="table-container rounded-none border-0">
          <table className="table">
            <thead><tr><th>Employee</th><th>Department</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id}>
                  <td className="font-medium text-gray-900 dark:text-white">{r.employeeName}</td>
                  <td className="text-gray-500">{r.department}</td>
                  <td>{r.leaveLabel}</td>
                  <td>{formatDate(r.fromDate)}</td>
                  <td>{formatDate(r.toDate)}</td>
                  <td>{r.days}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
