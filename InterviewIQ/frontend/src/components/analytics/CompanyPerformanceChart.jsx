import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6E56CF', '#33C3F0', '#34D399', '#F5B94D', '#F16B6B'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-paper-line bg-paper-surface px-3 py-2 text-xs shadow-lg dark:border-ink-line dark:bg-ink-surface">
      <p className="font-medium text-ink dark:text-paper">{label}</p>
      <p className="mt-0.5 text-ink/60 dark:text-paper/60">
        Avg score: {payload[0].value.toFixed(1)}/10 ({payload[0].payload.count} interview
        {payload[0].payload.count === 1 ? '' : 's'})
      </p>
    </div>
  );
}

export default function CompanyPerformanceChart({ data }) {
  return (
    <div className="card p-5">
      <p className="font-display text-sm font-semibold">Company-wise performance</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-paper-line dark:stroke-ink-line" />
            <XAxis
              dataKey="company"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-ink/40 dark:text-paper/40"
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-ink/40 dark:text-paper/40"
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
            <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={entry.company} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
