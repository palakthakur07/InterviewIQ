import { Link } from 'react-router-dom';
import { Eye, Download, Trash2, CheckCircle2, SkipForward, Loader2 } from 'lucide-react';
import CompanyBadge from '../interview/CompanyBadge';
import { getScoreAccent, formatScore, formatDuration, formatDate } from '../../utils/scoreHelpers';

export default function HistoryCard({ interview, onDownload, onDelete, isDownloading, isDeleting }) {
  const accent = getScoreAccent(interview.overallScore);

  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold ${accent.bg} ${accent.text}`}
      >
        {formatScore(interview.overallScore)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <CompanyBadge company={interview.company} />
          <span className="rounded-full bg-mint/10 px-2 py-0.5 text-[11px] font-medium text-mint">
            Completed
          </span>
          <span className="font-mono text-xs text-ink/40 dark:text-paper/40">
            {formatDate(interview.completedAt)}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-ink/55 dark:text-paper/55">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} />
            {interview.answeredCount} answered
          </span>
          {interview.skippedCount > 0 && (
            <span className="flex items-center gap-1">
              <SkipForward size={12} />
              {interview.skippedCount} skipped
            </span>
          )}
          <span>{formatDuration(interview.durationSeconds)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          to={`/results/${interview.id}`}
          className="btn-secondary !px-3 !py-2 text-xs"
          title="View report"
        >
          <Eye size={14} />
          View
        </Link>
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          className="btn-secondary !px-3 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
          title="Download PDF"
        >
          {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-paper-line text-coral transition-colors hover:border-coral/50 hover:bg-coral/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-line"
          title="Delete interview"
        >
          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>
    </div>
  );
}
