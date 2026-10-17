import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { cardRoutes } from './infrastructure/http/routes/cardRoutes.js';
import { authRoutes } from './infrastructure/http/routes/authRoutes.js';
import { apiV1Routes, statisticsRoutes } from './infrastructure/http/routes/index.js';

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());

// CORS for web dashboard requests (credentialed)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (origin === env.WEB_BASE_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
  })
);

// Health check endpoint (Section 19)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Card endpoints (public, outside /api/v1)
app.use('/cards', cardRoutes);

// Auth endpoints
app.use('/auth', authRoutes);

// JSON API endpoints
app.use('/api/v1', apiV1Routes);
app.use('/api/statistics', statisticsRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`[Instrument Stats API] listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`[Instrument Stats API] Card endpoints ready at http://localhost:${env.PORT}/cards/:type.svg`);
  });
}
