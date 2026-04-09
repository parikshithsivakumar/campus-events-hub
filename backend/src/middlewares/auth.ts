import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const secret = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
    const payload: any = jwt.verify(token, secret);

    const user = await User.findById(payload.sub).select('-password');
    if (!user || user.deleted) return res.status(401).json({ error: 'Invalid token or user' });

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid token', details: err.message });
  }
};
