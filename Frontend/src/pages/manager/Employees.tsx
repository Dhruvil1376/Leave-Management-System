import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { employeeService } from '../../services/api';
import type { Employee } from '../../types';
import Avatar from '../../components/ui/Avatar';
import StatusBadge from '../../components/ui/StatusBadge';
import SearchBar from '../../components/ui/SearchBar';
import EmptyState from '../../components/ui/EmptyState';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Spinner from '../../components/ui/Spinner';
import { FiUsers, FiMail, FiPhone } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

export default function ManagerEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    employeeService.getAll().then(e => { setEmployees(e); setLoading(false); });
  }, []);

  const filtered = employees.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.designation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Breadcrumb items={[{ label: 'Employees' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Team Members</h1><p className="page-subtitle">{employees.length} employees</p></div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." className="max-w-sm" />
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FiUsers size={22} />} title="No employees found" />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="table-container rounded-none border-0">
              <table className="table">
                <thead><tr><th>Employee</th><th>Department</th><th>Designation</th><th>Contact</th><th>Join Date</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map(emp => (
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
                      <td>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs text-gray-400"><FiMail size={11} />{emp.email}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-400"><FiPhone size={11} />{emp.phone}</div>
                        </div>
                      </td>
                      <td className="text-gray-400 text-xs">{formatDate(emp.joinDate)}</td>
                      <td><StatusBadge status={emp.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
