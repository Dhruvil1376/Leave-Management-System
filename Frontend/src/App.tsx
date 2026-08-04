import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { PageLoader } from './components/ui/Spinner';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeavePage from './pages/employee/ApplyLeave';
import MyRequests from './pages/employee/MyRequests';
import LeaveHistory from './pages/employee/LeaveHistory';
import LeaveCalendar from './pages/employee/LeaveCalendar';
import ProfilePage from './pages/employee/ProfilePage';
import NotificationsPage from './pages/employee/Notifications';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import LeaveApprovals from './pages/manager/LeaveApprovals';
import TeamCalendar from './pages/manager/TeamCalendar';
import ManagerEmployees from './pages/manager/Employees';
import ManagerReports from './pages/manager/Reports';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import LeaveTypes from './pages/admin/LeaveTypes';
import AdminLeaveRequests from './pages/admin/LeaveRequests';
import HolidayManagement from './pages/admin/HolidayManagement';
import AttendanceOverview from './pages/admin/AttendanceOverview';
import AdminReports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import ErrorPage from './components/ui/ErrorPage';

function RootRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user!.role}/dashboard`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Root */}
              <Route path="/" element={<RootRedirect />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Employee Routes */}
              <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="apply" element={<ApplyLeavePage />} />
                <Route path="requests" element={<MyRequests />} />
                <Route path="history" element={<LeaveHistory />} />
                <Route path="calendar" element={<LeaveCalendar />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Manager Routes */}
              <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="approvals" element={<LeaveApprovals />} />
                <Route path="calendar" element={<TeamCalendar />} />
                <Route path="employees" element={<ManagerEmployees />} />
                <Route path="reports" element={<ManagerReports />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="departments" element={<DepartmentManagement />} />
                <Route path="leave-types" element={<LeaveTypes />} />
                <Route path="leave-requests" element={<AdminLeaveRequests />} />
                <Route path="holidays" element={<HolidayManagement />} />
                <Route path="attendance" element={<AttendanceOverview />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
