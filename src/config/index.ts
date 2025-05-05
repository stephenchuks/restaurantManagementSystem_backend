// src/config/index.ts
import dotenv from 'dotenv';
import { cleanEnv, str, port, url, num } from 'envalid';

dotenv.config();

export const config = cleanEnv(process.env, {
  PORT: port({ default: 4000 }),
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),

  MONGODB_URI: url({ desc: 'MongoDB connection URI, without db name' }),
  MONGODB_DB: str({ desc: 'MongoDB database name' }),

  REDIS_URL: url({ desc: 'Redis connection URL' }),

  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '1h' }),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),

  DEFAULT_PAGE: num({ default: 1 }),
  DEFAULT_LIMIT: num({ default: 20 }),
  MAX_LIMIT: num({ default: 100 }),
});
