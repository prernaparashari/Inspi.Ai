import mongoose from 'mongoose';
import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI — add it to your .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}