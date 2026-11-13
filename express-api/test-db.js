
import 'dotenv/config';
import mongoose from 'mongoose';

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('✅ MongoDB connected successfully!');
  console.log('Database:', mongoose.connection.name);

  await mongoose.disconnect();
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  process.exitCode = 1;
}
