import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [80, 'Name is too long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // never return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  college: {
    type: String,
    default: '',
    trim: true,
    maxlength: [120, 'College name is too long'],
  },
  branch: {
    type: String,
    default: '',
    trim: true,
    maxlength: [80, 'Branch is too long'],
  },
  graduationYear: {
    type: Number,
    default: null,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    defaultCompany: {
      type: String,
      enum: ['general', 'google', 'amazon', 'microsoft', 'atlassian'],
      default: 'general',
    },
    interviewDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    defaultQuestionCount: {
      type: Number,
      min: 3,
      max: 15,
      default: 6,
    },
  },
  // Bumped on password change / "logout from all devices" — every JWT
  // carries the tokenVersion it was issued with, so bumping this instantly
  // invalidates every previously-issued token (see authMiddleware.js).
  tokenVersion: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving, only if it was modified.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare a plaintext password against the stored hash.
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Shape returned to the client — never leaks the password hash.
userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    college: this.college,
    branch: this.branch,
    graduationYear: this.graduationYear,
    avatarUrl: this.avatarUrl,
    preferences: this.preferences,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
