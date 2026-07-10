import { ThumbsUp, ThumbsDown, Lightbulb, Gauge, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';

function scoreAccent(score) {
  if (score >= 8) return { text: 'text-mint', bg: 'bg-mint/10', ring: 'border-mint/30' };
  if (score >= 5) return { text: 'text-amber', bg: 'bg-amber/10', ring: 'border-amber/30' };
  return { text: 'text-coral', bg: 'bg-coral/10', ring: 'border-coral/30' };
}

export default function EvaluationCard({ answer, onContinue, onRetry, isRetrying }) {
  if (answer.evaluationStatus === 'failed') {
    return (
      <div className="card animate-fade-up mt-4 p-6">
        <div className="flex items-start gap-3 text-coral">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">We couldn't score this answer</p>
            <p className="mt-1 text-sm text-coral/80">
              {answer.evaluationError || 'The AI service failed. Your answer was saved — you can retry scoring it.'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <button type="button" onClick={onRetry} disabled={isRetrying} className="btn-secondary">
            <RotateCcw size={15} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'Retrying…' : 'Retry scoring'}
          </button>
          <button type="button" onClick={onContinue} className="btn-primary">
            Continue anyway
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  if (!answer.evaluation) return null;

  const { score, strengths, weaknesses, suggestedAnswer, confidence } = answer.evaluation;
  const accent = scoreAccent(score);

  return (
    <div className="card animate-fade-up mt-4 p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${accent.ring} ${accent.bg} font-display text-lg font-bold ${accent.text}`}
          >
            {score.toFixed(1)}
          </span>
          <div>
            <p className="font-display text-sm font-semibold">Score out of 10</p>
            <p className="flex items-center gap-1 text-xs text-ink/50 dark:text-paper/50">
              <Gauge size={12} />
              AI confidence: {Math.round(confidence)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mint">
            <ThumbsUp size={13} />
            Strengths
          </p>
          {strengths.length === 0 ? (
            <p className="mt-2 text-sm text-ink/45 dark:text-paper/45">No specific strengths noted.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
              {strengths.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-coral">
            <ThumbsDown size={13} />
            Weaknesses
          </p>
          {weaknesses.length === 0 ? (
            <p className="mt-2 text-sm text-ink/45 dark:text-paper/45">No specific weaknesses noted.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
              {weaknesses.map((w) => (
                <li key={w} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                  {w}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {suggestedAnswer && (
        <div className="mt-5 rounded-xl border border-signal-500/20 bg-signal-50 p-4 dark:bg-signal-500/10">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-signal-700 dark:text-cyan">
            <Lightbulb size={13} />
            A stronger answer might sound like
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80 dark:text-paper/80">{suggestedAnswer}</p>
        </div>
      )}

      <button type="button" onClick={onContinue} className="btn-primary mt-6 w-full sm:w-auto">
        Continue
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
