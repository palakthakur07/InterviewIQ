import { useEffect, useState } from 'react';
import { Users, MessagesSquare, FileText, TrendingUp, Building2, FileDown } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import ErrorState from '../components/ui/ErrorState';
import { CompanyDistributionChart, InterviewsOverTimeChart } from '../components/admin/AdminCharts';
import { getAdminDashboardRequest } from '../api/admin';

const COMPANY_LABELS = {
  general: 'General',
  google: 'Google',
  amazon: 'Amazon',
  microsoft: 'Microsoft',
  atlassian: 'Atlassian',
};

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getAdminDashboardRequest();
        if (cancelled) return;
        setStats(data.stats);
        setCharts(data.charts);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Could not load admin data.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadError) {
    return (
      <DashboardLayout title="Admin dashboard">
        <ErrorState title="Could not load admin dashboard" description={loadError} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin dashboard">
      <div className="space-y-8">
        <div>
          <span className="eyebrow">Platform overview</span>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Admin dashboard</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            icon={Users}
            label="Total users"
            value={stats?.totalUsers ?? '—'}
            accent="bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300"
            isLoading={isLoading}
          />
          <StatCard
            icon={MessagesSquare}
            label="Total interviews"
            value={stats?.totalInterviews ?? '—'}
            accent="bg-mint/10 text-mint"
            isLoading={isLoading}
          />
          <StatCard
            icon={FileText}
            label="Total resumes"
            value={stats?.totalResumes ?? '—'}
            accent="bg-cyan/10 text-cyan"
            isLoading={isLoading}
          />
          <StatCard
            icon={TrendingUp}
            label="Average interview score"
            value={stats?.averageScore !== null && stats?.averageScore !== undefined ? stats.averageScore.toFixed(1) : '—'}
            hint="out of 10"
            accent="bg-amber/10 text-amber"
            isLoading={isLoading}
          />
          <StatCard
            icon={Building2}
            label="Most selected company"
            value={stats?.mostSelectedCompany ? COMPANY_LABELS[stats.mostSelectedCompany] || stats.mostSelectedCompany : '—'}
            accent="bg-signal-50 text-signal-600 dark:bg-signal-500/10 dark:text-signal-300"
            isLoading={isLoading}
          />
          <StatCard
            icon={FileDown}
            label="Reports generated"
            value={stats?.totalReportsGenerated ?? '—'}
            accent="bg-coral/10 text-coral"
            isLoading={isLoading}
          />
        </div>

        {!isLoading && charts && (
          <div className="grid gap-6 lg:grid-cols-2">
            <CompanyDistributionChart data={charts.companyDistribution} />
            <InterviewsOverTimeChart data={charts.interviewsOverTime} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
