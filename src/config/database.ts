// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './index';

export async function connectDB() {
  await mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGODB_DB,
    // useUnifiedTopology, useNewUrlParser are defaults in mongoose v6+
  });
  console.log('✅ MongoDB connected');
}
