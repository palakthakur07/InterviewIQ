import Notification from '../models/Notification.js';

/**
 * Creates a notification for a user. Callers treat this as fire-and-forget —
 * a failure here should never break the primary request (resume upload,
 * interview finish, etc.), so errors are swallowed and logged.
 */
export async function createNotification({ userId, type, title, message, relatedId = null }) {
  try {
    return await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedId,
    });
  } catch (err) {
    console.error('[notificationService] Failed to create notification:', err.message);
    return null;
  }
}

export const NotificationEvents = {
  resumeUploaded(resume) {
    return {
      type: 'resume_uploaded',
      title: 'Resume uploaded',
      message: `"${resume.originalName}" was uploaded successfully.`,
      relatedId: resume._id,
    };
  },
  aiAnalysisCompleted(resume) {
    const skillCount = resume.skills?.length || 0;
    return {
      type: 'ai_analysis_completed',
      title: 'AI analysis completed',
      message: skillCount
        ? `We detected ${skillCount} skill${skillCount === 1 ? '' : 's'} from "${resume.originalName}".`
        : `Analysis of "${resume.originalName}" is complete.`,
      relatedId: resume._id,
    };
  },
  interviewCompleted(interview) {
    return {
      type: 'interview_completed',
      title: 'Interview completed',
      message:
        interview.overallScore !== null
          ? `Your interview is scored: ${interview.overallScore.toFixed(1)} / 10.`
          : 'Your interview has been completed.',
      relatedId: interview._id,
    };
  },
  pdfGenerated(interview) {
    return {
      type: 'pdf_generated',
      title: 'Report ready',
      message: 'Your interview report PDF has been generated.',
      relatedId: interview._id,
    };
  },
};
