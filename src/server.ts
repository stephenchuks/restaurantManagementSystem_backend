// src/server.ts
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
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

  // Health-check
  app.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok' });
  });

  // API routes
  app.use('/api', routes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // Global error handler
  app.use(
    (
      err: any,
      _req: Request,
      res: Response,
      _next: NextFunction
    ): void => {
      console.error(err);
      const status = err.status && Number.isInteger(err.status) ? err.status : 500;
      res.status(status).json({
        error: err.message || 'Internal Server Error',
        details: err.errors || undefined,
      });
    }
  );

  app.listen(config.PORT, () => {
    console.log(`🚀 Server running on port ${config.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
