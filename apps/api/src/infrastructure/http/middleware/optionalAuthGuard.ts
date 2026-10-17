import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authGuard.js';
import { defaultSessionService } from '../../../application/services/SessionService.js';

export function optionalAuthGuard(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = defaultSessionService.verifyAccessToken(token);
    if (session) {
      req.user = session;
    }
  }
  next();
}
