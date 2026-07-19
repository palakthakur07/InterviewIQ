import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import requestTimeout from './middleware/timeoutMiddleware.js';

const app = express();

// Required behind a reverse proxy (Render) so req.secure / req.ip resolve correctly.
app.set('trust proxy', 1);

// CLIENT_URL may be a single origin or a comma-separated list (e.g. a Vercel
// production domain plus preview deployments) — support both.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl, health checks) which send no origin.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(requestTimeout());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'InterviewIQ API',
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
// resultRoutes defines its own /results, /history, and /report sub-paths,
// so it's mounted at the broader /api prefix rather than a single one.
app.use('/api', resultRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
