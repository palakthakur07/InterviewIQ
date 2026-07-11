import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileUp, MessagesSquare, History, BarChart3, X, TerminalSquare } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Upload resume', to: '/upload-resume', icon: FileUp },
  { label: 'Start interview', to: '/interview', icon: MessagesSquare },
  { label: 'History', to: '/history', icon: History },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
];

function NavItem({ item, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-signal-50 text-signal-700 dark:bg-signal-500/15 dark:text-cyan'
            : 'text-ink/65 hover:bg-paper-surface hover:text-ink dark:text-paper/65 dark:hover:bg-ink-surface2 dark:hover:text-paper'
        }`
      }
    >
      <Icon size={18} />
      {item.label}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5 font-display text-lg font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient text-white">
          <TerminalSquare size={18} />
        </span>
        InterviewIQ
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="border-t border-paper-line p-4 dark:border-ink-line">
        <p className="font-mono text-[11px] leading-relaxed text-ink/40 dark:text-paper/40">
          Every finished interview gets a full report and PDF export.
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop: static sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-paper-line bg-paper dark:border-ink-line dark:bg-ink lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile: overlay drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative h-full w-72 bg-paper shadow-2xl dark:bg-ink">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-paper-line text-ink/60 dark:border-ink-line dark:text-paper/60"
            >
              <X size={16} />
            </button>
            <SidebarContent onNavigate={onClose} />
          </div>
        </div>
      )}
    </>
  );
}
