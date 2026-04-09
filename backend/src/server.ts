import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './db/mongodb';

dotenv.config();

const port = process.env.PORT || 4000;

const main = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to MongoDB');
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main().catch(err => {
  console.error('Server startup error:', err);
  process.exit(1);
});