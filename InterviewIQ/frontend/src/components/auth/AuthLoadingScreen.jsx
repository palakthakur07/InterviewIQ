import { TerminalSquare } from 'lucide-react';

export default function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-ink">
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-signal-gradient text-white">
          <TerminalSquare size={20} />
        </span>
        <span className="font-mono text-xs text-ink/50 dark:text-paper/50">
          checking session…
        </span>
      </div>
    </div>
  );
}
