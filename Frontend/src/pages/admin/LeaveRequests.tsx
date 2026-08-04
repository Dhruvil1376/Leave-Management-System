import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { DEPARTMENTS } from '../../data/mockData';

const PAGE_SIZE = 10;

export default function AdminLeaveRequests() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewReq, setViewReq] = useState<LeaveRequest | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { leaveService.getAll().then(r => { setRequests(r); setLoading(false); }); }, []);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    return (
      (!q || r.employeeName.toLowerCase().includes(q) || r.leaveLabel.toLowerCase().includes(q)) &&
      (!statusFilter || r.status === statusFilter) &&
      (!deptFilter || r.department === deptFilter) &&
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
      setRequests(prev => prev.map(r => r.id === approveId ? { ...r, status: 'approved' as const } : r));
      success('Approved');
    } catch { error('Failed'); } finally { setActionLoading(false); setApproveId(null); }
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) { error('Provide rejection reason'); return; }
    setActionLoading(true);
    try {
      await leaveService.reject(rejectId, rejectReason, user?.name || '');
      setRequests(prev => prev.map(r => r.id === rejectId ? { ...r, status: 'rejected' as const, rejectionReason: rejectReason } : r));
      success('Rejected');
    } catch { error('Failed'); } finally { setActionLoading(false); setRejectId(null); setRejectReason(''); }
  };

  const deptOptions = DEPARTMENTS.map(d => ({ value: d.name, label: d.name }));

  return (
    <div>
      <Breadcrumb items={[{ label: 'Leave Requests' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Leave Requests</h1><p className="page-subtitle">{filtered.length} requests</p></div>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search employee..." className="flex-1 min-w-48" />
          <FilterDropdown value={deptFilter} onChange={v => { setDeptFilter(v); setPage(1); }} placeholder="All Departments" options={deptOptions} />
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="table-container rounded-none border-0">
              <table className="table">
                <thead><tr><th>Employee</th><th>Department</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {paginated.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={r.employeeName} size="sm" />
                          <p className="font-medium text-gray-900 dark:text-white text-xs">{r.employeeName}</p>
                        </div>
                      </td>
                      <td className="text-gray-500 text-xs">{r.department}</td>
                      <td className="text-xs">{r.leaveLabel}</td>
                      <td className="text-xs">{formatDate(r.fromDate)}</td>
                      <td className="text-xs">{formatDate(r.toDate)}</td>
                      <td className="text-xs">{r.days}</td>
                      <td className="text-gray-400 text-xs">{formatDate(r.appliedDate)}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewReq(r)} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><FiEye size={14} /></button>
                          {r.status === 'pending' && <>
                            <button onClick={() => setApproveId(r.id)} className="p-1.5 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><FiCheck size={14} /></button>
                            <button onClick={() => setRejectId(r.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiX size={14} /></button>
                          </>}
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

      <Modal isOpen={!!viewReq} onClose={() => setViewReq(null)} title="Leave Request Details">
        {viewReq && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
              <Avatar name={viewReq.employeeName} />
              <div><p className="font-semibold text-gray-900 dark:text-white">{viewReq.employeeName}</p><p className="text-sm text-gray-400">{viewReq.designation} · {viewReq.department}</p></div>
              <div className="ml-auto"><StatusBadge status={viewReq.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[['Leave Type', viewReq.leaveLabel], ['Days', `${viewReq.days}${viewReq.halfDay ? ' (Half)' : ''}`], ['From', formatDate(viewReq.fromDate)], ['To', formatDate(viewReq.toDate)], ['Applied On', formatDate(viewReq.appliedDate)], ['Approved By', viewReq.approvedBy || '—']].map(([k, v]) => (
                <div key={k}><p className="text-xs text-gray-400 mb-0.5">{k}</p><p className="font-medium text-gray-800 dark:text-gray-200">{v}</p></div>
              ))}
            </div>
            <div><p className="text-xs text-gray-400 mb-1">Reason</p><p className="text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300">{viewReq.reason}</p></div>
            {viewReq.rejectionReason && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"><p className="text-xs font-medium text-red-600 mb-0.5">Rejection Reason</p><p className="text-sm text-red-700 dark:text-red-300">{viewReq.rejectionReason}</p></div>}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!approveId} onClose={() => setApproveId(null)} onConfirm={handleApprove} title="Approve Leave" message="Approve this leave request?" confirmLabel="Approve" variant="warning" isLoading={actionLoading} />
      <Modal isOpen={!!rejectId} onClose={() => { setRejectId(null); setRejectReason(''); }} title="Reject Leave" size="sm"
        footer={<><button className="btn-outline" onClick={() => { setRejectId(null); setRejectReason(''); }}>Cancel</button><button className="btn-danger" onClick={handleReject} disabled={actionLoading}>{actionLoading ? <Spinner size="sm" /> : 'Reject'}</button></>}>
        <div><label className="label">Rejection Reason <span className="text-red-500">*</span></label><textarea rows={3} className="input resize-none" value={rejectReason} onChange={e => setRejectReason(e.target.value)} /></div>
      </Modal>
    </div>
  );
}
