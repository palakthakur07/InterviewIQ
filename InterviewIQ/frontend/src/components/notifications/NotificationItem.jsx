import { FileText, Sparkles, MessagesSquare, FileDown } from 'lucide-react';

const TYPE_META = {
  resume_uploaded: { icon: FileText, className: 'bg-cyan/10 text-cyan' },
  ai_analysis_completed: { icon: Sparkles, className: 'bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300' },
  interview_completed: { icon: MessagesSquare, className: 'bg-mint/10 text-mint' },
  pdf_generated: { icon: FileDown, className: 'bg-amber/10 text-amber' },
};

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationItem({ notification, onRead }) {
  const meta = TYPE_META[notification.type] || TYPE_META.resume_uploaded;
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={() => !notification.isRead && onRead(notification.id)}
      className={`flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-paper-line/40 dark:hover:bg-ink-line/40 ${
        notification.isRead ? '' : 'bg-signal-50/60 dark:bg-signal-500/10'
      }`}
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.className}`}>
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{notification.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-ink/55 dark:text-paper/55">{notification.message}</p>
        <p className="mt-1 font-mono text-[10px] text-ink/35 dark:text-paper/35">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal-500" />}
    </button>
  );
}
