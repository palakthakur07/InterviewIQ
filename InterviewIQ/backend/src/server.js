import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] InterviewIQ API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
});
