import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';

function buildWeekData(interviews) {
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  return days.map((day) => {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const count = interviews.filter((i) => {
      const completed = new Date(i.completedAt);
      return completed >= day && completed < nextDay;
    }).length;
    return {
      label: day.toLocaleDateString(undefined, { weekday: 'short' }),
      count,
    };
  });
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-paper-line bg-paper-surface px-3 py-2 text-xs shadow-lg dark:border-ink-line dark:bg-ink-surface">
      <p className="font-medium">{label}</p>
      <p className="text-ink/60 dark:text-paper/60">{payload[0].value} interview(s)</p>
    </div>
  );
}

export default function WeeklyProgress({ interviews }) {
  const data = buildWeekData(interviews);
  const totalThisWeek = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Weekly progress</h3>
        <span className="font-mono text-xs text-ink/40 dark:text-paper/40">{totalThisWeek} this week</span>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-paper-line dark:text-ink-line" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="currentColor" className="text-ink/50 dark:text-paper/50" />
            <Tooltip content={<Tip />} cursor={{ fill: 'rgba(110,86,207,0.08)' }} />
            <Bar dataKey="count" fill="#34D399" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
