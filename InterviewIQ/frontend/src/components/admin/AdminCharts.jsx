import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const COMPANY_LABELS = {
  general: 'General',
  google: 'Google',
  amazon: 'Amazon',
  microsoft: 'Microsoft',
  atlassian: 'Atlassian',
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-paper-line bg-paper-surface px-3 py-2 text-xs shadow-lg dark:border-ink-line dark:bg-ink-surface">
      <p className="font-medium">{label}</p>
      <p className="text-ink/60 dark:text-paper/60">{payload[0].value} interviews</p>
    </div>
  );
}

export function CompanyDistributionChart({ data }) {
  const chartData = data.map((d) => ({ ...d, label: COMPANY_LABELS[d.company] || d.company }));

  return (
    <div className="card p-5">
      <h3 className="mb-4 font-display text-sm font-semibold">Interviews by company mode</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-paper-line dark:text-ink-line" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink/50 dark:text-paper/50" />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink/50 dark:text-paper/50" />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(110,86,207,0.08)' }} />
            <Bar dataKey="count" fill="#6E56CF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function InterviewsOverTimeChart({ data }) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="card p-5">
      <h3 className="mb-4 font-display text-sm font-semibold">Interviews — last 14 days</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-paper-line dark:text-ink-line" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink/50 dark:text-paper/50" />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink/50 dark:text-paper/50" />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="count" stroke="#33C3F0" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
