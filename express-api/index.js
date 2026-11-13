
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import plantRoutes from './routes/plants.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/plants', plantRoutes);

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('MongoDB connection failed:', err);
  process.exit(1);
}
