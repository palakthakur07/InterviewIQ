import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const SIGNAL = '#6E56CF';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-paper-line bg-paper-surface px-3 py-2 text-xs shadow-lg dark:border-ink-line dark:bg-ink-surface">
      <p className="font-medium text-ink dark:text-paper">{payload[0].payload.skill}</p>
      <p className="mt-0.5 text-ink/60 dark:text-paper/60">{payload[0].value.toFixed(1)}/10</p>
    </div>
  );
}

export default function SkillRadarChart({ data }) {
  return (
    <div className="card p-5">
      <p className="font-display text-sm font-semibold">Skill-wise performance</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid className="stroke-paper-line dark:stroke-ink-line" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-ink/50 dark:text-paper/50"
            />
            <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} tickCount={6} />
            <Tooltip content={<ChartTooltip />} />
            <Radar
              dataKey="score"
              stroke={SIGNAL}
              fill={SIGNAL}
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
