import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileUp,
  MessagesSquare,
  RotateCcw,
  Trophy,
  TrendingUp,
  FileText,
  History,
  ArrowRight,
  CheckCircle2,
  SkipForward,
} from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/dashboard/EmptyState';
import CompanyModeSelector from '../components/dashboard/CompanyModeSelector';
import CompanyBadge from '../components/interview/CompanyBadge';
import { useAuth } from '../context/AuthContext';
import { listResumesRequest } from '../api/resume';
import { getActiveInterviewRequest, getInterviewHistoryRequest } from '../api/interview';

const COMPANY_MODE_KEY = 'interviewiq_company_mode';

function scoreAccentClass(score) {
  if (score === null || score === undefined) return 'text-ink/40 dark:text-paper/40';
  if (score >= 8) return 'text-mint';
  if (score >= 5) return 'text-amber';
  return 'text-coral';
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [activeSession, setActiveSession] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);

  const [companyMode, setCompanyMode] = useState(
    () => localStorage.getItem(COMPANY_MODE_KEY) || 'general',
  );

  useEffect(() => {
    let cancelled = false;

    async function loadResumes() {
      try {
        const data = await listResumesRequest();
        if (!cancelled) setResumes(data.resumes);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Could not load your resumes.');
      } finally {
        if (!cancelled) setIsLoadingResumes(false);
      }
    }

    async function loadInterviews() {
      try {
        const [activeData, historyData] = await Promise.all([
          getActiveInterviewRequest(),
          getInterviewHistoryRequest(),
        ]);
        if (cancelled) return;
        setActiveSession(activeData.session);
        setInterviews(historyData.interviews);
      } catch {
        // Non-critical for the dashboard shell — stat cards just show empty state.
      } finally {
        if (!cancelled) setIsLoadingInterviews(false);
      }
    }

    loadResumes();
    loadInterviews();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCompanyModeChange(mode) {
    setCompanyMode(mode);
    localStorage.setItem(COMPANY_MODE_KEY, mode);
  }

  function handleStartOrResume() {
    if (activeSession) {
      navigate('/interview');
      return;
    }
    navigate('/interview', { state: { resumeId: resumes[0].id, company: companyMode } });
  }

  const hasResume = resumes.length > 0;
  const hasActiveSession = Boolean(activeSession);
  const scoredInterviews = interviews.filter((i) => i.overallScore !== null);
  const bestScore = scoredInterviews.length
    ? Math.max(...scoredInterviews.map((i) => i.overallScore))
    : null;
  const averageScore = scoredInterviews.length
    ? Math.round(
        (scoredInterviews.reduce((sum, i) => sum + i.overallScore, 0) / scoredInterviews.length) * 10,
      ) / 10
    : null;

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="eyebrow">Welcome back</span>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {user?.name?.split(' ')[0] || 'there'}, ready to practice?
            </h2>
            <p className="mt-1.5 text-sm text-ink/60 dark:text-paper/60">
              {hasActiveSession
                ? 'You have an interview in progress — pick up where you left off.'
                : hasResume
                  ? 'Pick a company mode and start your next mock interview.'
                  : 'Upload a resume to unlock a tailored interview.'}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link to="/upload-resume" className="btn-secondary">
              <FileUp size={16} />
              Upload resume
            </Link>
            <button
              type="button"
              onClick={handleStartOrResume}
              disabled={!hasActiveSession && !hasResume}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              title={hasActiveSession || hasResume ? undefined : 'Upload a resume first'}
            >
              {hasActiveSession ? <RotateCcw size={16} /> : <MessagesSquare size={16} />}
              {hasActiveSession ? 'Resume interview' : 'Start interview'}
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={MessagesSquare}
            label="Interviews completed"
            value={interviews.length}
            hint={hasActiveSession ? '1 in progress' : interviews.length ? 'All time' : 'None yet'}
            accent="bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300"
            isLoading={isLoadingInterviews}
          />
          <StatCard
            icon={Trophy}
            label="Best score"
            value={bestScore !== null ? bestScore.toFixed(1) : '—'}
            hint={scoredInterviews.length ? 'out of 10' : 'No interviews yet'}
            accent="bg-amber/10 text-amber"
            isLoading={isLoadingInterviews}
          />
          <StatCard
            icon={TrendingUp}
            label="Average score"
            value={averageScore !== null ? averageScore.toFixed(1) : '—'}
            hint={scoredInterviews.length ? 'out of 10' : 'No interviews yet'}
            accent="bg-mint/10 text-mint"
            isLoading={isLoadingInterviews}
          />
          <StatCard
            icon={FileText}
            label="Resumes uploaded"
            value={resumes.length}
            hint={hasResume ? `Latest: ${resumes[0].originalName}` : 'None yet'}
            accent="bg-cyan/10 text-cyan"
            isLoading={isLoadingResumes}
          />
        </div>

        {/* Company mode */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Company mode</h3>
            <span className="font-mono text-xs text-ink/40 dark:text-paper/40">
              applies to your next interview
            </span>
          </div>
          <CompanyModeSelector value={companyMode} onChange={handleCompanyModeChange} />
        </div>

        {/* Recent interview history */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Recent interviews</h3>
            {interviews.length > 0 && (
              <Link
                to="/history"
                className="flex items-center gap-1 text-xs font-medium text-signal-600 hover:underline dark:text-cyan"
              >
                View all
                <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {!isLoadingInterviews && interviews.length === 0 && (
            <div className="card p-6">
              <EmptyState
                icon={History}
                title="No interviews yet"
                description="Once you complete a mock interview, your sessions and scores will show up here."
                action={
                  <button
                    type="button"
                    onClick={handleStartOrResume}
                    disabled={!hasActiveSession && !hasResume}
                    className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {hasResume || hasActiveSession ? 'Start your first interview' : 'Upload a resume to begin'}
                    <ArrowRight size={15} />
                  </button>
                }
              />
            </div>
          )}

          {!isLoadingInterviews && interviews.length > 0 && (
            <div className="space-y-3">
              {interviews.slice(0, 5).map((interview) => (
                <Link
                  key={interview.id}
                  to={`/results/${interview.id}`}
                  className="card flex items-center gap-4 p-4 transition-colors hover:border-signal-500/40"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper-line/60 font-display text-sm font-bold dark:bg-ink-line/60 ${scoreAccentClass(interview.overallScore)}`}
                  >
                    {interview.overallScore !== null ? interview.overallScore.toFixed(1) : '—'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CompanyBadge company={interview.company} />
                      <span className="font-mono text-xs text-ink/40 dark:text-paper/40">
                        {new Date(interview.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-ink/55 dark:text-paper/55">
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
                    </div>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-ink/30 dark:text-paper/30" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Resume list / empty state */}
        {!isLoadingResumes && !hasResume && !loadError && (
          <div>
            <h3 className="mb-3 font-display text-base font-semibold">Your resumes</h3>
            <div className="card p-6">
              <EmptyState
                icon={FileUp}
                title="No resume uploaded yet"
                description="Upload a PDF or DOCX resume so InterviewIQ can tailor questions to your real skills and projects."
                action={
                  <Link to="/upload-resume" className="btn-primary">
                    <FileUp size={15} />
                    Upload resume
                  </Link>
                }
              />
            </div>
          </div>
        )}

        {loadError && <p className="text-sm text-coral">{loadError}</p>}
      </div>
    </DashboardLayout>
  );
}
