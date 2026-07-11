export default function ResultsLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-24 animate-pulse rounded-full bg-paper-line dark:bg-ink-line" />
        <div className="h-6 w-32 animate-pulse rounded-full bg-paper-line dark:bg-ink-line" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-paper-line dark:bg-ink-line" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-paper-line dark:bg-ink-line" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card h-16 animate-pulse p-4" />
        ))}
      </div>
    </div>
  );
}
