import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';

export default function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
