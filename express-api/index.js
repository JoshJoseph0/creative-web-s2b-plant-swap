
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import plantRoutes from './routes/plants.js';

const app = express();

app.use(express.json());
app.use('/plants', plantRoutes);

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('✅ MongoDB connected!');
  console.log('Database:', mongoose.connection.name);

  app.listen(3000, () => {
    console.log('Express running on http://localhost:3000');
  });
} catch (err) {
  console.error('Database connection failed:', err.message);
  process.exit(1);
}
