export default function SettingsSection({ title, description, children }) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">{description}</p>}
      </div>
      <div className="card p-6">{children}</div>
    </section>
  );
}
