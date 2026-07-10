import { Link } from 'react-router-dom';
import { TerminalSquare } from 'lucide-react';

// lucide-react no longer ships brand icons, so these are small inline glyphs.
function GithubGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.11.78-.25.78-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.44-2.7 5.41-5.27 5.7.42.36.78 1.07.78 2.16v3.2c0 .3.21.67.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#product' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Company mode', href: '#company-mode' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', href: '/login' },
      { label: 'Sign up', href: '/signup' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-paper-line py-14 dark:border-ink-line">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient text-white">
                <TerminalSquare size={18} />
              </span>
              InterviewIQ
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60 dark:text-paper/60">
              A resume-aware mock interview platform. Built as a portfolio project to explore
              full-stack development with an AI evaluation pipeline.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-paper-line text-ink/60 transition-colors hover:border-signal-500/60 hover:text-signal-600 dark:border-ink-line dark:text-paper/60 dark:hover:text-cyan"
              >
                <GithubGlyph />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-paper-line text-ink/60 transition-colors hover:border-signal-500/60 hover:text-signal-600 dark:border-ink-line dark:text-paper/60 dark:hover:text-cyan"
              >
                <LinkedinGlyph />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm text-ink/60 transition-colors hover:text-signal-600 dark:text-paper/60 dark:hover:text-cyan"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-ink/60 transition-colors hover:text-signal-600 dark:text-paper/60 dark:hover:text-cyan"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-paper-line pt-8 text-xs text-ink/45 dark:border-ink-line dark:text-paper/45 sm:flex-row">
          <span>© {new Date().getFullYear()} InterviewIQ. Built for learning, not production.</span>
          <span className="font-mono">Made with React · Node.js · Gemini 2.5 Flash</span>
        </div>
      </div>
    </footer>
  );
}
