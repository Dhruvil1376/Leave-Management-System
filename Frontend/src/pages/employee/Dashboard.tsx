import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiCalendar, FiClock } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { leaveBalanceService, leaveService, holidayService } from '../../services/api';
import type { LeaveBalance, LeaveRequest, Holiday } from '../../types';
import LeaveBalanceCard from '../../components/common/LeaveBalanceCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatShort } from '../../utils/helpers';
import { MONTHLY_LEAVE_DATA } from '../../data/mockData';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      leaveBalanceService.getByEmployee(user?.id || ''),
      leaveService.getByEmployee(user?.id || ''),
      holidayService.getAll(),
    ]).then(([b, r, h]) => {
      setBalances(b);
      setRequests(r.slice(0, 5));
      setHolidays(h.filter(h => new Date(h.date) >= new Date()).slice(0, 4));
      setLoading(false);
    });
  }, [user]);

  if (loading) return <DashboardSkeleton />;

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-gradient-to-r from-primary-600 to-primary-700 border-0 text-white overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-16 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-primary-200 text-sm font-medium">{greeting},</p>
          <h2 className="text-2xl font-bold mt-0.5">{user?.name} 👋</h2>
          <p className="text-primary-200 text-sm mt-1">{user?.designation} · {user?.department}</p>
          <div className="flex gap-3 mt-4">
            <Link to="/employee/apply" className="btn bg-white text-primary-700 hover:bg-primary-50 text-sm py-2 font-semibold">
              <FiPlus size={15} /> Apply Leave
            </Link>
            <Link to="/employee/calendar" className="btn border border-white/30 text-white hover:bg-white/10 text-sm py-2">
              <FiCalendar size={15} /> View Calendar
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Leave Balances */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Leave Balances</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {balances.map((b, i) => <LeaveBalanceCard key={b.type} balance={b} delay={i * 0.08} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Leave Statistics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_LEAVE_DATA} barSize={6} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-gray-400" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} className="text-gray-400" axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="casual" fill="#3b82f6" name="Casual" radius={[2,2,0,0]} />
              <Bar dataKey="sick" fill="#ef4444" name="Sick" radius={[2,2,0,0]} />
              <Bar dataKey="earned" fill="#10b981" name="Earned" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Holidays */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Upcoming Holidays</h3>
            <FiCalendar size={15} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {holidays.map(h => (
              <div key={h.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400 leading-none">
                    {new Date(h.date).getDate()}
                  </span>
                  <span className="text-xs text-primary-400 dark:text-primary-500 leading-none">
                    {new Date(h.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{h.name}</p>
                  <span className={`text-xs ${h.type === 'national' ? 'text-blue-500' : h.type === 'regional' ? 'text-amber-500' : 'text-gray-400'}`}>
                    {h.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Leave Requests</h3>
          <Link to="/employee/requests" className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">View all</Link>
        </div>
        {requests.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No leave requests yet</div>
        ) : (
          <div className="table-container rounded-none border-0">
            <table className="table">
              <thead><tr>
                <th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th><th>Applied</th>
              </tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.leaveLabel}</td>
                    <td>{formatDate(r.fromDate)}</td>
                    <td>{formatDate(r.toDate)}</td>
                    <td>{r.days}{r.halfDay ? ' (Half)' : ''}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="text-gray-400">{formatDate(r.appliedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
