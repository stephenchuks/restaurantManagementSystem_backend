import 'reflect-metadata';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';


async function bootstrap(): Promise<void> {
  await connectDB();

  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true }));
  app.use(express.json());

  // Health-check handler returns void
  app.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok' });
  });

  // Mount API router under /api
  app.use('/api', routes);

  app.listen(config.PORT, () => {
    console.log(`🚀 Server running on port ${config.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
