export default function ChipListCard({ icon: Icon, title, items, accent, emptyLabel }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
          <Icon size={15} />
        </span>
        <h3 className="font-display text-sm font-semibold">{title}</h3>
        <span className="ml-auto font-mono text-xs text-ink/40 dark:text-paper/40">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink/45 dark:text-paper/45">{emptyLabel}</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-paper-line px-3 py-1 text-xs font-medium text-ink/75 dark:border-ink-line dark:text-paper/75"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
