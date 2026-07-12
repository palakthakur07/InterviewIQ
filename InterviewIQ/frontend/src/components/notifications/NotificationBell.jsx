import { useEffect, useRef, useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import EmptyState from '../dashboard/EmptyState';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const BellIcon = unreadCount > 0 ? BellRing : Bell;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-paper-line text-ink/70 transition-colors hover:border-signal-500/50 dark:border-ink-line dark:text-paper/70"
      >
        <BellIcon size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-coral px-1 font-mono text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-paper-line bg-paper-surface p-2 shadow-xl dark:border-ink-line dark:bg-ink-surface">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="font-display text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-signal-600 hover:underline dark:text-cyan"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="my-1 h-px bg-paper-line dark:bg-ink-line" />

          {notifications.length === 0 ? (
            <div className="py-4">
              <EmptyState icon={Bell} title="No notifications yet" />
            </div>
          ) : (
            <div className="max-h-80 space-y-0.5 overflow-y-auto">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
