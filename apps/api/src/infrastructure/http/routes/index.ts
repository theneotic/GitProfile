import { Router } from 'express';
import { userRoutes } from './userRoutes.js';
import { presetRoutes } from './presetRoutes.js';
import { profilePageRoutes } from './profilePageRoutes.js';
import { container } from '../../../container.js';
import { ipRateLimiter } from '../middleware/rateLimitMiddleware.js';

export const apiV1Routes = Router();

apiV1Routes.use('/users', userRoutes);
apiV1Routes.use('/presets', presetRoutes);
apiV1Routes.use('/profile-page', profilePageRoutes);

export const statisticsRoutes = Router();
statisticsRoutes.use(ipRateLimiter);
statisticsRoutes.get('/', (req, res) => container.statsController.getStats(req, res));
