import { RefreshCcw, WifiOff } from 'lucide-react';

export default function NetworkError({ onRetry }) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink dark:bg-ink dark:text-paper"
      aria-labelledby="network-error-heading"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber/10 text-amber">
        <WifiOff size={28} aria-hidden="true" />
      </span>
      <p className="mt-5 font-mono text-xs text-ink/40 dark:text-paper/40">CONNECTION LOST</p>
      <h1 id="network-error-heading" className="mt-1 font-display text-3xl font-semibold">
        You're offline
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink/60 dark:text-paper/60">
        We couldn't reach InterviewIQ's servers. Check your internet connection and try
        again.
      </p>
      <button type="button" onClick={onRetry || (() => window.location.reload())} className="btn-primary mt-8">
        <RefreshCcw size={16} aria-hidden="true" />
        Try again
      </button>
    </main>
  );
}
