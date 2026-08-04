import { motion } from 'framer-motion';
import type { LeaveBalance } from '../../types';

interface LeaveBalanceCardProps { balance: LeaveBalance; delay?: number; }

export default function LeaveBalanceCard({ balance, delay = 0 }: LeaveBalanceCardProps) {
  const pct = Math.round((balance.remaining / balance.total) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card card-hover p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{balance.label}</h4>
        <span className="text-xs font-medium text-gray-400">{balance.remaining}/{balance.total}</span>
      </div>
      <div className="flex items-end gap-4 mb-3">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{balance.remaining}</p>
          <p className="text-xs text-gray-400 mt-0.5">days remaining</p>
        </div>
        <div className="text-right ml-auto">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{balance.used} used</p>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: balance.color }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">{pct}% remaining</p>
    </motion.div>
  );
}
