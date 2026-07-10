import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    technologies: [String],
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema(
  {
    degree: String,
    institution: String,
    year: String,
  },
  { _id: false },
);

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  storedFileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true,
  },
  fileSizeBytes: {
    type: Number,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  technologies: {
    type: [String],
    default: [],
  },
  softSkills: {
    type: [String],
    default: [],
  },
  projects: {
    type: [projectSchema],
    default: [],
  },
  education: {
    type: [educationSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

resumeSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    originalName: this.originalName,
    fileType: this.fileType,
    fileSizeBytes: this.fileSizeBytes,
    skills: this.skills,
    technologies: this.technologies,
    softSkills: this.softSkills,
    projects: this.projects,
    education: this.education,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('Resume', resumeSchema);
