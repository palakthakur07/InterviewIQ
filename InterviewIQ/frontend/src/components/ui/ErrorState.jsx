import { AlertTriangle } from 'lucide-react';

export default function ErrorState({
  icon: Icon = AlertTriangle,
  title = 'Something went wrong',
  description = 'Please try again in a moment.',
  action,
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral">
        <Icon size={24} />
      </span>
      <h2 className="mt-5 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-ink/60 dark:text-paper/60">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
