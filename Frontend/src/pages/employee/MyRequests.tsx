import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiFilter, FiX, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { leaveService } from '../../services/api';
import type { LeaveRequest } from '../../types';
import StatusBadge from '../../components/ui/StatusBadge';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/helpers';

const PAGE_SIZE = 8;

export default function MyRequests() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [viewRequest, setViewRequest] = useState<LeaveRequest | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    leaveService.getByEmployee(user?.id || '').then(r => { setRequests(r); setLoading(false); });
  }, [user]);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    return (
      (!q || r.leaveLabel.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q)) &&
      (!statusFilter || r.status === statusFilter) &&
      (!typeFilter || r.leaveType === typeFilter)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelLoading(true);
    try {
      await leaveService.cancel(cancelId);
      setRequests(prev => prev.map(r => r.id === cancelId ? { ...r, status: 'cancelled' as const } : r));
      success('Leave request cancelled');
    } catch { error('Failed to cancel'); } finally {
      setCancelLoading(false);
      setCancelId(null);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'My Requests' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">My Leave Requests</h1>
          <p className="page-subtitle">{filtered.length} total requests</p>
        </div>
        <Link to="/employee/apply" className="btn-primary"><FiPlus size={15} /> Apply Leave</Link>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search leaves..." className="flex-1 min-w-48" />
          <FilterDropdown value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} placeholder="All Status" options={[
            { value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' }, { value: 'cancelled', label: 'Cancelled' }
          ]} />
          <FilterDropdown value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} placeholder="All Types" options={[
            { value: 'casual', label: 'Casual' }, { value: 'sick', label: 'Sick' },
            { value: 'earned', label: 'Earned' }, { value: 'maternity', label: 'Maternity' },
          ]} />
          {(search || statusFilter || typeFilter) && (
            <button className="btn-outline text-xs" onClick={() => { setSearch(''); setStatusFilter(''); setTypeFilter(''); }}>
              <FiX size={13} /> Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : paginated.length === 0 ? (
          <EmptyState icon={<FiFilter size={22} />} title="No requests found" description="Try adjusting your filters or apply for a leave." action={<Link to="/employee/apply" className="btn-primary"><FiPlus size={14} /> Apply Leave</Link>} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="table-container rounded-none border-0">
              <table className="table">
                <thead><tr>
                  <th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Applied</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {paginated.map(r => (
                    <tr key={r.id}>
                      <td className="font-medium text-gray-900 dark:text-white">{r.leaveLabel}</td>
                      <td>{formatDate(r.fromDate)}</td>
                      <td>{formatDate(r.toDate)}</td>
                      <td>{r.days}{r.halfDay ? ' (Half)' : ''}</td>
                      <td className="max-w-xs"><p className="truncate text-gray-500 dark:text-gray-400">{r.reason}</p></td>
                      <td><StatusBadge status={r.status} /></td>
                      <td className="text-gray-400 text-xs">{formatDate(r.appliedDate)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewRequest(r)} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><FiEye size={14} /></button>
                          {r.status === 'pending' && (
                            <button onClick={() => setCancelId(r.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiX size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={PAGE_SIZE} />
          </motion.div>
        )}
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewRequest} onClose={() => setViewRequest(null)} title="Leave Request Details" size="md">
        {viewRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Leave Type', viewRequest.leaveLabel],
                ['Status', ''],
                ['From Date', formatDate(viewRequest.fromDate)],
                ['To Date', formatDate(viewRequest.toDate)],
                ['Days', `${viewRequest.days}${viewRequest.halfDay ? ' (Half Day)' : ''}`],
                ['Applied On', formatDate(viewRequest.appliedDate)],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                  {k === 'Status' ? <StatusBadge status={viewRequest.status} /> : <p className="font-medium text-gray-800 dark:text-gray-200">{v}</p>}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Reason</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">{viewRequest.reason}</p>
            </div>
            {viewRequest.rejectionReason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-0.5">Rejection Reason</p>
                <p className="text-sm text-red-700 dark:text-red-300">{viewRequest.rejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Leave Request"
        message="Are you sure you want to cancel this leave request?"
        confirmLabel="Cancel Request"
        isLoading={cancelLoading}
      />
    </div>
  );
}
