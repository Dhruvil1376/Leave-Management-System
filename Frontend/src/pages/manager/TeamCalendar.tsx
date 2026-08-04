import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { leaveService, holidayService } from '../../services/api';
import type { LeaveRequest, Holiday } from '../../types';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Avatar from '../../components/ui/Avatar';
import { LEAVE_TYPE_COLORS } from '../../utils/helpers';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function TeamCalendar() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    Promise.all([leaveService.getAll(), holidayService.getAll()]).then(([r, h]) => {
      setRequests(r.filter(req => req.status === 'approved'));
      setHolidays(h);
    });
  }, []);

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
      <Breadcrumb items={[{ label: 'Team Calendar' }]} />
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Calendar</h1>
          <p className="page-subtitle">Approved leaves for all team members</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline p-2" onClick={() => setCurrentDate(new Date(year, month - 1))}><FiChevronLeft size={16} /></button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-32 text-center">{MONTHS[month]} {year}</span>
          <button className="btn-outline p-2" onClick={() => setCurrentDate(new Date(year, month + 1))}><FiChevronRight size={16} /></button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
          {DAYS.map(d => (
            <div key={d} className={`py-3 text-center text-xs font-semibold ${d === 'Sun' || d === 'Sat' ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (!day) return <div key={idx} className="min-h-28 border-r border-b border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50" />;
            const { leaves, holidays: hols } = getEventsForDay(day);
            const isWknd = (idx % 7 === 0 || idx % 7 === 6);
            return (
              <div key={idx} className={`min-h-28 border-r border-b border-gray-100 dark:border-gray-800 p-1.5 ${isWknd ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''}`}>
                <span className={`text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center ${isToday(day) ? 'bg-primary-600 text-white' : isWknd ? 'text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {hols.map(h => <div key={h.id} className="px-1 py-0.5 rounded text-white truncate" style={{ backgroundColor: '#f59e0b', fontSize: 10 }}>{h.name}</div>)}
                  {leaves.slice(0, 2).map(l => (
                    <div key={l.id} className="flex items-center gap-1 px-1 py-0.5 rounded" style={{ backgroundColor: LEAVE_TYPE_COLORS[l.leaveType] + '20', fontSize: 10 }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: LEAVE_TYPE_COLORS[l.leaveType] }} />
                      <span className="truncate text-gray-700 dark:text-gray-300">{l.employeeName.split(' ')[0]}</span>
                    </div>
                  ))}
                  {leaves.length > 2 && <div className="text-gray-400" style={{ fontSize: 10 }}>+{leaves.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
