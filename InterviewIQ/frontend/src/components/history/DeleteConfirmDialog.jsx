import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteConfirmDialog({ open, onCancel, onConfirm, isDeleting }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="card animate-scale-in relative w-full max-w-sm p-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-coral/10 text-coral">
          <AlertTriangle size={20} />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold">Delete this interview?</h3>
        <p className="mt-1.5 text-sm text-ink/60 dark:text-paper/60">
          This permanently removes the interview, its questions, answers, and report. This can't
          be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3 font-display text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
