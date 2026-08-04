import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiCalendar, FiFileText, FiUsers, FiSettings, FiBarChart2,
  FiLogOut, FiBell, FiClock, FiChevronLeft, FiChevronRight, FiBriefcase,
  FiCheckSquare, FiGrid, FiMap, FiList
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const employeeNav: NavItem[] = [
  { label: 'Dashboard', path: '/employee/dashboard', icon: <FiHome size={18} /> },
  { label: 'Apply Leave', path: '/employee/apply', icon: <FiFileText size={18} /> },
  { label: 'My Requests', path: '/employee/requests', icon: <FiList size={18} /> },
  { label: 'Leave History', path: '/employee/history', icon: <FiClock size={18} /> },
  { label: 'Calendar', path: '/employee/calendar', icon: <FiCalendar size={18} /> },
  { label: 'Notifications', path: '/employee/notifications', icon: <FiBell size={18} /> },
  { label: 'Profile', path: '/employee/profile', icon: <FiGrid size={18} /> },
];

const managerNav: NavItem[] = [
  { label: 'Dashboard', path: '/manager/dashboard', icon: <FiHome size={18} /> },
  { label: 'Leave Approvals', path: '/manager/approvals', icon: <FiCheckSquare size={18} /> },
  { label: 'Team Calendar', path: '/manager/calendar', icon: <FiCalendar size={18} /> },
  { label: 'Employees', path: '/manager/employees', icon: <FiUsers size={18} /> },
  { label: 'Reports', path: '/manager/reports', icon: <FiBarChart2 size={18} /> },
  { label: 'Notifications', path: '/manager/notifications', icon: <FiBell size={18} /> },
  { label: 'Profile', path: '/manager/profile', icon: <FiGrid size={18} /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <FiHome size={18} /> },
  { label: 'Employees', path: '/admin/employees', icon: <FiUsers size={18} /> },
  { label: 'Departments', path: '/admin/departments', icon: <FiBriefcase size={18} /> },
  { label: 'Leave Types', path: '/admin/leave-types', icon: <FiFileText size={18} /> },
  { label: 'Leave Requests', path: '/admin/leave-requests', icon: <FiList size={18} /> },
  { label: 'Holidays', path: '/admin/holidays', icon: <FiCalendar size={18} /> },
  { label: 'Attendance', path: '/admin/attendance', icon: <FiMap size={18} /> },
  { label: 'Reports', path: '/admin/reports', icon: <FiBarChart2 size={18} /> },
  { label: 'Notifications', path: '/admin/notifications', icon: <FiBell size={18} /> },
  { label: 'Settings', path: '/admin/settings', icon: <FiSettings size={18} /> },
];

function getNavItems(role: string | undefined) {
  if (role === 'manager') return managerNav;
  if (role === 'admin') return adminNav;
  return employeeNav;
}

function getRoleLabel(role: string | undefined) {
  if (role === 'manager') return 'Manager';
  if (role === 'admin') return 'HR / Admin';
  return 'Employee';
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = getNavItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800 shrink-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <FiBriefcase size={16} className="text-white" />
        </div>
        {!isCollapsed && (
          <div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">LeaveMS</span>
            <span className="block text-xs text-gray-400 leading-none">{getRoleLabel(user?.role)}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-2 py-3 border-t border-gray-100 dark:border-gray-800 space-y-0.5 shrink-0">
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 ${isCollapsed ? 'justify-center px-2' : ''}`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <FiLogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.designation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarContent isCollapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shadow-sm z-10 transition-colors"
        >
          {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-50 lg:hidden"
            >
              <SidebarContent isCollapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
