import { Loader2, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const COMPANIES = [
  { id: 'general', label: 'General' },
  { id: 'google', label: 'Google' },
  { id: 'amazon', label: 'Amazon' },
  { id: 'microsoft', label: 'Microsoft' },
  { id: 'atlassian', label: 'Atlassian' },
];
const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function PreferencesForm({ preferences, onChange, onSave, isSaving }) {
  const { theme, toggleTheme } = useTheme();

  function handleSubmit(e) {
    e.preventDefault();
    onSave();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-paper-line p-4 dark:border-ink-line">
        <div>
          <p className="text-sm font-medium">Appearance</p>
          <p className="mt-0.5 text-xs text-ink/55 dark:text-paper/55">
            {theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full border border-paper-line px-4 py-1.5 text-xs font-medium dark:border-ink-line"
        >
          Switch to {theme === 'dark' ? 'light' : 'dark'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          id="defaultCompany"
          label="Default company mode"
          value={preferences.defaultCompany}
          onChange={(v) => onChange({ ...preferences, defaultCompany: v })}
          options={COMPANIES}
        />
        <SelectField
          id="interviewDifficulty"
          label="Interview difficulty"
          value={preferences.interviewDifficulty}
          onChange={(v) => onChange({ ...preferences, interviewDifficulty: v })}
          options={DIFFICULTIES}
        />
        <div>
          <label htmlFor="defaultQuestionCount" className="mb-1.5 block text-sm font-medium">
            Default number of questions
          </label>
          <input
            id="defaultQuestionCount"
            type="number"
            min={3}
            max={15}
            value={preferences.defaultQuestionCount}
  onFocus={(e) => e.target.select()}
  onChange={(e) => {
    const raw = e.target.value;
    onChange({ ...preferences, defaultQuestionCount: raw === '' ? '' : Number(raw) });
  }}
  onBlur={(e) => {
    const clamped = Math.min(15, Math.max(3, Number(e.target.value) || 6));
    onChange({ ...preferences, defaultQuestionCount: clamped });
  }}
            className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSaving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save preferences
        </button>
      </div>
    </form>
  );
}
