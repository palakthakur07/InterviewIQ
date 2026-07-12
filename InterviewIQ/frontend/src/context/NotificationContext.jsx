import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getNotificationsRequest, markNotificationsReadRequest } from '../api/notifications';
import { useAuth } from './AuthContext';

const POLL_INTERVAL_MS = 30000;
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getNotificationsRequest();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Non-critical — the bell just won't update this cycle.
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return undefined;
    }

    setIsLoading(true);
    refresh().finally(() => setIsLoading(false));

    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAuthenticated, refresh]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationsReadRequest(id);
    } catch {
      // Best-effort — a stale badge count self-corrects on the next poll.
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markNotificationsReadRequest();
    } catch {
      // Best-effort — see markAsRead.
    }
  }, []);

  const value = { notifications, unreadCount, isLoading, refresh, markAsRead, markAllAsRead };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
}
