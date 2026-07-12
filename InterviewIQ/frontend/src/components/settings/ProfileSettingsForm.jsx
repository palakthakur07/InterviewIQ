import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

export default function ProfileSettingsForm({ user, onSave, isSaving }) {
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

  const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'college', label: 'College', type: 'text' },
    { name: 'branch', label: 'Branch', type: 'text' },
    { name: 'graduationYear', label: 'Graduation year', type: 'number' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isSaving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save
        </button>
      </div>
    </form>
  );
}
