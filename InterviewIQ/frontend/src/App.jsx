import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicOnlyRoute from './components/routing/PublicOnlyRoute';
import AdminRoute from './components/routing/AdminRoute';
import ErrorBoundary from './components/error/ErrorBoundary';
import PageLoader from './components/ui/PageLoader';
import useOnlineStatus from './hooks/useOnlineStatus';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/errors/NotFound';
import NetworkError from './pages/errors/NetworkError';
import SessionExpired from './pages/errors/SessionExpired';

// Route-based code splitting — these pages pull in heavier dependencies
// (recharts, jsPDF, the interview flow) that shouldn't block the initial
// landing/login paint.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ResumeUpload = lazy(() => import('./pages/ResumeUpload'));
const Interview = lazy(() => import('./pages/Interview'));
const Results = lazy(() => import('./pages/Results'));
const History = lazy(() => import('./pages/History'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

function AppRoutes() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [showNetworkError, setShowNetworkError] = useState(false);

  useEffect(() => {
    function handleSessionExpired() {
      navigate('/session-expired', { replace: true });
    }
    function handleNetworkError() {
      setShowNetworkError(true);
    }
    window.addEventListener('interviewiq:sessionExpired', handleSessionExpired);
    window.addEventListener('interviewiq:networkError', handleNetworkError);
    return () => {
      window.removeEventListener('interviewiq:sessionExpired', handleSessionExpired);
      window.removeEventListener('interviewiq:networkError', handleNetworkError);
    };
  }, [navigate]);

  // A hard offline state takes priority over whatever route is currently active.
  if (!isOnline || showNetworkError) {
    return <NetworkError onRetry={() => { setShowNetworkError(false); window.location.reload(); }} />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Authenticated users are redirected away from these to /dashboard */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Unauthenticated users are redirected to /login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload-resume" element={<ResumeUpload />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/results/:interviewId" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Authenticated + role === 'admin' only */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/session-expired" element={<SessionExpired />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
