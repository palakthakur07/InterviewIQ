import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import EmptyState from '../components/dashboard/EmptyState';
import HistoryCard from '../components/history/HistoryCard';
import HistoryLoadingSkeleton from '../components/history/HistoryLoadingSkeleton';
import DeleteConfirmDialog from '../components/history/DeleteConfirmDialog';
import {
  getHistoryRequest,
  getReportRequest,
  deleteHistoryItemRequest,
  trackPdfGenerationRequest,
} from '../api/results';
import { generateInterviewReportPdf } from '../utils/generatePdfReport';
import { useAuth } from '../context/AuthContext';

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getHistoryRequest();
        if (!cancelled) setInterviews(data.interviews);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Could not load your interview history.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDownload(interview) {
    setActionError('');
    setDownloadingId(interview.id);
    try {
      const fresh = await getReportRequest(interview.id);
      generateInterviewReportPdf({
        userName: user?.name,
        interview: fresh.interview,
        resumeSummary: fresh.resumeSummary,
        questions: fresh.questions,
        answers: fresh.answers,
      });
      trackPdfGenerationRequest(interview.id).catch(() => {});
    } catch (err) {
      setActionError(err.message || 'Could not generate the PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteId) return;
    setActionError('');
    setDeletingId(pendingDeleteId);
    try {
      await deleteHistoryItemRequest(pendingDeleteId);
      setInterviews((prev) => prev.filter((i) => i.id !== pendingDeleteId));
    } catch (err) {
      setActionError(err.message || 'Could not delete this interview. Please try again.');
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  }

  return (
    <DashboardLayout title="Interview history">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="eyebrow">Your interviews</span>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Interview history
            </h2>
          </div>
        </div>

        {actionError && (
          <div role="alert" className="mb-4 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
            {actionError}
          </div>
        )}

        {isLoading && <HistoryLoadingSkeleton />}

        {!isLoading && loadError && <p className="text-sm text-coral">{loadError}</p>}

        {!isLoading && !loadError && interviews.length === 0 && (
          <div className="card p-6">
            <EmptyState
              icon={HistoryIcon}
              title="No interviews yet"
              description="Once you complete a mock interview, it will show up here with your score and a downloadable report."
              action={
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary">
                  Go to dashboard
                  <ArrowRight size={15} />
                </button>
              }
            />
          </div>
        )}

        {!isLoading && !loadError && interviews.length > 0 && (
          <div className="space-y-3">
            {interviews.map((interview) => (
              <HistoryCard
                key={interview.id}
                interview={interview}
                onDownload={() => handleDownload(interview)}
                onDelete={() => setPendingDeleteId(interview.id)}
                isDownloading={downloadingId === interview.id}
                isDeleting={deletingId === interview.id}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={Boolean(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={Boolean(deletingId)}
      />
    </DashboardLayout>
  );
}
