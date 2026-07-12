import { RefreshCcw, ServerCrash } from 'lucide-react';

export default function ServerError({ onRetry }) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink dark:bg-ink dark:text-paper"
      aria-labelledby="server-error-heading"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral/10 text-coral">
        <ServerCrash size={28} aria-hidden="true" />
      </span>
      <p className="mt-5 font-mono text-xs text-ink/40 dark:text-paper/40">ERROR 500</p>
      <h1 id="server-error-heading" className="mt-1 font-display text-3xl font-semibold">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink/60 dark:text-paper/60">
        An unexpected error occurred on our end. Try reloading the page — if it keeps
        happening, please check back shortly.
      </p>
      <button type="button" onClick={onRetry || (() => window.location.reload())} className="btn-primary mt-8">
        <RefreshCcw size={16} aria-hidden="true" />
        Reload page
      </button>
    </main>
  );
}
