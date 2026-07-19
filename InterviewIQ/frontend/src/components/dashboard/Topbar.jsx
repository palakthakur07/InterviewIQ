import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationBell from '../notifications/NotificationBell';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = (user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

 const avatarSrc = user?.avatarUrl || null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-paper-line bg-paper/90 px-4 backdrop-blur-md dark:border-ink-line dark:bg-ink/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-paper-line text-ink/70 dark:border-ink-line dark:text-paper/70 lg:hidden"
        >
          <Menu size={17} />
        </button>
        <h1 className="font-display text-base font-semibold sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-paper-line px-2 py-1.5 pr-3 transition-colors hover:border-signal-500/50 dark:border-ink-line"
          >
            <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-signal-gradient text-xs font-semibold text-white">
              {avatarSrc ? <img src={avatarSrc} alt={user?.name} className="h-full w-full object-cover" /> : initials}
            </span>
            <span className="hidden font-mono text-xs text-ink/70 dark:text-paper/70 sm:inline">
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown size={14} className="text-ink/40 dark:text-paper/40" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-paper-line bg-paper-surface p-1.5 shadow-xl dark:border-ink-line dark:bg-ink-surface">
              <div className="px-2.5 py-2">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-ink/50 dark:text-paper/50">{user?.email}</p>
              </div>
              <div className="my-1 h-px bg-paper-line dark:bg-ink-line" />
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink/75 hover:bg-paper-line/40 dark:text-paper/75 dark:hover:bg-ink-line/40"
              >
                <User size={15} />
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink/75 hover:bg-paper-line/40 dark:text-paper/75 dark:hover:bg-ink-line/40"
              >
                <SettingsIcon size={15} />
                Settings
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-coral hover:bg-coral/10"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
