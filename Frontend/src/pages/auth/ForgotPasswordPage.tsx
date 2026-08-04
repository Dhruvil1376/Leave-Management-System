import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiBriefcase, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Spinner from '../../components/ui/Spinner';

interface ForgotForm { email: string; }

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>();

  const onSubmit = async (_data: ForgotForm) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <FiBriefcase size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">LeaveMS</h1>
              <p className="text-primary-300 text-xs">Leave Management System</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-modal p-8">
            {!sent ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Forgot password?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your email and we'll send a reset link.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="label">Email address</label>
                    <div className="relative">
                      <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" placeholder="you@company.com" className={`input pl-9 ${errors.email ? 'border-red-400' : ''}`}
                        {...register('email', { required: 'Email is required' })} />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Check your inbox</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">We've sent a password reset link to your email address.</p>
              </div>
            )}
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                <FiArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
