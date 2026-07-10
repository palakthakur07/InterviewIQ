import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === 'your_mongodb_atlas_connection_string') {
    console.warn(
      '[db] MONGO_URI is not set. Add a real MongoDB Atlas connection string to backend/.env — auth routes will fail until then.',
    );
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[db] MongoDB connection failed: ${err.message}`);
    // Fail loudly in production, keep the server alive in dev so other routes are still inspectable.
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
}
