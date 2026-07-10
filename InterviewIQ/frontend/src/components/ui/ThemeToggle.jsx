import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-paper-line
      text-ink/70 transition-colors hover:border-signal-500/60 hover:text-signal-600
      dark:border-ink-line dark:text-paper/70 dark:hover:text-cyan ${className}`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
