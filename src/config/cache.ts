// src/config/cache.ts
import Redis from 'ioredis';
import { config } from './index.js';

export const redis = new Redis(config.REDIS_URL);

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('Redis error', err));
