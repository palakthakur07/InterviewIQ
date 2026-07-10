export default function ProgressBar({ current, total }) {
  const safeTotal = total > 0 ? total : 1;
  const percent = Math.min(100, Math.round((current / safeTotal) * 100));

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-ink/50 dark:text-paper/50">
        <span className="font-mono">
          Question {Math.min(current + 1, safeTotal)} of {total}
        </span>
        <span className="font-mono">{percent}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-paper-line dark:bg-ink-line">
        <div
          className="h-full rounded-full bg-signal-gradient transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
