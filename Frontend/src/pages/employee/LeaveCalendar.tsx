import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { leaveService, holidayService } from '../../services/api';
import type { LeaveRequest, Holiday } from '../../types';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { LEAVE_TYPE_COLORS } from '../../utils/helpers';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function LeaveCalendar() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    Promise.all([
      leaveService.getByEmployee(user?.id || ''),
      holidayService.getAll(),
    ]).then(([r, h]) => { setRequests(r.filter(req => req.status !== 'rejected')); setHolidays(h); });
  }, [user]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const leaves = requests.filter(r => {
      const from = new Date(r.fromDate);
      const to = new Date(r.toDate);
      const d = new Date(dateStr);
      return d >= from && d <= to;
    });
    const hols = holidays.filter(h => h.date === dateStr);
    return { leaves, holidays: hols };
  };

  const isToday = (day: number) => {
    const t = new Date();
    return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
  };

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Leave Calendar' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Calendar</h1>
          <p className="page-subtitle">Your leave schedule for {MONTHS[month]} {year}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline p-2" onClick={() => setCurrentDate(new Date(year, month - 1))}><FiChevronLeft size={16} /></button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-32 text-center">{MONTHS[month]} {year}</span>
          <button className="btn-outline p-2" onClick={() => setCurrentDate(new Date(year, month + 1))}><FiChevronRight size={16} /></button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {[
          { color: '#3b82f6', label: 'Casual Leave' },
          { color: '#ef4444', label: 'Sick Leave' },
          { color: '#10b981', label: 'Earned Leave' },
          { color: '#f59e0b', label: 'Holiday' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
          {DAYS.map(d => (
            <div key={d} className={`py-3 text-center text-xs font-semibold ${d === 'Sun' || d === 'Sat' ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (!day) return <div key={idx} className="min-h-24 border-r border-b border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50" />;
            const { leaves, holidays: hols } = getEventsForDay(day);
            const isWknd = (idx % 7 === 0 || idx % 7 === 6);
            return (
              <div key={idx} className={`min-h-24 border-r border-b border-gray-100 dark:border-gray-800 p-1.5 ${isWknd ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''}`}>
                <span className={`text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center ${isToday(day) ? 'bg-primary-600 text-white' : isWknd ? 'text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {hols.map(h => <div key={h.id} className="text-xs px-1 py-0.5 rounded text-white truncate" style={{ backgroundColor: '#f59e0b', fontSize: 10 }}>{h.name}</div>)}
                  {leaves.slice(0, 2).map(l => <div key={l.id} className="text-xs px-1 py-0.5 rounded text-white truncate" style={{ backgroundColor: LEAVE_TYPE_COLORS[l.leaveType], fontSize: 10 }}>{l.leaveLabel}</div>)}
                  {leaves.length > 2 && <div className="text-xs text-gray-400" style={{ fontSize: 10 }}>+{leaves.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
