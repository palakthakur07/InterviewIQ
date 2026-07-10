import { Sparkles } from 'lucide-react';

export default function InterviewLoadingSkeleton({ message = 'Generating your interview questions…' }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-center gap-2 py-6">
        <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-xl bg-signal-gradient text-white">
          <Sparkles size={16} />
        </span>
        <p className="font-mono text-sm text-ink/55 dark:text-paper/55">{message}</p>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex gap-3">
          <div className="h-6 w-20 animate-pulse rounded-full bg-paper-line dark:bg-ink-line" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-paper-line dark:bg-ink-line" />
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-paper-line dark:bg-ink-line" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
        </div>
      </div>

      <div className="card mt-4 p-6">
        <div className="h-24 w-full animate-pulse rounded-xl bg-paper-line dark:bg-ink-line" />
        <div className="mt-4 flex gap-3">
          <div className="h-10 w-36 animate-pulse rounded-xl bg-paper-line dark:bg-ink-line" />
          <div className="h-10 w-24 animate-pulse rounded-xl bg-paper-line dark:bg-ink-line" />
        </div>
      </div>
    </div>
  );
}
