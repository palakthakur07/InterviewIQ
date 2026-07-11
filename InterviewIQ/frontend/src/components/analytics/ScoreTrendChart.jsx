import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SIGNAL = '#6E56CF';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-paper-line bg-paper-surface px-3 py-2 text-xs shadow-lg dark:border-ink-line dark:bg-ink-surface">
      <p className="font-medium text-ink dark:text-paper">{label}</p>
      <p className="mt-0.5 text-ink/60 dark:text-paper/60">Score: {payload[0].value.toFixed(1)}/10</p>
    </div>
  );
}

export default function ScoreTrendChart({ data }) {
  return (
    <div className="card p-5">
      <p className="font-display text-sm font-semibold">Overall score trend</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-paper-line dark:stroke-ink-line" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-ink/40 dark:text-paper/40"
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-ink/40 dark:text-paper/40"
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke={SIGNAL}
              strokeWidth={2.5}
              dot={{ r: 3, fill: SIGNAL }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
