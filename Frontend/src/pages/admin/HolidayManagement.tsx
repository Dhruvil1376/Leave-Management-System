import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi';
import { holidayService } from '../../services/api';
import type { Holiday } from '../../types';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Spinner from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { useForm } from 'react-hook-form';
import { formatDate } from '../../utils/helpers';

type HolForm = { name: string; date: string; type: 'national' | 'regional' | 'optional'; description?: string; };

const typeColors = { national: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', regional: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', optional: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };

export default function HolidayManagement() {
  const { success, error } = useToast();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<HolForm>();

  useEffect(() => { holidayService.getAll().then(h => { setHolidays(h); setLoading(false); }); }, []);

  const onSubmit = async (data: HolForm) => {
    setSaving(true);
    try {
      const created = await holidayService.create(data);
      setHolidays(prev => [...prev, created].sort((a, b) => a.date.localeCompare(b.date)));
      success('Holiday added'); setAddOpen(false); reset({});
    } catch { error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await holidayService.delete(deleteId);
      setHolidays(prev => prev.filter(h => h.id !== deleteId));
      success('Holiday deleted');
    } catch { error('Delete failed'); } finally { setDeleting(false); setDeleteId(null); }
  };

  const upcoming = holidays.filter(h => new Date(h.date) >= new Date());
  const past = holidays.filter(h => new Date(h.date) < new Date());

  const HolidayRow = ({ h }: { h: Holiday }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex flex-col items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 leading-none">{new Date(h.date).getDate()}</span>
          <span className="text-xs text-primary-400 dark:text-primary-500 leading-none">{new Date(h.date).toLocaleString('default', { month: 'short' })}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{h.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[h.type]}`}>{h.type}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{formatDate(h.date)}</span>
        <button onClick={() => setDeleteId(h.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={13} /></button>
      </div>
    </div>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: 'Holidays' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Holiday Management</h1><p className="page-subtitle">{holidays.length} holidays configured</p></div>
        <button className="btn-primary" onClick={() => { setAddOpen(true); reset({}); }}><FiPlus size={15} /> Add Holiday</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Upcoming Holidays ({upcoming.length})</h3>
          {loading ? <div className="flex justify-center py-8"><Spinner /></div> : upcoming.length === 0 ? (
            <EmptyState icon={<FiCalendar size={20} />} title="No upcoming holidays" />
          ) : upcoming.map(h => <HolidayRow key={h.id} h={h} />)}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Past Holidays ({past.length})</h3>
          {loading ? <div className="flex justify-center py-8"><Spinner /></div> : past.length === 0 ? (
            <EmptyState icon={<FiCalendar size={20} />} title="No past holidays" />
          ) : past.slice(0, 6).map(h => <HolidayRow key={h.id} h={h} />)}
        </motion.div>
      </div>

      <Modal isOpen={addOpen} onClose={() => { setAddOpen(false); reset({}); }} title="Add Holiday" size="sm"
        footer={<><button className="btn-outline" onClick={() => { setAddOpen(false); reset({}); }}>Cancel</button><button form="hol-form" type="submit" className="btn-primary" disabled={saving}>{saving ? <Spinner size="sm" /> : 'Add'}</button></>}>
        <form id="hol-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Name <span className="text-red-500">*</span></label>
            <input type="text" className={`input ${errors.name ? 'border-red-400' : ''}`} {...register('name', { required: true })} />
          </div>
          <div>
            <label className="label">Date <span className="text-red-500">*</span></label>
            <input type="date" className="input" {...register('date', { required: true })} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" {...register('type')}>
              <option value="national">National</option>
              <option value="regional">Regional</option>
              <option value="optional">Optional</option>
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <input type="text" className="input" {...register('description')} />
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Holiday" message="Remove this holiday?" confirmLabel="Delete" isLoading={deleting} />
    </div>
  );
}
