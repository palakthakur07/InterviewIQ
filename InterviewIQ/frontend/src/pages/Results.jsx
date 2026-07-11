import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Award,
  Cpu,
  MessageSquare,
  Puzzle,
  Users,
  Gauge,
  ThumbsUp,
  ThumbsDown,
  Target,
  Download,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import CompanyBadge from '../components/interview/CompanyBadge';
import ScoreCard from '../components/results/ScoreCard';
import HiringRecommendationCard from '../components/results/HiringRecommendationCard';
import QuestionReviewAccordion from '../components/results/QuestionReviewAccordion';
import ResultsLoadingSkeleton from '../components/results/ResultsLoadingSkeleton';
import { getResultRequest, trackPdfGenerationRequest } from '../api/results';
import { generateInterviewReportPdf } from '../utils/generatePdfReport';
import { formatDate, formatDuration } from '../utils/scoreHelpers';
import { useAuth } from '../context/AuthContext';

export default function Results() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getResultRequest(interviewId);
        if (!cancelled) setReport(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load this interview report.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [interviewId]);

  async function handleDownload() {
    if (!report) return;
    setDownloadError('');
    setIsDownloading(true);
    try {
      generateInterviewReportPdf({
        userName: user?.name,
        interview: report.interview,
        resumeSummary: report.resumeSummary,
        questions: report.questions,
        answers: report.answers,
      });
      // Best-effort — the PDF already downloaded either way.
      trackPdfGenerationRequest(report.interview.id).catch(() => {});
    } catch {
      setDownloadError('Could not generate the PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Results">
        <ResultsLoadingSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout title="Results">
        <div className="mx-auto max-w-lg py-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10 text-coral">
            <AlertCircle size={22} />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold">Couldn't load this report</h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">{error}</p>
          <button type="button" onClick={() => navigate('/history')} className="btn-primary mt-6">
            <ArrowLeft size={16} />
            Back to history
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { interview, questions, answers } = report;

  return (
    <DashboardLayout title="Results">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-signal-600 dark:text-paper/55 dark:hover:text-cyan"
          >
            <ArrowLeft size={14} />
            Back to history
          </Link>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <CompanyBadge company={interview.company} />
              <span className="font-mono text-xs text-ink/45 dark:text-paper/45">
                {formatDate(interview.completedAt)} · {formatDuration(interview.durationSeconds)}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                Download PDF
              </button>
              {downloadError && <span className="text-xs text-coral">{downloadError}</span>}
            </div>
          </div>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <ScoreCard icon={Award} label="Overall" score={interview.overallScore} />
          <ScoreCard icon={Cpu} label="Technical" score={interview.skillScores?.technical} />
          <ScoreCard icon={MessageSquare} label="Communication" score={interview.skillScores?.communication} />
          <ScoreCard icon={Puzzle} label="Problem Solving" score={interview.skillScores?.problemSolving} />
          <ScoreCard icon={Users} label="Behavioral" score={interview.skillScores?.behavioral} />
          <ScoreCard icon={Gauge} label="Confidence" score={interview.skillScores?.confidence} />
        </div>

        <HiringRecommendationCard recommendation={interview.recommendation} />

        {/* Strengths / Weaknesses / Suggestions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mint">
              <ThumbsUp size={13} />
              Strengths
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
              {(interview.strengths || []).length === 0 && (
                <li className="text-ink/40 dark:text-paper/40">Not enough data yet.</li>
              )}
              {interview.strengths?.map((s) => (
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
              Weaknesses
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
              {(interview.weaknesses || []).length === 0 && (
                <li className="text-ink/40 dark:text-paper/40">Not enough data yet.</li>
              )}
              {interview.weaknesses?.map((w) => (
                <li key={w} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {interview.suggestions?.length > 0 && (
          <div className="card p-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-signal-700 dark:text-cyan">
              <Target size={13} />
              Suggestions
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

        {/* Question review */}
        <div>
          <h3 className="mb-3 font-display text-base font-semibold">Question review</h3>
          <QuestionReviewAccordion questions={questions} answers={answers} />
        </div>
      </div>
    </DashboardLayout>
  );
}
