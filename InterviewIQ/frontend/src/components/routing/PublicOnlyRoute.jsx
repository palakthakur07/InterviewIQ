import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';

export default function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <AuthLoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
