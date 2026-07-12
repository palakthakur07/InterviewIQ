import { Link } from 'react-router-dom';
import { FileUp, MessagesSquare, History, BarChart3 } from 'lucide-react';

const ACTIONS = [
  { label: 'Upload resume', to: '/upload-resume', icon: FileUp, accent: 'bg-cyan/10 text-cyan' },
  { label: 'Start interview', to: '/interview', icon: MessagesSquare, accent: 'bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300' },
  { label: 'View history', to: '/history', icon: History, accent: 'bg-mint/10 text-mint' },
  { label: 'View analytics', to: '/analytics', icon: BarChart3, accent: 'bg-amber/10 text-amber' },
];

export default function QuickActions() {
  return (
    <div>
      <h3 className="mb-3 font-display text-base font-semibold">Quick actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="card flex flex-col items-start gap-3 p-4 transition-colors hover:border-signal-500/40"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${action.accent}`}>
              <action.icon size={16} />
            </span>
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
