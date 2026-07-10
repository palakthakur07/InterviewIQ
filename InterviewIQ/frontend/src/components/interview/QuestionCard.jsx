import { Timer } from 'lucide-react';

const TYPE_META = {
  technical: { label: 'Technical', className: 'bg-signal-50 text-signal-700 dark:bg-signal-500/10 dark:text-signal-300' },
  project: { label: 'Project', className: 'bg-cyan/10 text-cyan' },
  behavioral: { label: 'Behavioral', className: 'bg-amber/10 text-amber' },
  'follow-up': { label: 'Follow-up', className: 'bg-mint/10 text-mint' },
};

export default function QuestionCard({ question, elapsedTime }) {
  const meta = TYPE_META[question.type] || TYPE_META.technical;

  return (
    <div className="card animate-fade-up p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
            {meta.label}
          </span>
          <span className="font-mono text-xs text-ink/40 dark:text-paper/40">{question.topic}</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-xs text-ink/50 dark:text-paper/50">
          <Timer size={13} />
          {elapsedTime}
        </span>
      </div>

      <p className="mt-5 font-display text-lg font-semibold leading-relaxed sm:text-xl">
        {question.text}
      </p>
    </div>
  );
}
