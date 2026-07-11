export default function HistoryLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card flex items-center gap-4 p-4 sm:p-5">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-paper-line dark:bg-ink-line" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
          </div>
          <div className="hidden h-9 w-24 animate-pulse rounded-xl bg-paper-line dark:bg-ink-line sm:block" />
        </div>
      ))}
    </div>
  );
}
