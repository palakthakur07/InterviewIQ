import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 10 },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestedAnswer: { type: String, default: '' },
    confidence: { type: Number, min: 0, max: 100 },
  },
  { _id: false },
);

const answerSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true,
    index: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  skipped: {
    type: Boolean,
    default: false,
  },
  // 'pending' briefly while the Gemini call is in flight (not really
  // observable since the request is awaited), 'evaluated' once scored,
  // 'failed' if Gemini errored — the answer itself is still saved so
  // nothing is lost and the person can retry evaluation.
  evaluationStatus: {
    type: String,
    enum: ['skipped', 'pending', 'evaluated', 'failed'],
    default: 'pending',
  },
  evaluation: {
    type: evaluationSchema,
    default: null,
  },
  evaluationError: {
    type: String,
    default: null,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

answerSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    question: this.question,
    text: this.text,
    skipped: this.skipped,
    evaluationStatus: this.evaluationStatus,
    evaluation: this.evaluation,
    evaluationError: this.evaluationError,
    submittedAt: this.submittedAt,
  };
};

export default mongoose.model('Answer', answerSchema);
