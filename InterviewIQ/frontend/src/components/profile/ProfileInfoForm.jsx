import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

export default function ProfileInfoForm({ user, onSave, isSaving }) {
  const [form, setForm] = useState({
    name: user.name || '',
    college: user.college || '',
    branch: user.branch || '',
    graduationYear: user.graduationYear || '',
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            value={user.email}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-paper-line bg-paper-line/30 px-3.5 py-2.5 text-sm text-ink/50 dark:border-ink-line dark:bg-ink-line/20 dark:text-paper/50"
          />
        </div>
        <div>
          <label htmlFor="college" className="mb-1.5 block text-sm font-medium">
            College
          </label>
          <input
            id="college"
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="e.g. IIT Bombay"
            className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
          />
        </div>
        <div>
          <label htmlFor="branch" className="mb-1.5 block text-sm font-medium">
            Branch
          </label>
          <input
            id="branch"
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
          />
        </div>
        <div>
          <label htmlFor="graduationYear" className="mb-1.5 block text-sm font-medium">
            Graduation year
          </label>
          <input
            id="graduationYear"
            name="graduationYear"
            type="number"
            min="1990"
            max="2035"
            value={form.graduationYear}
            onChange={handleChange}
            placeholder="e.g. 2026"
            className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSaving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save changes
        </button>
      </div>
    </form>
  );
}
