import { useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function SecuritySettings({ onLogoutAllDevices, isProcessing }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-coral/30 bg-coral/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/80 dark:text-paper/80">
          This will sign you out everywhere, including this device. Continue?
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => setConfirming(false)} className="btn-secondary !px-4 !py-2 text-xs">
            Cancel
          </button>
          <button
            type="button"
            onClick={onLogoutAllDevices}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-coral px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
            Confirm logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">Logout from all devices</p>
        <p className="mt-0.5 text-xs text-ink/55 dark:text-paper/55">
          Invalidates every active session, including this one.
        </p>
      </div>
      <button type="button" onClick={() => setConfirming(true)} className="btn-secondary shrink-0 !px-4 !py-2 text-xs">
        Logout everywhere
      </button>
    </div>
  );
}
