import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useToast } from '../../context/ToastContext';

const LEAVE_TYPES = [
  { name: 'Casual Leave', days: 12, description: 'For personal work, family events, or general purposes', color: '#3b82f6', paid: true },
  { name: 'Sick Leave', days: 10, description: 'For illness, medical appointments, and recovery', color: '#ef4444', paid: true },
  { name: 'Earned Leave', days: 20, description: 'Accrued based on service duration, can be carried forward', color: '#10b981', paid: true },
  { name: 'Maternity Leave', days: 90, description: 'For female employees for childbirth and recovery', color: '#f59e0b', paid: true },
  { name: 'Paternity Leave', days: 15, description: 'For male employees after childbirth', color: '#8b5cf6', paid: true },
  { name: 'Unpaid Leave', days: 30, description: 'Leave without pay when other leaves are exhausted', color: '#6b7280', paid: false },
];

export default function LeaveTypes() {
  const { info } = useToast();

  return (
    <div>
      <Breadcrumb items={[{ label: 'Leave Types' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Leave Types</h1><p className="page-subtitle">Configure leave types and policies</p></div>
        <button className="btn-primary" onClick={() => info('Add leave type functionality')}><FiFileText size={15} /> Add Type</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEAVE_TYPES.map((lt, i) => (
          <motion.div key={lt.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card card-hover p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: lt.color + '20' }}>
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: lt.color }} />
              </div>
              <div className="flex items-center gap-1.5">
                {lt.paid ? (
                  <span className="badge badge-approved">Paid</span>
                ) : (
                  <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Unpaid</span>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{lt.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{lt.description}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400">Entitlement</span>
              <span className="text-sm font-bold" style={{ color: lt.color }}>{lt.days} days/year</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
