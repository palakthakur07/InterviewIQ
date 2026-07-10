import { FileText, X } from 'lucide-react';

export default function UploadProgress({ fileName, percent, onCancel }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-cyan">
          <FileText size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{fileName}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-line dark:bg-ink-line">
            <div
              className="h-full rounded-full bg-signal-gradient transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <span className="font-mono text-xs text-ink/50 dark:text-paper/50">{percent}%</span>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel upload"
            className="text-ink/40 hover:text-coral dark:text-paper/40"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
