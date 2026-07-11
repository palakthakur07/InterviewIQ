import { useState } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown, Lightbulb, SkipForward } from 'lucide-react';
import { getScoreAccent, formatScore } from '../../utils/scoreHelpers';

const TYPE_META = {
  technical: { label: 'Technical', className: 'bg-signal-50 text-signal-700 dark:bg-signal-500/10 dark:text-signal-300' },
  project: { label: 'Project', className: 'bg-cyan/10 text-cyan' },
  behavioral: { label: 'Behavioral', className: 'bg-amber/10 text-amber' },
  'follow-up': { label: 'Follow-up', className: 'bg-mint/10 text-mint' },
};

function QuestionItem({ index, question, answer }) {
  const [open, setOpen] = useState(false);
  const meta = TYPE_META[question.type] || TYPE_META.technical;
  const skipped = answer?.skipped;
  const evaluation = answer?.evaluation;
  const accent = getScoreAccent(skipped ? null : evaluation?.score);

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${accent.bg} ${accent.text}`}
        >
          {skipped ? <SkipForward size={14} /> : formatScore(evaluation?.score)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.className}`}>
              {meta.label}
            </span>
            <span className="font-mono text-[11px] text-ink/40 dark:text-paper/40">
              Q{index + 1} · {question.topic}
            </span>
          </div>
          <p className="mt-1 truncate text-sm font-medium text-ink/85 dark:text-paper/85">
            {question.text}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-ink/40 transition-transform dark:text-paper/40 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="animate-fade-in border-t border-paper-line px-4 pb-5 pt-4 dark:border-ink-line sm:px-5">
          <p className="text-sm font-medium text-ink/85 dark:text-paper/85">{question.text}</p>

          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-paper/45">
              Your answer
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink/70 dark:text-paper/70">
              {skipped ? 'This question was skipped.' : answer?.text || 'No answer recorded.'}
            </p>
          </div>

          {!skipped && evaluation && (
            <>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mint">
                    <ThumbsUp size={12} />
                    Strengths
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm text-ink/70 dark:text-paper/70">
                    {(evaluation.strengths || []).length === 0 && (
                      <li className="text-ink/40 dark:text-paper/40">None noted.</li>
                    )}
                    {evaluation.strengths?.map((s) => (
                      <li key={s} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-coral">
                    <ThumbsDown size={12} />
                    Weaknesses
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm text-ink/70 dark:text-paper/70">
                    {(evaluation.weaknesses || []).length === 0 && (
                      <li className="text-ink/40 dark:text-paper/40">None noted.</li>
                    )}
                    {evaluation.weaknesses?.map((w) => (
                      <li key={w} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {evaluation.suggestedAnswer && (
                <div className="mt-4 rounded-xl border border-signal-500/20 bg-signal-50 p-3.5 dark:bg-signal-500/10">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-signal-700 dark:text-cyan">
                    <Lightbulb size={12} />
                    A stronger answer
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/80 dark:text-paper/80">
                    {evaluation.suggestedAnswer}
                  </p>
                </div>
              )}
            </>
          )}

          {!skipped && answer?.evaluationStatus === 'failed' && (
            <p className="mt-3 text-sm text-coral">
              This answer couldn't be scored ({answer.evaluationError || 'AI evaluation failed'}).
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuestionReviewAccordion({ questions, answers }) {
  const answerByQuestion = new Map((answers || []).map((a) => [String(a.question), a]));

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <QuestionItem
          key={question.id}
          index={index}
          question={question}
          answer={answerByQuestion.get(String(question.id))}
        />
      ))}
    </div>
  );
}
