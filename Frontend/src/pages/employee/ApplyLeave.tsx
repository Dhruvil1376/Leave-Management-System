import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiCalendar, FiFileText, FiPhone, FiUpload, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { leaveService } from '../../services/api';
import { calculateWorkingDays, LEAVE_TYPE_LABELS } from '../../utils/helpers';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Spinner from '../../components/ui/Spinner';
import type { LeaveType } from '../../types';

interface ApplyForm {
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  halfDay: boolean;
  reason: string;
  emergencyContact: string;
}

export default function ApplyLeavePage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ApplyForm>({
    defaultValues: { leaveType: 'casual', halfDay: false }
  });

  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const halfDay = watch('halfDay');
  const days = fromDate && toDate ? (halfDay ? 0.5 : calculateWorkingDays(fromDate, toDate)) : 0;

  const onSubmit = async (data: ApplyForm) => {
    if (days <= 0) { error('Please select valid dates'); return; }
    setLoading(true);
    try {
      await leaveService.create({
        ...data,
        employeeId: user?.id,
        employeeName: user?.name,
        department: user?.department,
        designation: user?.designation,
        leaveLabel: LEAVE_TYPE_LABELS[data.leaveType],
        days,
      });
      success('Leave request submitted successfully!');
      navigate('/employee/requests');
    } catch {
      error('Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const leaveTypes: LeaveType[] = ['casual', 'sick', 'earned', 'maternity', 'paternity', 'unpaid'];

  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: 'Apply Leave' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Apply for Leave</h1>
          <p className="page-subtitle">Fill in the details for your leave request</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Leave Type */}
          <div>
            <label className="label">Leave Type <span className="text-red-500">*</span></label>
            <select className={`input ${errors.leaveType ? 'border-red-400' : ''}`} {...register('leaveType', { required: true })}>
              {leaveTypes.map(t => <option key={t} value={t}>{LEAVE_TYPE_LABELS[t]}</option>)}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">From Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <FiCalendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" className={`input pl-9 ${errors.fromDate ? 'border-red-400' : ''}`}
                  {...register('fromDate', { required: 'From date is required' })} />
              </div>
              {errors.fromDate && <p className="mt-1 text-xs text-red-500">{errors.fromDate.message}</p>}
            </div>
            <div>
              <label className="label">To Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <FiCalendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" className={`input pl-9 ${errors.toDate ? 'border-red-400' : ''}`}
                  {...register('toDate', { required: 'To date is required' })} />
              </div>
              {errors.toDate && <p className="mt-1 text-xs text-red-500">{errors.toDate.message}</p>}
            </div>
          </div>

          {/* Half day & Days */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-primary-600 border-gray-300" {...register('halfDay')} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Half Day</span>
            </label>
            {days > 0 && (
              <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-3 py-1.5 rounded-lg">
                <FiInfo size={13} />
                <span className="text-xs font-medium">{days} working {days === 1 ? 'day' : 'days'}</span>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="label">Reason <span className="text-red-500">*</span></label>
            <div className="relative">
              <FiFileText size={14} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                rows={3}
                placeholder="Describe the reason for your leave request..."
                className={`input pl-9 resize-none ${errors.reason ? 'border-red-400' : ''}`}
                {...register('reason', { required: 'Reason is required', minLength: { value: 10, message: 'Min 10 characters' } })}
              />
            </div>
            {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="label">Emergency Contact</label>
            <div className="relative">
              <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" placeholder="+1 555-0000" className="input pl-9" {...register('emergencyContact')} />
            </div>
          </div>

          {/* Attachment */}
          <div>
            <label className="label">Attachment (Optional)</label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer">
              <FiUpload size={20} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
