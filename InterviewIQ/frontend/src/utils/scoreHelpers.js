/** Tailwind class fragments keyed by score band, reused across score-related UI. */
export function getScoreAccent(score) {
  if (score === null || score === undefined) {
    return { text: 'text-ink/40 dark:text-paper/40', bg: 'bg-paper-line dark:bg-ink-line', ring: 'border-paper-line dark:border-ink-line' };
  }
  if (score >= 8) return { text: 'text-mint', bg: 'bg-mint/10', ring: 'border-mint/30' };
  if (score >= 5) return { text: 'text-amber', bg: 'bg-amber/10', ring: 'border-amber/30' };
  return { text: 'text-coral', bg: 'bg-coral/10', ring: 'border-coral/30' };
}

const VERDICT_ACCENTS = {
  'Strong Hire': { text: 'text-mint', bg: 'bg-mint/10', border: 'border-mint/30' },
  Hire: { text: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/30' },
  Borderline: { text: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/30' },
  'No Hire': { text: 'text-coral', bg: 'bg-coral/10', border: 'border-coral/30' },
};

export function getVerdictAccent(verdict) {
  return VERDICT_ACCENTS[verdict] || VERDICT_ACCENTS.Borderline;
}

export function formatScore(score) {
  return score === null || score === undefined ? '—' : score.toFixed(1);
}

export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return '<1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const COMPANY_LABELS = {
  general: 'General',
  google: 'Google',
  amazon: 'Amazon',
  microsoft: 'Microsoft',
  atlassian: 'Atlassian',
};

export function getCompanyLabel(company) {
  return COMPANY_LABELS[company] || 'General';
}
