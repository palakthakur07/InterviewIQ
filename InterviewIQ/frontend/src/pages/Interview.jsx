import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import InterviewLoadingSkeleton from '../components/interview/InterviewLoadingSkeleton';
import CompanyBadge from '../components/interview/CompanyBadge';
import ProgressBar from '../components/interview/ProgressBar';
import QuestionCard from '../components/interview/QuestionCard';
import AnswerBox from '../components/interview/AnswerBox';
import EvaluationCard from '../components/interview/EvaluationCard';
import InterviewCompleteCard from '../components/interview/InterviewCompleteCard';
import { useInterviewTimer } from '../hooks/useInterviewTimer';
import {
  startInterviewRequest,
  getActiveInterviewRequest,
  getInterviewSessionRequest,
  submitAnswerRequest,
  retryEvaluationRequest,
  saveProgressRequest,
  finishInterviewRequest,
} from '../api/interview';

// checking -> starting -> question <-> evaluation -> complete
// (or) checking -> setup-needed / error
export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeId, company } = location.state || {};

  const [phase, setPhase] = useState('checking');
  const [session, setSession] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [lastAnswer, setLastAnswer] = useState(null);
  const [interviewReport, setInterviewReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [formError, setFormError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Holds { nextQuestion, isComplete, progress } between showing the
  // evaluation card and the person clicking "Continue".
  const pendingNext = useRef(null);

  const { formatted: elapsedTime } = useInterviewTimer(currentQuestion?.id, phase !== 'question');

  const loadSession = useCallback(async (sessionId) => {
    const data = await getInterviewSessionRequest(sessionId);
    setSession(data.session);
    setTotalQuestions(data.session.totalQuestions);
    setQuestionIndex(data.session.currentQuestionIndex);

    if (data.isComplete) {
      const finished = await finishInterviewRequest(sessionId);
      setInterviewReport(finished.interview);
      setPhase('complete');
      return;
    }

    setCurrentQuestion(data.currentQuestion);
    setAnswerText(data.session.draftAnswerText || '');
    setPhase('question');
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const activeData = await getActiveInterviewRequest();
        if (cancelled) return;

        if (activeData.session) {
          await loadSession(activeData.session.id);
          return;
        }

        if (!resumeId) {
          setPhase('setup-needed');
          return;
        }

        setPhase('starting');
        const started = await startInterviewRequest({ resumeId, company: company || 'general' });
        if (cancelled) return;

        setSession(started.session);
        setCurrentQuestion(started.currentQuestion);
        setTotalQuestions(started.session.totalQuestions);
        setQuestionIndex(0);
        setAnswerText('');
        setPhase('question');
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err.message || 'Could not start the interview.');
          setPhase('error');
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // Runs once on mount — resumeId/company come from initial navigation state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function advanceOrFinish(data) {
    if (data.isComplete) {
      try {
        const finished = await finishInterviewRequest(session.id);
        setInterviewReport(finished.interview);
        setPhase('complete');
      } catch (err) {
        setErrorMessage(err.message || 'Could not finalize your interview report.');
        setPhase('error');
      }
      return;
    }
    setQuestionIndex(data.progress.currentQuestionIndex);
    setCurrentQuestion(data.nextQuestion);
    setAnswerText('');
    setFormError('');
    setPhase('question');
  }

  async function handleSubmit(skipped) {
    if (!skipped && !answerText.trim()) {
      setFormError('Enter an answer or skip this question.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    try {
      const data = await submitAnswerRequest(session.id, {
        questionId: currentQuestion.id,
        answerText,
        skipped,
      });
      setTotalQuestions(data.progress.totalQuestions);

      if (skipped) {
        await advanceOrFinish(data);
      } else {
        setLastAnswer(data.answer);
        pendingNext.current = data;
        setPhase('evaluation');
      }
    } catch (err) {
      setFormError(err.message || 'Could not submit your answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleContinue() {
    if (pendingNext.current) {
      await advanceOrFinish(pendingNext.current);
      pendingNext.current = null;
    }
  }

  async function handleRetryEvaluation() {
    setIsRetrying(true);
    try {
      const data = await retryEvaluationRequest(session.id, lastAnswer.id);
      setLastAnswer(data.answer);
    } catch (err) {
      setFormError(err.message || 'Retry failed. Please try again.');
    } finally {
      setIsRetrying(false);
    }
  }

  async function handleSaveExit() {
    try {
      await saveProgressRequest(session.id, answerText);
    } catch {
      // Best-effort save — still let the person leave.
    }
    navigate('/dashboard');
  }

  if (phase === 'checking' || phase === 'starting') {
    return (
      <DashboardLayout title="Interview">
        <InterviewLoadingSkeleton
          message={
            phase === 'checking'
              ? 'Checking for an interview in progress…'
              : 'Generating your interview questions…'
          }
        />
      </DashboardLayout>
    );
  }

  if (phase === 'setup-needed') {
    return (
      <DashboardLayout title="Interview">
        <div className="mx-auto max-w-lg py-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-cyan">
            <AlertCircle size={22} />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold">Set up your interview first</h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
            Head back to the dashboard, pick a company mode, and click "Start interview" once
            you've uploaded a resume.
          </p>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary mt-6">
            <ArrowLeft size={16} />
            Back to dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (phase === 'error') {
    return (
      <DashboardLayout title="Interview">
        <div className="mx-auto max-w-lg py-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10 text-coral">
            <AlertCircle size={22} />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">{errorMessage}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => window.location.reload()} className="btn-secondary">
              <RotateCcw size={15} />
              Try again
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary">
              <ArrowLeft size={16} />
              Back to dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (phase === 'complete' && interviewReport) {
    return (
      <DashboardLayout title="Interview">
        <InterviewCompleteCard interview={interviewReport} />
      </DashboardLayout>
    );
  }

  // phase === 'question' | 'evaluation'
  return (
    <DashboardLayout title="Interview">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <CompanyBadge company={session?.company} />
        </div>

        <ProgressBar current={questionIndex} total={totalQuestions} />

        {currentQuestion && (
          <div className="mt-4">
            <QuestionCard question={currentQuestion} elapsedTime={elapsedTime} />
          </div>
        )}

        {phase === 'question' && (
          <AnswerBox
            value={answerText}
            onChange={setAnswerText}
            onSubmit={() => handleSubmit(false)}
            onSkip={() => handleSubmit(true)}
            onSaveExit={handleSaveExit}
            isSubmitting={isSubmitting}
            error={formError}
          />
        )}

        {phase === 'evaluation' && lastAnswer && (
          <EvaluationCard
            answer={lastAnswer}
            onContinue={handleContinue}
            onRetry={handleRetryEvaluation}
            isRetrying={isRetrying}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
