const MODES = [
  { id: 'general', label: 'General', note: 'Balanced, role-agnostic technical interview' },
  { id: 'google', label: 'Google', note: 'Systems depth, clarifying questions' },
  { id: 'amazon', label: 'Amazon', note: 'Leadership-principle framing' },
  { id: 'microsoft', label: 'Microsoft', note: 'Design-oriented walkthroughs' },
  { id: 'atlassian', label: 'Atlassian', note: 'Values-driven, product-aware' },
];

export default function CompanyModeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {MODES.map((mode) => {
        const isActive = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            aria-pressed={isActive}
            className={`rounded-xl border p-3.5 text-left transition-all duration-200 ${
              isActive
                ? 'border-signal-500 bg-signal-50 shadow-sm dark:bg-signal-500/10'
                : 'border-paper-line hover:border-signal-500/40 dark:border-ink-line'
            }`}
          >
            <span
              className={`font-display text-sm font-semibold ${
                isActive ? 'text-signal-700 dark:text-cyan' : 'text-ink dark:text-paper'
              }`}
            >
              {mode.label}
            </span>
            <p className="mt-1 text-[11px] leading-snug text-ink/50 dark:text-paper/50">
              {mode.note}
            </p>
          </button>
        );
      })}
    </div>
  );
}
