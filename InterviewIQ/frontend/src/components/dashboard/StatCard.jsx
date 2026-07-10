export default function StatCard({ icon: Icon, label, value, hint, accent, isLoading }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
          <Icon size={18} />
        </span>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-2">
          <div className="h-6 w-16 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
          <div className="h-3 w-24 animate-pulse rounded bg-paper-line dark:bg-ink-line" />
        </div>
      ) : (
        <>
          <p className="mt-4 font-display text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-xs text-ink/55 dark:text-paper/55">{label}</p>
          {hint && <p className="mt-2 font-mono text-[11px] text-ink/40 dark:text-paper/40">{hint}</p>}
        </>
      )}
    </div>
  );
}
