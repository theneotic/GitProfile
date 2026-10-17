import { Router } from 'express';
import cors from 'cors';
import { container } from '../../../container.js';
import { optionalAuthGuard } from '../middleware/optionalAuthGuard.js';
import { ipRateLimiter } from '../middleware/rateLimitMiddleware.js';

export const cardRoutes = Router();

// Cross-origin allowed unconditionally for SVG card embeds in READMEs
cardRoutes.use(cors({ origin: true }));
cardRoutes.use(ipRateLimiter);
cardRoutes.use(optionalAuthGuard);

// GET /cards/by-preset/:slug.svg
cardRoutes.get('/by-preset/:slug', (req, res) => container.cardController.renderByPreset(req, res));
cardRoutes.get('/by-preset/:slug.svg', (req, res) => container.cardController.renderByPreset(req, res));

// GET /cards/:type.svg
cardRoutes.get('/:type', (req, res) => container.cardController.renderCard(req, res));
cardRoutes.get('/:type.svg', (req, res) => container.cardController.renderCard(req, res));
