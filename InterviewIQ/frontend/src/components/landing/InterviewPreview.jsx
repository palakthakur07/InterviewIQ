import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

const QUESTION =
  'Walk me through how you optimized the database queries in your e-commerce project.';
const ANSWER =
  'I profiled the slow endpoints first, added composite indexes on order_id and user_id, then introduced Redis caching for repeat reads. That cut average response time from 480ms to 90ms.';
const FEEDBACK =
  'Strong, metric-backed answer. Next time, mention your cache invalidation strategy to show you considered staleness.';

// Typewriter hook: reveals `text` a few characters at a time once `active` is true.
function useTypewriter(text, active, speed = 18) {
  const [output, setOutput] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    indexRef.current = 0;
    setOutput('');
    const id = setInterval(() => {
      indexRef.current += 1;
      setOutput(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);

  return output;
}

const STAGE_DURATIONS = [1900, 2600, 1400, 4200]; // question, answer, thinking, feedback (hold)

export default function InterviewPreview() {
  const [stage, setStage] = useState(0); // 0 idle/question, 1 answer, 2 evaluating, 3 feedback

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage((s) => (s + 1) % 4);
    }, STAGE_DURATIONS[stage]);
    return () => clearTimeout(timer);
  }, [stage]);

  const questionText = useTypewriter(QUESTION, stage >= 0, 16);
  const answerText = useTypewriter(ANSWER, stage >= 1, 12);

  return (
    <div className="card relative w-full overflow-hidden shadow-2xl shadow-signal-500/10">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-paper-line px-4 py-3 dark:border-ink-line">
        <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
        <span className="ml-3 font-mono text-xs text-ink/40 dark:text-paper/40">
          live-interview — SDE track
        </span>
      </div>

      <div className="space-y-4 p-5 font-mono text-sm">
        {/* AI question */}
        <div className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-signal-gradient text-white">
            <Sparkles size={12} />
          </span>
          <p className="leading-relaxed text-ink dark:text-paper">
            <span className="text-signal-600 dark:text-cyan">Q3 · Projects · </span>
            {questionText}
            {stage === 0 && <span className="animate-blink">▍</span>}
          </p>
        </div>

        {/* user answer */}
        {stage >= 1 && (
          <div className="flex justify-end gap-3">
            <p className="max-w-[85%] rounded-xl rounded-tr-sm bg-paper-line/60 px-3 py-2 leading-relaxed text-ink/90 dark:bg-ink-line/50 dark:text-paper/90">
              {answerText}
              {stage === 1 && <span className="animate-blink">▍</span>}
            </p>
          </div>
        )}

        {/* evaluating */}
        {stage === 2 && (
          <div className="flex items-center gap-2 pl-9 text-xs text-ink/50 dark:text-paper/50">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-signal-500" />
            scoring response against role rubric…
          </div>
        )}

        {/* feedback */}
        {stage === 3 && (
          <div className="animate-fade-up rounded-xl border border-mint/30 bg-mint/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-mint">
                Feedback
              </span>
              <span className="rounded-full bg-mint/20 px-2.5 py-1 text-xs font-bold text-mint">
                8.5 / 10
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/80 dark:text-paper/80">
              {FEEDBACK}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
