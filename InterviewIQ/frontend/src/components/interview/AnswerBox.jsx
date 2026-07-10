import { Loader2, ArrowRight, SkipForward, Save } from 'lucide-react';

export default function AnswerBox({
  value,
  onChange,
  onSubmit,
  onSkip,
  onSaveExit,
  isSubmitting,
  error,
}) {
  return (
    <div className="card mt-4 p-5 sm:p-6">
      <label htmlFor="answer" className="mb-2 block text-sm font-medium text-ink/80 dark:text-paper/80">
        Your answer
      </label>
      <textarea
        id="answer"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isSubmitting}
        placeholder="Type your answer here — be as specific as you'd be in a real interview."
        className="w-full resize-y rounded-xl border border-paper-line bg-paper-surface px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-signal-500 focus:ring-2 focus:ring-signal-500/20 disabled:opacity-60 dark:border-ink-line dark:bg-ink-surface2 dark:text-paper dark:placeholder:text-paper/30"
      />

      <div className="mt-1.5 flex items-center justify-between">
        <span className="font-mono text-xs text-ink/40 dark:text-paper/40">
          {value.trim().length} characters
        </span>
        {error && <span className="text-xs text-coral">{error}</span>}
      </div>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Scoring answer…
              </>
            ) : (
              <>
                Submit answer
                <ArrowRight size={16} />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={isSubmitting}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SkipForward size={15} />
            Skip
          </button>
        </div>

        <button
          type="button"
          onClick={onSaveExit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-ink/55 transition-colors hover:text-signal-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-paper/55 dark:hover:text-cyan"
        >
          <Save size={15} />
          Save &amp; exit
        </button>
      </div>
    </div>
  );
}
