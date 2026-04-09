import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/event_management';

export async function connectDB() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      family: 4,
      retryWrites: true,
      authSource: 'admin',
    });
    console.log('✓ MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err instanceof Error ? err.message : err);
    console.error('\n📌 Troubleshooting:');
    console.error('1. Check MongoDB Atlas 0.0.0.0 IP whitelist is enabled');
    console.error('2. Verify credentials in .env file are correct');
    console.error('3. If still failing, check your network firewall/DNS settings');
    return false;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
