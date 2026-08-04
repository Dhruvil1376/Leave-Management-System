import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { employeeService } from '../../services/api';
import type { Employee } from '../../types';
import Avatar from '../../components/ui/Avatar';
import StatusBadge from '../../components/ui/StatusBadge';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { useForm } from 'react-hook-form';
import { DEPARTMENTS } from '../../data/mockData';

const PAGE_SIZE = 8;
type EmpForm = Omit<Employee, 'id' | 'employeeId'>;

export default function EmployeeManagement() {
  const { success, error } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmpForm>();

  useEffect(() => {
    employeeService.getAll().then(e => { setEmployees(e); setLoading(false); });
  }, []);

  useEffect(() => {
    if (editEmp) reset({ name: editEmp.name, email: editEmp.email, phone: editEmp.phone, department: editEmp.department, designation: editEmp.designation, role: editEmp.role, status: editEmp.status, joinDate: editEmp.joinDate });
    else reset({});
  }, [editEmp, reset]);

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    return (
      (!q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q)) &&
      (!deptFilter || e.department === deptFilter) &&
      (!statusFilter || e.status === statusFilter)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSubmit = async (data: EmpForm) => {
    setSaving(true);
    try {
      if (editEmp) {
        const updated = await employeeService.update(editEmp.id, data);
        setEmployees(prev => prev.map(e => e.id === editEmp.id ? updated : e));
        success('Employee updated');
        setEditEmp(null);
      } else {
        const created = await employeeService.create(data);
        setEmployees(prev => [...prev, created]);
        success('Employee added');
        setAddOpen(false);
      }
      reset({});
    } catch { error('Operation failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await employeeService.delete(deleteId);
      setEmployees(prev => prev.filter(e => e.id !== deleteId));
      success('Employee deleted');
    } catch { error('Delete failed'); } finally { setDeleting(false); setDeleteId(null); }
  };

  const deptOptions = DEPARTMENTS.map(d => ({ value: d.name, label: d.name }));

  const EmployeeForm = () => (
    <form id="emp-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: false },
        { name: 'joinDate', label: 'Join Date', type: 'date', required: true },
      ].map(f => (
        <div key={f.name}>
          <label className="label">{f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}</label>
          <input type={f.type} className={`input ${errors[f.name as keyof EmpForm] ? 'border-red-400' : ''}`}
            {...register(f.name as keyof EmpForm, f.required ? { required: `${f.label} required` } : {})} />
          {errors[f.name as keyof EmpForm] && <p className="text-xs text-red-500 mt-1">{errors[f.name as keyof EmpForm]?.message as string}</p>}
        </div>
      ))}
      <div>
        <label className="label">Department <span className="text-red-500">*</span></label>
        <select className="input" {...register('department', { required: true })}>
          <option value="">Select...</option>
          {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Designation <span className="text-red-500">*</span></label>
        <input type="text" className="input" {...register('designation', { required: true })} />
      </div>
      <div>
        <label className="label">Role</label>
        <select className="input" {...register('role')}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label className="label">Status</label>
        <select className="input" {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </form>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: 'Employee Management' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Employees</h1><p className="page-subtitle">{employees.length} total employees</p></div>
        <button className="btn-primary" onClick={() => { setAddOpen(true); reset({}); }}><FiPlus size={15} /> Add Employee</button>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search employees..." className="flex-1 min-w-48" />
          <FilterDropdown value={deptFilter} onChange={v => { setDeptFilter(v); setPage(1); }} placeholder="All Departments" options={deptOptions} />
          <FilterDropdown value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} placeholder="All Status" options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : paginated.length === 0 ? (
          <EmptyState icon={<FiSearch size={22} />} title="No employees found" action={<button className="btn-primary" onClick={() => setAddOpen(true)}><FiPlus size={14} /> Add Employee</button>} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="table-container rounded-none border-0">
              <table className="table">
                <thead><tr><th>Employee</th><th>Department</th><th>Designation</th><th>Email</th><th>Phone</th><th>Join Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {paginated.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={emp.name} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-xs">{emp.name}</p>
                            <p className="text-xs text-gray-400">{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-500">{emp.department}</td>
                      <td className="text-gray-500">{emp.designation}</td>
                      <td className="text-gray-500 text-xs">{emp.email}</td>
                      <td className="text-gray-500 text-xs">{emp.phone}</td>
                      <td className="text-gray-400 text-xs">{formatDate(emp.joinDate)}</td>
                      <td><StatusBadge status={emp.status} /></td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setEditEmp(emp)} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><FiEdit2 size={14} /></button>
                          <button onClick={() => setDeleteId(emp.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={14} /></button>
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

      <Modal isOpen={addOpen} onClose={() => { setAddOpen(false); reset({}); }} title="Add Employee" size="lg"
        footer={<><button className="btn-outline" onClick={() => { setAddOpen(false); reset({}); }}>Cancel</button><button form="emp-form" type="submit" className="btn-primary" disabled={saving}>{saving ? <Spinner size="sm" /> : 'Add Employee'}</button></>}>
        <EmployeeForm />
      </Modal>

      <Modal isOpen={!!editEmp} onClose={() => setEditEmp(null)} title="Edit Employee" size="lg"
        footer={<><button className="btn-outline" onClick={() => setEditEmp(null)}>Cancel</button><button form="emp-form" type="submit" className="btn-primary" disabled={saving}>{saving ? <Spinner size="sm" /> : 'Save Changes'}</button></>}>
        <EmployeeForm />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Employee" message="Are you sure you want to delete this employee? This action cannot be undone." confirmLabel="Delete" isLoading={deleting} />
    </div>
  );
}
