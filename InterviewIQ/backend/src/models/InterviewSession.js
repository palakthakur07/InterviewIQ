import mongoose from 'mongoose';

const COMPANIES = ['general', 'google', 'amazon', 'microsoft', 'atlassian'];

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  company: {
    type: String,
    enum: COMPANIES,
    default: 'general',
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress',
    index: true,
  },
  // Authoritative, ordered list of questions for this session. Follow-up
  // questions are spliced into this array right after the question that
  // triggered them, so order here is always the display/ask order.
  questionIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    default: [],
  },
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  // Draft text for the question currently in progress, used by Save & Exit
  // so a person can leave mid-answer and pick up where they left off.
  draftAnswerText: {
    type: String,
    default: '',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

interviewSessionSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    resume: this.resume,
    company: this.company,
    status: this.status,
    totalQuestions: this.questionIds.length,
    currentQuestionIndex: this.currentQuestionIndex,
    draftAnswerText: this.draftAnswerText,
    startedAt: this.startedAt,
    updatedAt: this.updatedAt,
    completedAt: this.completedAt,
  };
};

export { COMPANIES };
export default mongoose.model('InterviewSession', interviewSessionSchema);
