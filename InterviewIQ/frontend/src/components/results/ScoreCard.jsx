import { getScoreAccent, formatScore } from '../../utils/scoreHelpers';

export default function ScoreCard({ icon: Icon, label, score }) {
  const accent = getScoreAccent(score);

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent.bg} ${accent.text}`}>
          <Icon size={15} />
        </span>
        <p className="text-xs font-medium text-ink/60 dark:text-paper/60">{label}</p>
      </div>
      <p className={`mt-4 font-display text-3xl font-bold ${accent.text}`}>
        {formatScore(score)}
        <span className="ml-1 text-sm font-normal text-ink/40 dark:text-paper/40">/10</span>
      </p>
    </div>
  );
}
