import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';

export default function AdminRoute() {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
