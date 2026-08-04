import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { departmentService } from '../../services/api';
import type { Department } from '../../types';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Spinner from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { useForm } from 'react-hook-form';
import Avatar from '../../components/ui/Avatar';

type DeptForm = { name: string; head: string; description: string; };

export default function DepartmentManagement() {
  const { success, error } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DeptForm>();

  useEffect(() => {
    departmentService.getAll().then(d => { setDepartments(d); setLoading(false); });
  }, []);

  useEffect(() => {
    if (editDept) reset({ name: editDept.name, head: editDept.head, description: editDept.description });
    else reset({});
  }, [editDept, reset]);

  const onSubmit = async (data: DeptForm) => {
    setSaving(true);
    try {
      if (editDept) {
        const updated = await departmentService.update(editDept.id, data);
        setDepartments(prev => prev.map(d => d.id === editDept.id ? updated : d));
        success('Department updated'); setEditDept(null);
      } else {
        const created = await departmentService.create(data);
        setDepartments(prev => [...prev, created]);
        success('Department created'); setAddOpen(false);
      }
      reset({});
    } catch { error('Operation failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await departmentService.delete(deleteId);
      setDepartments(prev => prev.filter(d => d.id !== deleteId));
      success('Department deleted');
    } catch { error('Delete failed'); } finally { setDeleting(false); setDeleteId(null); }
  };

  const DeptForm = () => (
    <form id="dept-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Department Name <span className="text-red-500">*</span></label>
        <input type="text" className={`input ${errors.name ? 'border-red-400' : ''}`} placeholder="e.g. Engineering"
          {...register('name', { required: 'Name required' })} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label">Department Head</label>
        <input type="text" className="input" placeholder="Head name" {...register('head')} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea rows={3} className="input resize-none" placeholder="Brief description..." {...register('description')} />
      </div>
    </form>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: 'Departments' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Departments</h1><p className="page-subtitle">{departments.length} departments</p></div>
        <button className="btn-primary" onClick={() => { setAddOpen(true); reset({}); }}><FiPlus size={15} /> Add Department</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : departments.length === 0 ? (
        <EmptyState icon={<FiUsers size={22} />} title="No departments" action={<button className="btn-primary" onClick={() => setAddOpen(true)}><FiPlus size={14} /> Add Department</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <motion.div key={dept.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <FiUsers size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditDept(dept)} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><FiEdit2 size={14} /></button>
                  <button onClick={() => setDeleteId(dept.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={14} /></button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5">{dept.name}</h3>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{dept.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Avatar name={dept.head || 'Unknown'} size="xs" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{dept.head || 'No head'}</span>
                </div>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{dept.totalEmployees} members</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={addOpen} onClose={() => { setAddOpen(false); reset({}); }} title="Add Department" size="sm"
        footer={<><button className="btn-outline" onClick={() => { setAddOpen(false); reset({}); }}>Cancel</button><button form="dept-form" type="submit" className="btn-primary" disabled={saving}>{saving ? <Spinner size="sm" /> : 'Create'}</button></>}>
        <DeptForm />
      </Modal>
      <Modal isOpen={!!editDept} onClose={() => setEditDept(null)} title="Edit Department" size="sm"
        footer={<><button className="btn-outline" onClick={() => setEditDept(null)}>Cancel</button><button form="dept-form" type="submit" className="btn-primary" disabled={saving}>{saving ? <Spinner size="sm" /> : 'Save'}</button></>}>
        <DeptForm />
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Department" message="Are you sure? This cannot be undone." confirmLabel="Delete" isLoading={deleting} />
    </div>
  );
}
