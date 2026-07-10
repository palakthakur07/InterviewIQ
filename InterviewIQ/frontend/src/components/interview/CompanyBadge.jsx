import { Building2 } from 'lucide-react';

const LABELS = {
  general: 'General',
  google: 'Google',
  amazon: 'Amazon',
  microsoft: 'Microsoft',
  atlassian: 'Atlassian',
};

export default function CompanyBadge({ company }) {
  const label = LABELS[company] || 'General';

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-paper-line bg-paper-surface px-3 py-1 text-xs font-medium text-ink/70 dark:border-ink-line dark:bg-ink-surface2 dark:text-paper/70">
      <Building2 size={12} />
      {label} mode
    </span>
  );
}
