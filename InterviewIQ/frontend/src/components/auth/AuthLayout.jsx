import { Link } from 'react-router-dom';
import { TerminalSquare } from 'lucide-react';
import InterviewPreview from '../landing/InterviewPreview';
import ThemeToggle from '../ui/ThemeToggle';

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient text-white">
              <TerminalSquare size={18} />
            </span>
            InterviewIQ
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-sm">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                {subtitle}
              </p>
            )}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>

      {/* Right: brand panel, hidden on small screens */}
      <div className="relative hidden overflow-hidden border-l border-paper-line bg-ink lg:flex lg:flex-col lg:justify-center dark:border-ink-line">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -top-24 right-0 h-[380px] w-[380px] rounded-full bg-signal-500/25 blur-[110px]" />
        <div className="relative mx-auto w-full max-w-md px-10">
          <p className="font-display text-2xl font-semibold leading-snug text-paper">
            "Practicing on InterviewIQ felt closer to the real loop than any question bank
            I'd used."
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-paper/40">
            — early user feedback
          </p>
          <div className="mt-10">
            <InterviewPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
