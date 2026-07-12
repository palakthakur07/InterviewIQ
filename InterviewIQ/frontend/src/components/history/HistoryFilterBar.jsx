import { Search } from 'lucide-react';

const COMPANIES = [
  { id: 'all', label: 'All companies' },
  { id: 'general', label: 'General' },
  { id: 'google', label: 'Google' },
  { id: 'amazon', label: 'Amazon' },
  { id: 'microsoft', label: 'Microsoft' },
  { id: 'atlassian', label: 'Atlassian' },
];
const SCORE_BANDS = [
  { id: 'all', label: 'Any score' },
  { id: 'high', label: '8 – 10' },
  { id: 'mid', label: '5 – 7.9' },
  { id: 'low', label: 'Below 5' },
];
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'highest', label: 'Highest score' },
  { id: 'lowest', label: 'Lowest score' },
];

const selectClass =
  'rounded-xl border border-paper-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-signal-500 dark:border-ink-line dark:bg-ink';

export default function HistoryFilterBar({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-paper/40" />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => update('query', e.target.value)}
          placeholder="Search by company..."
          className={`${selectClass} w-full pl-9`}
        />
      </div>

      <select
        value={filters.company}
        onChange={(e) => update('company', e.target.value)}
        className={selectClass}
        aria-label="Filter by company"
      >
        {COMPANIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={filters.scoreBand}
        onChange={(e) => update('scoreBand', e.target.value)}
        className={selectClass}
        aria-label="Filter by score"
      >
        {SCORE_BANDS.map((b) => (
          <option key={b.id} value={b.id}>
            {b.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.date}
        onChange={(e) => update('date', e.target.value)}
        className={selectClass}
        aria-label="Filter by date"
      />

      <select
        value={filters.sort}
        onChange={(e) => update('sort', e.target.value)}
        className={selectClass}
        aria-label="Sort interviews"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
