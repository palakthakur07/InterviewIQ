import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['technical', 'project', 'behavioral', 'follow-up'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // What the question is anchored to — a skill name, a project title, or
  // 'general' for broad behavioral questions. Shown as a small tag in the UI.
  topic: {
    type: String,
    default: 'general',
  },
  // Set only for follow-up questions, pointing back to the question whose
  // answer prompted this one.
  followUpTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

questionSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    type: this.type,
    text: this.text,
    topic: this.topic,
    followUpTo: this.followUpTo,
  };
};

export default mongoose.model('Question', questionSchema);
