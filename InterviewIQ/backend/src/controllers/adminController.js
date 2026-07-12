import User from '../models/User.js';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';

// GET /api/admin/dashboard  (protected, admin only)
export async function getAdminDashboard(req, res, next) {
  try {
    const [totalUsers, totalResumes, totalInterviews, interviews] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Interview.countDocuments(),
      Interview.find({}, 'company overallScore pdfGeneratedAt completedAt'),
    ]);

    const scored = interviews.filter((i) => i.overallScore !== null);
    const averageScore = scored.length
      ? Math.round((scored.reduce((sum, i) => sum + i.overallScore, 0) / scored.length) * 10) / 10
      : null;

    const totalReportsGenerated = interviews.filter((i) => i.pdfGeneratedAt !== null).length;

    // Company distribution — used for mostSelectedCompany and the bar chart.
    const companyCounts = {};
    interviews.forEach((i) => {
      companyCounts[i.company] = (companyCounts[i.company] || 0) + 1;
    });
    const companyDistribution = Object.entries(companyCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count);
    const mostSelectedCompany = companyDistribution[0]?.company || null;

    // Interviews over the last 14 days — used for the line chart.
    const days = [];
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    const interviewsOverTime = days.map((day) => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      const count = interviews.filter(
        (i) => i.completedAt >= day && i.completedAt < nextDay,
      ).length;
      return { date: day.toISOString().slice(0, 10), count };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalInterviews,
        totalResumes,
        averageScore,
        mostSelectedCompany,
        totalReportsGenerated,
      },
      charts: {
        companyDistribution,
        interviewsOverTime,
      },
    });
  } catch (err) {
    next(err);
  }
}
