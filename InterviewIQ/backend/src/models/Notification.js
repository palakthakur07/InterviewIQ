import mongoose from 'mongoose';

const NOTIFICATION_TYPES = [
  'resume_uploaded',
  'ai_analysis_completed',
  'interview_completed',
  'pdf_generated',
];

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: NOTIFICATION_TYPES,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  // Loosely-typed pointer to whatever triggered this notification
  // (a Resume id, an Interview id, etc). Not populated/refPath'd since
  // the frontend only needs it to build a link, not to hydrate a document.
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

notificationSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    type: this.type,
    title: this.title,
    message: this.message,
    relatedId: this.relatedId,
    isRead: this.isRead,
    createdAt: this.createdAt,
  };
};

export { NOTIFICATION_TYPES };
export default mongoose.model('Notification', notificationSchema);
