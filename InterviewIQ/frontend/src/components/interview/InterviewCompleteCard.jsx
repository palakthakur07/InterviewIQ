import { useNavigate } from 'react-router-dom';
import { Trophy, ThumbsUp, ThumbsDown, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

function scoreAccent(score) {
  if (score === null || score === undefined) return { text: 'text-ink/40 dark:text-paper/40', bg: 'bg-paper-line dark:bg-ink-line' };
  if (score >= 8) return { text: 'text-mint', bg: 'bg-mint/10' };
  if (score >= 5) return { text: 'text-amber', bg: 'bg-amber/10' };
  return { text: 'text-coral', bg: 'bg-coral/10' };
}

export default function InterviewCompleteCard({ interview }) {
  const navigate = useNavigate();
  const accent = scoreAccent(interview.overallScore);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card animate-fade-up p-6 text-center sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-signal-gradient text-white">
          <CheckCircle2 size={24} />
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold">Interview complete</h2>
        <p className="mt-1.5 text-sm text-ink/60 dark:text-paper/60">
          Here's how you did across {interview.totalQuestions} question
          {interview.totalQuestions === 1 ? '' : 's'}.
        </p>

        <div className={`mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full ${accent.bg}`}>
          <span className={`font-display text-2xl font-bold ${accent.text}`}>
            {interview.overallScore !== null ? interview.overallScore.toFixed(1) : '—'}
          </span>
        </div>
        <p className="mt-2 font-mono text-xs text-ink/45 dark:text-paper/45">overall score / 10</p>

        <div className="mt-6 grid grid-cols-3 gap-3 text-left">
          <div className="card p-3 text-center">
            <p className="font-display text-lg font-semibold">{interview.answeredCount}</p>
            <p className="text-[11px] text-ink/50 dark:text-paper/50">Answered</p>
          </div>
          <div className="card p-3 text-center">
            <p className="font-display text-lg font-semibold">{interview.skippedCount}</p>
            <p className="text-[11px] text-ink/50 dark:text-paper/50">Skipped</p>
          </div>
          <div className="card p-3 text-center">
            <p className="font-display text-lg font-semibold">
              {Math.round(interview.durationSeconds / 60)}m
            </p>
            <p className="text-[11px] text-ink/50 dark:text-paper/50">Duration</p>
          </div>
        </div>
      </div>

      {(interview.strengths.length > 0 || interview.weaknesses.length > 0) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mint">
              <ThumbsUp size={13} />
              Top strengths
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
              {interview.strengths.length === 0 && (
                <li className="text-ink/40 dark:text-paper/40">Not enough data yet.</li>
              )}
              {interview.strengths.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-coral">
              <ThumbsDown size={13} />
              Areas to improve
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
              {interview.weaknesses.length === 0 && (
                <li className="text-ink/40 dark:text-paper/40">Not enough data yet.</li>
              )}
              {interview.weaknesses.map((w) => (
                <li key={w} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {interview.suggestions.length > 0 && (
        <div className="card mt-4 p-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-signal-700 dark:text-cyan">
            <Target size={13} />
            Suggestions for next time
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
            {interview.suggestions.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary">
          <Trophy size={16} />
          Back to dashboard
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
