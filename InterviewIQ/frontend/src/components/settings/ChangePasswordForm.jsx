import { useState } from 'react';
import { Loader2, KeyRound } from 'lucide-react';

export default function ChangePasswordForm({ onSubmit, isSaving }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      setFormError('New password must be at least 8 characters and include a number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('New password and confirmation do not match.');
      return;
    }

    const ok = await onSubmit({ currentPassword, newPassword });
    if (ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <p role="alert" className="rounded-lg border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-sm text-coral">
          {formError}
        </p>
      )}
      <div>
        <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-medium">
          Current password
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isSaving} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
          Update password
        </button>
      </div>
    </form>
  );
}
