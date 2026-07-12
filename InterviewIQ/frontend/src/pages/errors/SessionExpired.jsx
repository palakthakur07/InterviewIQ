import { Link } from 'react-router-dom';
import { LogIn, TimerOff } from 'lucide-react';

export default function SessionExpired() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink dark:bg-ink dark:text-paper"
      aria-labelledby="session-expired-heading"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300">
        <TimerOff size={28} aria-hidden="true" />
      </span>
      <p className="mt-5 font-mono text-xs text-ink/40 dark:text-paper/40">SESSION EXPIRED</p>
      <h1 id="session-expired-heading" className="mt-1 font-display text-3xl font-semibold">
        Your session has ended
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink/60 dark:text-paper/60">
        For your security, you've been signed out. Log back in to pick up where you left
        off.
      </p>
      <Link to="/login" className="btn-primary mt-8">
        <LogIn size={16} aria-hidden="true" />
        Log in again
      </Link>
    </main>
  );
}
