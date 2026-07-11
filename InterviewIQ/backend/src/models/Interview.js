import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  // Kept for audit / drill-down into the full question-by-question record.
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true,
  },
  company: {
    type: String,
    default: 'general',
  },
  totalQuestions: {
    type: Number,
    default: 0,
  },
  answeredCount: {
    type: Number,
    default: 0,
  },
  skippedCount: {
    type: Number,
    default: 0,
  },
  // Average of all evaluated (non-skipped, successfully-scored) answers.
  overallScore: {
    type: Number,
    default: null,
  },
  strengths: {
    type: [String],
    default: [],
  },
  weaknesses: {
    type: [String],
    default: [],
  },
  suggestions: {
    type: [String],
    default: [],
  },
  // Average category scores across all evaluated answers — powers the
  // 5 skill cards on the Results page.
  skillScores: {
    technical: { type: Number, default: null },
    communication: { type: Number, default: null },
    problemSolving: { type: Number, default: null },
    behavioral: { type: Number, default: null },
    confidence: { type: Number, default: null },
  },
  recommendation: {
    verdict: {
      type: String,
      enum: ['Strong Hire', 'Hire', 'Borderline', 'No Hire', null],
      default: null,
    },
    explanation: { type: String, default: '' },
  },
  // Timestamp of the last time this report's PDF was generated/downloaded.
  pdfGeneratedAt: {
    type: Date,
    default: null,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  durationSeconds: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

interviewSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    session: this.session,
    company: this.company,
    totalQuestions: this.totalQuestions,
    answeredCount: this.answeredCount,
    skippedCount: this.skippedCount,
    overallScore: this.overallScore,
    strengths: this.strengths,
    weaknesses: this.weaknesses,
    suggestions: this.suggestions,
    skillScores: this.skillScores,
    recommendation: this.recommendation,
    pdfGeneratedAt: this.pdfGeneratedAt,
    startedAt: this.startedAt,
    completedAt: this.completedAt,
    durationSeconds: this.durationSeconds,
  };
};

export default mongoose.model('Interview', interviewSchema);
