import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiFilter } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { leaveService } from '../../services/api';
import type { LeaveRequest } from '../../types';
import StatusBadge from '../../components/ui/StatusBadge';
import FilterDropdown from '../../components/ui/FilterDropdown';
import EmptyState from '../../components/ui/EmptyState';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/helpers';

export default function LeaveHistory() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('2024');

  useEffect(() => {
    leaveService.getByEmployee(user?.id || '').then(r => {
      setRequests(r.filter(req => req.status !== 'pending'));
      setLoading(false);
    });
  }, [user]);

  const filtered = requests.filter(r => r.appliedDate.startsWith(yearFilter));

  const totalUsed = filtered.filter(r => r.status === 'approved').reduce((a, r) => a + r.days, 0);
  const approved = filtered.filter(r => r.status === 'approved').length;
  const rejected = filtered.filter(r => r.status === 'rejected').length;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Leave History' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave History</h1>
          <p className="page-subtitle">Your past leave records</p>
        </div>
        <FilterDropdown value={yearFilter} onChange={setYearFilter} options={[
          { value: '2024', label: '2024' }, { value: '2023', label: '2023' }, { value: '2022', label: '2022' }
        ]} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Used', value: totalUsed + ' days', color: 'text-primary-600 dark:text-primary-400' },
          { label: 'Approved', value: approved, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Rejected', value: rejected, color: 'text-red-600 dark:text-red-400' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FiClock size={22} />} title="No history found" description="Your approved and rejected leaves will appear here." />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="table-container rounded-none border-0">
              <table className="table">
                <thead><tr>
                  <th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th><th>Approved By</th><th>Notes</th>
                </tr></thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td className="font-medium text-gray-900 dark:text-white">{r.leaveLabel}</td>
                      <td>{formatDate(r.fromDate)}</td>
                      <td>{formatDate(r.toDate)}</td>
                      <td>{r.days}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td className="text-gray-500 text-xs">{r.approvedBy || '—'}</td>
                      <td className="max-w-xs"><p className="text-xs text-gray-400 truncate">{r.rejectionReason || r.reason}</p></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
