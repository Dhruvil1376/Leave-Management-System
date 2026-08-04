import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiEye, FiFilter } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { leaveService } from '../../services/api';
import type { LeaveRequest } from '../../types';
import StatusBadge from '../../components/ui/StatusBadge';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/helpers';

const PAGE_SIZE = 8;

export default function LeaveApprovals() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewReq, setViewReq] = useState<LeaveRequest | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    leaveService.getAll().then(r => { setRequests(r); setLoading(false); });
  }, []);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    return (
      (!q || r.employeeName.toLowerCase().includes(q) || r.leaveLabel.toLowerCase().includes(q)) &&
      (!statusFilter || r.status === statusFilter) &&
      (!typeFilter || r.leaveType === typeFilter)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApprove = async () => {
    if (!approveId) return;
    setActionLoading(true);
    try {
      await leaveService.approve(approveId, user?.name || '');
      setRequests(prev => prev.map(r => r.id === approveId ? { ...r, status: 'approved' as const, approvedBy: user?.name, approvedDate: new Date().toISOString().split('T')[0] } : r));
      success('Leave request approved');
    } catch { error('Failed to approve'); } finally { setActionLoading(false); setApproveId(null); }
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) { error('Please provide a rejection reason'); return; }
    setActionLoading(true);
    try {
      await leaveService.reject(rejectId, rejectReason, user?.name || '');
      setRequests(prev => prev.map(r => r.id === rejectId ? { ...r, status: 'rejected' as const, rejectionReason: rejectReason, approvedBy: user?.name, approvedDate: new Date().toISOString().split('T')[0] } : r));
      success('Leave request rejected');
    } catch { error('Failed to reject'); } finally { setActionLoading(false); setRejectId(null); setRejectReason(''); }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Leave Approvals' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Approvals</h1>
          <p className="page-subtitle">{requests.filter(r => r.status === 'pending').length} pending approvals</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search employee..." className="flex-1 min-w-48" />
          <FilterDropdown value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} placeholder="All Status" options={[
            { value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }
          ]} />
          <FilterDropdown value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} placeholder="All Types" options={[
            { value: 'casual', label: 'Casual' }, { value: 'sick', label: 'Sick' }, { value: 'earned', label: 'Earned' }
          ]} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : paginated.length === 0 ? (
          <EmptyState icon={<FiFilter size={22} />} title="No requests found" />
        ) : (
          <AnimatePresence>
            <div className="table-container rounded-none border-0">
              <table className="table">
                <thead><tr>
                  <th>Employee</th><th>Department</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {paginated.map(r => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={r.employeeName} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-xs">{r.employeeName}</p>
                            <p className="text-xs text-gray-400">{r.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-500">{r.department}</td>
                      <td>{r.leaveLabel}</td>
                      <td>{formatDate(r.fromDate)}</td>
                      <td>{formatDate(r.toDate)}</td>
                      <td>{r.days}{r.halfDay ? ' (H)' : ''}</td>
                      <td className="max-w-xs"><p className="truncate text-gray-500 dark:text-gray-400 text-xs">{r.reason}</p></td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewReq(r)} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors" title="View">
                            <FiEye size={14} />
                          </button>
                          {r.status === 'pending' && (
                            <>
                              <button onClick={() => setApproveId(r.id)} className="p-1.5 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Approve">
                                <FiCheck size={14} />
                              </button>
                              <button onClick={() => setRejectId(r.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Reject">
                                <FiX size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={PAGE_SIZE} />
          </AnimatePresence>
        )}
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewReq} onClose={() => setViewReq(null)} title="Leave Request Details">
        {viewReq && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
              <Avatar name={viewReq.employeeName} size="md" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{viewReq.employeeName}</p>
                <p className="text-sm text-gray-400">{viewReq.designation} · {viewReq.department}</p>
              </div>
              <div className="ml-auto"><StatusBadge status={viewReq.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Leave Type', viewReq.leaveLabel], ['Days', `${viewReq.days}${viewReq.halfDay ? ' (Half)' : ''}`],
                ['From', formatDate(viewReq.fromDate)], ['To', formatDate(viewReq.toDate)],
                ['Applied On', formatDate(viewReq.appliedDate)], ['Emergency Contact', viewReq.emergencyContact || '—'],
              ].map(([k, v]) => (
                <div key={k}><p className="text-xs text-gray-400 mb-0.5">{k}</p><p className="font-medium text-gray-800 dark:text-gray-200">{v}</p></div>
              ))}
            </div>
            <div><p className="text-xs text-gray-400 mb-1">Reason</p><p className="text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300">{viewReq.reason}</p></div>
          </div>
        )}
      </Modal>

      {/* Approve Dialog */}
      <ConfirmDialog isOpen={!!approveId} onClose={() => setApproveId(null)} onConfirm={handleApprove} title="Approve Leave" message="Are you sure you want to approve this leave request?" confirmLabel="Approve" variant="warning" isLoading={actionLoading} />

      {/* Reject Modal */}
      <Modal isOpen={!!rejectId} onClose={() => { setRejectId(null); setRejectReason(''); }} title="Reject Leave Request" size="sm"
        footer={<>
          <button className="btn-outline" onClick={() => { setRejectId(null); setRejectReason(''); }}>Cancel</button>
          <button className="btn-danger" onClick={handleReject} disabled={actionLoading}>{actionLoading ? <Spinner size="sm" /> : 'Reject'}</button>
        </>}
      >
        <div>
          <label className="label">Rejection Reason <span className="text-red-500">*</span></label>
          <textarea rows={3} className="input resize-none" placeholder="Provide a reason for rejection..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
