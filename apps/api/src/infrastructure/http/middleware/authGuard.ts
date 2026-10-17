import { Request, Response, NextFunction } from 'express';
import { defaultSessionService, UserSessionPayload } from '../../../application/services/SessionService.js';

export interface AuthenticatedRequest extends Request {
  user?: UserSessionPayload;
}

export function authGuard(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.substring(7);
  const session = defaultSessionService.verifyAccessToken(token);

  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired access token' });
    return;
  }

  req.user = session;
  next();
}
