import { Router } from 'express';
import { container } from '../../../container.js';
import { ipRateLimiter } from '../middleware/rateLimitMiddleware.js';

export const authRoutes = Router();

authRoutes.use(ipRateLimiter);

authRoutes.get('/github', (req, res) => container.authController.loginWithGithub(req, res));
authRoutes.get('/github/callback', (req, res) => container.authController.githubCallback(req, res));
authRoutes.post('/refresh', (req, res) => container.authController.refreshToken(req, res));
authRoutes.post('/logout', (req, res) => container.authController.logout(req, res));
