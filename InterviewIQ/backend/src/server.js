import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Last-resort safety nets — log and keep the process alive rather than
// letting an unhandled rejection silently kill the server in production.
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] InterviewIQ API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
});
