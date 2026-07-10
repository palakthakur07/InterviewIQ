import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicOnlyRoute from './components/routing/PublicOnlyRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import Interview from './pages/Interview';
import ComingSoon from './pages/ComingSoon';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
          </Route>

          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
