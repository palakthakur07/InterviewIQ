import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { signupRequest, loginRequest, fetchCurrentUser } from '../api/auth';

const TOKEN_KEY = 'interviewiq_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // isInitializing: true while we validate a stored token on first load.
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!token) {
        setIsInitializing(false);
        return;
      }
      try {
        const data = await fetchCurrentUser();
        if (!cancelled) setUser(data.user);
      } catch {
        // Token invalid or expired — clear it out.
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
    // Only run on mount / when token is first read — login/signup set user directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const data = await signupRequest({ name, email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginRequest({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isInitializing,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
