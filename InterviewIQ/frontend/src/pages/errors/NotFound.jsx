import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink dark:bg-ink dark:text-paper"
      aria-labelledby="not-found-heading"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300">
        <Compass size={28} aria-hidden="true" />
      </span>
      <p className="mt-5 font-mono text-xs text-ink/40 dark:text-paper/40">ERROR 404</p>
      <h1 id="not-found-heading" className="mt-1 font-display text-3xl font-semibold">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink/60 dark:text-paper/60">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to home
      </Link>
    </main>
  );
}
