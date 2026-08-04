import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiCheck, FiX, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { leaveService } from '../../services/api';
import type { LeaveRequest } from '../../types';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/helpers';
import { MONTHLY_LEAVE_DATA, EMPLOYEES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaveService.getAll().then(r => { setRequests(r); setLoading(false); });
  }, []);

  if (loading) return <DashboardSkeleton />;

  const pending = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;
  const teamCount = EMPLOYEES.filter(e => e.managerId === user?.id || e.department === user?.department).length;
  const recent = requests.slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Manager Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Requests" value={pending} icon={<FiClock size={20} />} color="amber" delay={0} />
        <StatCard title="Approved Leaves" value={approved} icon={<FiCheck size={20} />} color="green" delay={0.08} />
        <StatCard title="Rejected Leaves" value={rejected} icon={<FiX size={20} />} color="red" delay={0.16} />
        <StatCard title="Team Members" value={teamCount} icon={<FiUsers size={20} />} color="blue" delay={0.24} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Leave Trend (Monthly)</h3>
            <FiBarChart2 size={15} className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_LEAVE_DATA} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="casual" stackId="a" fill="#3b82f6" name="Casual" />
              <Bar dataKey="sick" stackId="a" fill="#ef4444" name="Sick" />
              <Bar dataKey="earned" stackId="a" fill="#10b981" name="Earned" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Request Overview</h3>
          <div className="space-y-4">
            {[
              { label: 'Pending Review', count: pending, color: '#f59e0b', total: requests.length },
              { label: 'Approved', count: approved, color: '#10b981', total: requests.length },
              { label: 'Rejected', count: rejected, color: '#ef4444', total: requests.length },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.total ? (item.count / item.total) * 100 : 0}%` }} transition={{ delay: 0.5, duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Requests</h3>
          <Link to="/manager/approvals" className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">View all</Link>
        </div>
        <div className="table-container rounded-none border-0">
          <table className="table">
            <thead><tr><th>Employee</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id}>
                  <td className="font-medium text-gray-900 dark:text-white">{r.employeeName}</td>
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
