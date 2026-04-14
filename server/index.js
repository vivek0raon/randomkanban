import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import boardRoutes from './routes/boards.js';
import authRoutes from './routes/auth.js';
import { initTelegramBot } from './services/telegramBot.js';
import { initCronJobs } from './services/cronJobs.js';
import path from 'path';

const __dirname = path.resolve();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Production routing deferred to end

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    initTelegramBot();
    initCronJobs();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

if (process.env.NODE_ENV === "production") {
  // MUST be positioned after all API routes
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
