import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, TerminalSquare } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Company mode', href: '#company-mode' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-paper-line bg-paper/80 backdrop-blur-md dark:border-ink-line dark:bg-ink/80'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient text-white">
            <TerminalSquare size={18} />
          </span>
          InterviewIQ
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-signal-600 dark:text-paper/70 dark:hover:text-cyan"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            to="/login"
            className="text-sm font-medium text-ink/70 hover:text-signal-600 dark:text-paper/70 dark:hover:text-cyan"
          >
            Log in
          </Link>
          <Link to="/signup" className="btn-primary !px-5 !py-2.5 text-sm">
            Start free
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-paper-line dark:border-ink-line"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-paper-line bg-paper/95 backdrop-blur-md dark:border-ink-line dark:bg-ink/95 md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-paper-surface dark:text-paper/80 dark:hover:bg-ink-surface"
              >
                {link.label}
              </a>
            ))}
            <div className="my-2 h-px bg-paper-line dark:bg-ink-line" />
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-paper-surface dark:text-paper/80 dark:hover:bg-ink-surface"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full text-sm"
            >
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
