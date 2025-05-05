// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './index.js';

export async function connectDB(): Promise<void> {
  // config.MONGODB_URI already has the DB name & authSource
  await mongoose.connect(config.MONGODB_URI);
  console.log(`✅ MongoDB connected`);
}
