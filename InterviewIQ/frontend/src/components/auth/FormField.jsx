export default function FormField({
  label,
  id,
  error,
  type = 'text',
  rightSlot = null,
  inputRef,
  ...inputProps
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/80 dark:text-paper/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          ref={inputRef}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-paper-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors
          placeholder:text-ink/35 focus:border-signal-500 focus:ring-2 focus:ring-signal-500/20
          dark:bg-ink-surface2 dark:text-paper dark:placeholder:text-paper/30
          ${error ? 'border-coral/60 focus:border-coral focus:ring-coral/20' : 'border-paper-line dark:border-ink-line'}
          ${rightSlot ? 'pr-11' : ''}`}
          {...inputProps}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightSlot}</div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
