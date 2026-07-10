import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import InterviewPreview from './InterviewPreview';

export default function Hero() {
  return (
    <section id="product" className="relative overflow-hidden">
      {/* background grid + glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-40 dark:bg-grid dark:opacity-30" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-signal-500/20 blur-[120px]" />

      <div className="container-page relative grid gap-14 py-20 lg:grid-cols-2 lg:gap-10 lg:py-28">
        <div className="flex flex-col justify-center">
          <span className="eyebrow mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-signal-500/30 bg-signal-50 px-3 py-1 dark:bg-signal-500/10">
            Resume-aware mock interviews
          </span>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Practice interviews your resume actually gets asked.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70 dark:text-paper/70">
            Upload your resume and InterviewIQ's AI reads it like a hiring manager would —
            pulling out your real skills and projects, then running a live technical interview
            built around them. Every answer gets scored and critiqued on the spot.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="btn-primary">
              Start a mock interview
              <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              <FileText size={16} />
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-ink/50 dark:text-paper/50">
            <span className="font-mono">No credit card</span>
            <span className="h-1 w-1 rounded-full bg-ink/20 dark:bg-paper/20" />
            <span className="font-mono">PDF &amp; DOCX resumes</span>
            <span className="h-1 w-1 rounded-full bg-ink/20 dark:bg-paper/20" />
            <span className="font-mono">Google · Amazon · Microsoft · Atlassian modes</span>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md animate-float">
            <InterviewPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
