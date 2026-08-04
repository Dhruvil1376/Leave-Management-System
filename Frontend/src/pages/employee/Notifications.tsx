import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiCheckSquare } from 'react-icons/fi';
import { notificationService } from '../../services/api';
import type { Notification } from '../../types';
import EmptyState from '../../components/ui/EmptyState';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { formatDateTime } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

const typeStyles: Record<string, string> = {
  success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
};

const dotColors: Record<string, string> = {
  success: 'bg-emerald-500', info: 'bg-blue-500', warning: 'bg-amber-500', error: 'bg-red-500',
};

export default function NotificationsPage() {
  const { success } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService.getAll().then(n => { setNotifications(n); setLoading(false); });
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id: string) => {
    await notificationService.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAll = async () => {
    await notificationService.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    success('All notifications marked as read');
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Notifications' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          {unread > 0 && <p className="page-subtitle">{unread} unread notifications</p>}
        </div>
        {unread > 0 && (
          <button className="btn-outline text-xs" onClick={handleMarkAll}><FiCheckSquare size={14} /> Mark all read</button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="card p-4 animate-pulse h-16" />)}</div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={<FiBell size={22} />} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card p-4 border cursor-pointer transition-all hover:shadow-card-hover ${!n.read ? typeStyles[n.type] : ''}`}
              onClick={() => !n.read && handleMarkRead(n.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-gray-300 dark:bg-gray-600' : dotColors[n.type]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                    <span className="text-xs text-gray-400 shrink-0">{formatDateTime(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                </div>
                {!n.read && (
                  <button className="p-1 rounded text-gray-400 hover:text-emerald-500 transition-colors shrink-0" title="Mark as read">
                    <FiCheck size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
