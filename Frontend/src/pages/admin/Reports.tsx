import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiBarChart2, FiCalendar } from 'react-icons/fi';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterDropdown from '../../components/ui/FilterDropdown';
import { MONTHLY_LEAVE_DATA, DEPT_LEAVE_DATA } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const PIE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const LEAVE_TYPE_PIE = [
  { name: 'Casual', value: 34 }, { name: 'Sick', value: 22 }, { name: 'Earned', value: 28 },
  { name: 'Maternity', value: 8 }, { name: 'Others', value: 8 },
];

const reportTypes = [
  { id: 'leave_summary', label: 'Leave Summary', icon: <FiFileText size={18} />, desc: 'Overview of all leave requests by type and status' },
  { id: 'employee', label: 'Employee Report', icon: <FiBarChart2 size={18} />, desc: 'Leave taken per employee breakdown' },
  { id: 'department', label: 'Department Report', icon: <FiBarChart2 size={18} />, desc: 'Department-wise leave analytics' },
  { id: 'monthly', label: 'Monthly Report', icon: <FiCalendar size={18} />, desc: 'Month-by-month leave trend analysis' },
  { id: 'yearly', label: 'Yearly Report', icon: <FiCalendar size={18} />, desc: 'Annual leave statistics and comparison' },
];

export default function AdminReports() {
  const { info } = useToast();
  const [period, setPeriod] = useState('2024');
  const [dept, setDept] = useState('');

  const handleExport = (type: string) => info(`${type} export initiated`);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Reports' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Reports & Analytics</h1><p className="page-subtitle">Comprehensive leave data insights</p></div>
        <div className="flex items-center gap-3">
          <FilterDropdown value={period} onChange={setPeriod} options={[{ value: '2024', label: '2024' }, { value: '2023', label: '2023' }]} />
          <div className="flex gap-2">
            {['Excel', 'CSV', 'PDF'].map(t => (
              <button key={t} className="btn-outline text-xs" onClick={() => handleExport(t)}><FiDownload size={12} /> {t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {reportTypes.map((r, i) => (
          <motion.button key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => info(`${r.label} generated`)}
            className="card card-hover p-4 text-left hover:border-primary-300 dark:hover:border-primary-700 transition-colors group">
            <span className="text-primary-600 dark:text-primary-400 mb-2 block group-hover:scale-110 transition-transform">{r.icon}</span>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{r.label}</p>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{r.desc}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Leave Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_LEAVE_DATA} barSize={8} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="casual" fill="#3b82f6" name="Casual" radius={[2,2,0,0]} />
              <Bar dataKey="sick" fill="#ef4444" name="Sick" radius={[2,2,0,0]} />
              <Bar dataKey="earned" fill="#10b981" name="Earned" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Leave Type Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={LEAVE_TYPE_PIE} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {LEAVE_TYPE_PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Department-wise Leave</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT_LEAVE_DATA} barSize={20} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="department" type="category" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
              <Bar dataKey="leaves" fill="#3b82f6" radius={[0,4,4,0]} name="Leaves" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Yearly Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_LEAVE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="casual" stroke="#3b82f6" strokeWidth={2} dot={false} name="Casual" />
              <Line type="monotone" dataKey="sick" stroke="#ef4444" strokeWidth={2} dot={false} name="Sick" />
              <Line type="monotone" dataKey="earned" stroke="#10b981" strokeWidth={2} dot={false} name="Earned" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
