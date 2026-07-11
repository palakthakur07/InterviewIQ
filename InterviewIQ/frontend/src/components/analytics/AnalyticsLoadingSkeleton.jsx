export default function AnalyticsLoadingSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-5">
          <div className="h-4 w-40 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
          <div className="mt-4 h-64 animate-pulse rounded-xl bg-paper-line/60 dark:bg-ink-line/60" />
        </div>
      ))}
    </div>
  );
}
