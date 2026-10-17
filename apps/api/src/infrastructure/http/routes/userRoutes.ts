import { Router } from 'express';
import { container } from '../../../container.js';
import { authGuard } from '../middleware/authGuard.js';
import { ipRateLimiter, userRateLimiter } from '../middleware/rateLimitMiddleware.js';

export const userRoutes = Router();

userRoutes.use(ipRateLimiter);
userRoutes.use(authGuard);
userRoutes.use(userRateLimiter);

userRoutes.get('/me', (req, res) => container.userController.getMe(req, res));
userRoutes.patch('/me/settings', (req, res) => container.userController.updateSettings(req, res));
