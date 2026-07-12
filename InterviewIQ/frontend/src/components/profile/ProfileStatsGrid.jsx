import { MessagesSquare, Trophy, TrendingUp, Building2 } from 'lucide-react';
import StatCard from '../dashboard/StatCard';

export default function ProfileStatsGrid({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        icon={MessagesSquare}
        label="Total interviews"
        value={stats.totalInterviews}
        hint="All time"
        accent="bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300"
        isLoading={isLoading}
      />
      <StatCard
        icon={TrendingUp}
        label="Average score"
        value={stats.averageScore !== null ? stats.averageScore.toFixed(1) : '—'}
        hint="out of 10"
        accent="bg-mint/10 text-mint"
        isLoading={isLoading}
      />
      <StatCard
        icon={Trophy}
        label="Best score"
        value={stats.bestScore !== null ? stats.bestScore.toFixed(1) : '—'}
        hint="out of 10"
        accent="bg-amber/10 text-amber"
        isLoading={isLoading}
      />
      <StatCard
        icon={Building2}
        label="Companies practiced"
        value={stats.companiesPracticed.length}
        hint={stats.companiesPracticed.length ? stats.companiesPracticed.join(', ') : 'None yet'}
        accent="bg-cyan/10 text-cyan"
        isLoading={isLoading}
      />
    </div>
  );
}
