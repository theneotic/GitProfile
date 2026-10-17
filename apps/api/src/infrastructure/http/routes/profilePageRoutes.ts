import { Router } from 'express';
import { container } from '../../../container.js';
import { authGuard } from '../middleware/authGuard.js';
import { ipRateLimiter, userRateLimiter } from '../middleware/rateLimitMiddleware.js';

export const profilePageRoutes = Router();

profilePageRoutes.use(ipRateLimiter);

// Public route for viewing user profile portfolio (/u/[username])
profilePageRoutes.get('/by-username/:username', (req, res) =>
  container.profilePageController.getPublicProfilePage(req, res)
);

// Authenticated owner routes
profilePageRoutes.get('/', authGuard, userRateLimiter, (req, res) =>
  container.profilePageController.getMyProfilePage(req, res)
);

profilePageRoutes.put('/', authGuard, userRateLimiter, (req, res) =>
  container.profilePageController.updateMyProfilePage(req, res)
);
