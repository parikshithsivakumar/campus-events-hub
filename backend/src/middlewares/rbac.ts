import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const permit = (requiredRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const scopeByCollege = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  req.user.collegeId = req.user.collegeId || req.query.collegeId || req.body.collegeId;
  next();
};