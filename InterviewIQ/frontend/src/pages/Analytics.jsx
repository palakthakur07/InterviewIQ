import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import EmptyState from '../components/dashboard/EmptyState';
import AnalyticsLoadingSkeleton from '../components/analytics/AnalyticsLoadingSkeleton';
import ScoreTrendChart from '../components/analytics/ScoreTrendChart';
import CompanyPerformanceChart from '../components/analytics/CompanyPerformanceChart';
import SkillRadarChart from '../components/analytics/SkillRadarChart';
import AccuracyDonutChart from '../components/analytics/AccuracyDonutChart';
import { getHistoryRequest } from '../api/results';
import { getCompanyLabel, formatDate } from '../utils/scoreHelpers';

const SKILL_KEYS = [
  { key: 'technical', label: 'Technical' },
  { key: 'communication', label: 'Communication' },
  { key: 'problemSolving', label: 'Problem Solving' },
  { key: 'behavioral', label: 'Behavioral' },
  { key: 'confidence', label: 'Confidence' },
];

function average(numbers) {
  if (numbers.length === 0) return null;
  return Math.round((numbers.reduce((sum, n) => sum + n, 0) / numbers.length) * 10) / 10;
}

export default function Analytics() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getHistoryRequest();
        if (!cancelled) setInterviews(data.interviews);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load your analytics.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const { trendData, companyData, skillData, answered, skipped, accuracyPercent } = useMemo(() => {
    const scored = interviews.filter((i) => i.overallScore !== null);

    const sortedByDate = [...scored].sort(
      (a, b) => new Date(a.completedAt) - new Date(b.completedAt),
    );
    const trend = sortedByDate.map((i) => ({
      label: formatDate(i.completedAt),
      score: i.overallScore,
    }));

    const byCompany = new Map();
    scored.forEach((i) => {
      const label = getCompanyLabel(i.company);
      if (!byCompany.has(label)) byCompany.set(label, []);
      byCompany.get(label).push(i.overallScore);
    });
    const company = Array.from(byCompany.entries()).map(([label, scores]) => ({
      company: label,
      avgScore: average(scores),
      count: scores.length,
    }));

    const skill = SKILL_KEYS.map(({ key, label }) => {
      const values = interviews
        .map((i) => i.skillScores?.[key])
        .filter((v) => v !== null && v !== undefined);
      return { skill: label, score: average(values) || 0 };
    });

    const totalAnswered = interviews.reduce((sum, i) => sum + (i.answeredCount || 0), 0);
    const totalSkipped = interviews.reduce((sum, i) => sum + (i.skippedCount || 0), 0);
    const totalQuestions = totalAnswered + totalSkipped;
    const percent = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

    return {
      trendData: trend,
      companyData: company,
      skillData: skill,
      answered: totalAnswered,
      skipped: totalSkipped,
      accuracyPercent: percent,
    };
  }, [interviews]);

  return (
    <DashboardLayout title="Analytics">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <span className="eyebrow">Performance over time</span>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Analytics</h2>
        </div>

        {isLoading && <AnalyticsLoadingSkeleton />}

        {!isLoading && error && <p className="text-sm text-coral">{error}</p>}

        {!isLoading && !error && interviews.length === 0 && (
          <div className="card p-6">
            <EmptyState
              icon={BarChart3}
              title="Nothing to analyze yet"
              description="Complete a few mock interviews and your score trends, company breakdown, and skill performance will show up here."
              action={
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary">
                  Go to dashboard
                  <ArrowRight size={15} />
                </button>
              }
            />
          </div>
        )}

        {!isLoading && !error && interviews.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <ScoreTrendChart data={trendData} />
            <CompanyPerformanceChart data={companyData} />
            <SkillRadarChart data={skillData} />
            <AccuracyDonutChart answered={answered} skipped={skipped} percentage={accuracyPercent} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
