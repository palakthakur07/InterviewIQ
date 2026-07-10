import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Wrench, RotateCcw, ArrowRight, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Dropzone from '../components/resume/Dropzone';
import UploadProgress from '../components/resume/UploadProgress';
import ChipListCard from '../components/resume/ChipListCard';
import ProjectsCard from '../components/resume/ProjectsCard';
import EducationCard from '../components/resume/EducationCard';
import { uploadResumeRequest } from '../api/resume';

// idle -> uploading -> success | error
export default function ResumeUpload() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [fileName, setFileName] = useState('');
  const [percent, setPercent] = useState(0);
  const [resume, setResume] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleFileSelected(file) {
    setStatus('uploading');
    setFileName(file.name);
    setPercent(0);
    setErrorMessage('');

    try {
      const data = await uploadResumeRequest(file, setPercent);
      setResume(data.resume);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Could not upload this resume. Please try again.');
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
    setResume(null);
    setFileName('');
    setPercent(0);
    setErrorMessage('');
  }

  return (
    <DashboardLayout title="Upload resume">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow">Resume intelligence</span>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Upload your resume
        </h2>
        <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
          We'll pull out your skills, projects, technologies, and education so your interview
          questions are built around what you've actually worked on.
        </p>

        <div className="mt-8">
          {status === 'idle' && <Dropzone onFileSelected={handleFileSelected} />}

          {status === 'uploading' && (
            <UploadProgress fileName={fileName} percent={percent} />
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3.5 text-sm text-coral"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button type="button" onClick={reset} className="btn-secondary">
                <RotateCcw size={15} />
                Try again
              </button>
            </div>
          )}

          {status === 'success' && resume && (
            <div className="animate-fade-up space-y-6">
              <div className="flex items-start gap-3 rounded-xl border border-mint/30 bg-mint/10 px-4 py-3.5 text-sm text-mint">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Resume parsed successfully</p>
                  <p className="mt-0.5 text-mint/80">
                    {resume.originalName} · {(resume.fileSizeBytes / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ChipListCard
                  icon={Sparkles}
                  title="Skills"
                  items={resume.skills}
                  accent="bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300"
                  emptyLabel="No explicit skills section was detected."
                />
                <ChipListCard
                  icon={Wrench}
                  title="Technologies"
                  items={resume.technologies}
                  accent="bg-amber/10 text-amber"
                  emptyLabel="No specific technologies were detected."
                />
              </div>

              <ProjectsCard projects={resume.projects} />
              <EducationCard education={resume.education} />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={reset} className="btn-secondary">
                  <RotateCcw size={15} />
                  Upload another
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary"
                >
                  Back to dashboard
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
