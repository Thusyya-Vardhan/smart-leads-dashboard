import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Leads API running' });
});

import authRoutes from './routes/authRoutes';

app.use('/api/auth', authRoutes);

import leadRoutes from './routes/leadRoutes';
app.use('/api/leads', leadRoutes);

// DB Connection + Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB connection failed:', err));

export default app;