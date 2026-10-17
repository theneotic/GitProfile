import { Router } from 'express';
import { container } from '../../../container.js';
import { authGuard } from '../middleware/authGuard.js';
import { ipRateLimiter, userRateLimiter } from '../middleware/rateLimitMiddleware.js';

export const presetRoutes = Router();

presetRoutes.use(ipRateLimiter);
presetRoutes.use(authGuard);
presetRoutes.use(userRateLimiter);

presetRoutes.get('/', (req, res) => container.presetController.listPresets(req, res));
presetRoutes.post('/', (req, res) => container.presetController.createPreset(req, res));
presetRoutes.get('/:id', (req, res) => container.presetController.getPreset(req, res));
presetRoutes.put('/:id', (req, res) => container.presetController.updatePreset(req, res));
presetRoutes.delete('/:id', (req, res) => container.presetController.deletePreset(req, res));
