export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-paper-line px-6 py-12 text-center dark:border-ink-line">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-line/60 text-ink/40 dark:bg-ink-line/60 dark:text-paper/40">
          <Icon size={20} />
        </span>
      )}
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink/55 dark:text-paper/55">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
