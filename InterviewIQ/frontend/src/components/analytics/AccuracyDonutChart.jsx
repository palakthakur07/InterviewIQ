import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = { Answered: '#34D399', Skipped: '#F5B94D' };

export default function AccuracyDonutChart({ answered, skipped, percentage }) {
  const data = [
    { name: 'Answered', value: answered },
    { name: 'Skipped', value: skipped },
  ].filter((d) => d.value > 0);

  return (
    <div className="card p-5">
      <p className="font-display text-sm font-semibold">Answer accuracy</p>
      <div className="relative mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={24}
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-6">
          <span className="font-display text-2xl font-bold text-ink dark:text-paper">
            {percentage}%
          </span>
          <span className="text-[11px] text-ink/45 dark:text-paper/45">answered</span>
        </div>
      </div>
    </div>
  );
}
