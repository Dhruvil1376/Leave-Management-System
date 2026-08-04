import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiEdit2, FiLock, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/ui/Avatar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/helpers';

interface ProfileForm { name: string; phone: string; }
interface PasswordForm { currentPassword: string; newPassword: string; confirmPassword: string; }

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [pwMode, setPwMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' }
  });
  const pwForm = useForm<PasswordForm>();

  const onSaveProfile = async (data: ProfileForm) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser({ name: data.name, phone: data.phone });
    setSaving(false);
    setEditMode(false);
    success('Profile updated successfully');
  };

  const onChangePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) { error('Passwords do not match'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setPwMode(false);
    success('Password changed successfully');
    pwForm.reset();
  };

  if (!user) return null;

  const infoItems = [
    { icon: <FiUser size={15} />, label: 'Employee ID', value: user.employeeId },
    { icon: <FiMail size={15} />, label: 'Email', value: user.email },
    { icon: <FiBriefcase size={15} />, label: 'Department', value: user.department },
    { icon: <FiBriefcase size={15} />, label: 'Designation', value: user.designation },
    { icon: <FiUser size={15} />, label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
    { icon: <FiUser size={15} />, label: 'Join Date', value: formatDate(user.joinDate) },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Profile' }]} />
      <h1 className="page-title mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 flex flex-col items-center text-center">
          <Avatar name={user.name} size="xl" className="mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.designation}</p>
          <span className="badge badge-info mt-2 capitalize">{user.role}</span>
          <div className="w-full mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
            {infoItems.map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1.5">{item.icon} {item.label}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Edit & Password */}
        <div className="lg:col-span-2 space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Personal Information</h3>
              {!editMode && (
                <button className="btn-outline text-xs" onClick={() => setEditMode(true)}><FiEdit2 size={13} /> Edit</button>
              )}
            </div>
            <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  {editMode ? (
                    <>
                      <input className={`input ${errors.name ? 'border-red-400' : ''}`} {...register('name', { required: 'Name required' })} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </>
                  ) : <p className="text-sm text-gray-700 dark:text-gray-300 py-2.5">{user.name}</p>}
                </div>
                <div>
                  <label className="label">Phone</label>
                  {editMode ? (
                    <input className="input" {...register('phone')} />
                  ) : <p className="text-sm text-gray-700 dark:text-gray-300 py-2.5">{user.phone}</p>}
                </div>
                <div>
                  <label className="label">Email</label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-2.5">{user.email}</p>
                </div>
                <div>
                  <label className="label">Department</label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-2.5">{user.department}</p>
                </div>
              </div>
              {editMode && (
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" className="btn-outline" onClick={() => setEditMode(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <Spinner size="sm" /> : <><FiSave size={14} /> Save Changes</>}
                  </button>
                </div>
              )}
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Change Password</h3>
              {!pwMode && (
                <button className="btn-outline text-xs" onClick={() => setPwMode(true)}><FiLock size={13} /> Change</button>
              )}
            </div>
            {pwMode ? (
              <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" {...pwForm.register('currentPassword', { required: true })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">New Password</label>
                    <input type="password" className="input" {...pwForm.register('newPassword', { required: true, minLength: { value: 6, message: 'Min 6 chars' } })} />
                  </div>
                  <div>
                    <label className="label">Confirm Password</label>
                    <input type="password" className="input" {...pwForm.register('confirmPassword', { required: true })} />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" className="btn-outline" onClick={() => { setPwMode(false); pwForm.reset(); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <Spinner size="sm" /> : 'Update Password'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-400">Password last changed on your join date. Keep your account secure by updating regularly.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
