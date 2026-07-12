import { CheckCircle2, XCircle, X } from 'lucide-react';

const STYLES = {
  success: {
    icon: CheckCircle2,
    className: 'border-mint/30 bg-mint/10 text-mint',
  },
  error: {
    icon: XCircle,
    className: 'border-coral/30 bg-coral/10 text-coral',
  },
};

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => {
        const { icon: Icon, className } = STYLES[toast.type] || STYLES.success;
        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex animate-fade-in items-start gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md ${className} bg-paper-surface dark:bg-ink-surface`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm font-medium text-ink dark:text-paper">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss"
              className="shrink-0 text-ink/40 hover:text-ink dark:text-paper/40 dark:hover:text-paper"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
