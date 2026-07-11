import { Gavel } from 'lucide-react';
import { getVerdictAccent } from '../../utils/scoreHelpers';

export default function HiringRecommendationCard({ recommendation }) {
  if (!recommendation) return null;
  const accent = getVerdictAccent(recommendation.verdict);

  return (
    <div className={`card border ${accent.border} p-6`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bg} ${accent.text}`}>
          <Gavel size={18} />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">
            Hiring recommendation
          </p>
          <p className={`font-display text-lg font-semibold ${accent.text}`}>
            {recommendation.verdict}
          </p>
        </div>
      </div>
      {recommendation.explanation && (
        <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
          {recommendation.explanation}
        </p>
      )}
    </div>
  );
}
