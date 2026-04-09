import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';
import { User, College } from '../models';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY_ADVISOR', 'STUDENT_ORGANIZER', 'VOLUNTEER', 'DEPARTMENT_APPROVER']).optional(),
  collegeName: z.string().optional(),
  collegeDomain: z.string().optional(),
}).refine((data) => {
  // COLLEGE_ADMIN must provide collegeDomain
  if (data.role === 'COLLEGE_ADMIN' && !data.collegeDomain) {
    return false;
  }
  return true;
}, {
  message: 'College Admin must provide college domain',
  path: ['collegeDomain'],
});

export const register = async (req: Request, res: Response) => {
  try {
    const payload = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: payload.email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    let college = null;
    
    // If collegeDomain is provided, find or create the college
    if (payload.collegeDomain) {
      college = await College.findOne({ domain: payload.collegeDomain });
      if (!college) {
        const collegeName = payload.collegeName || 
          payload.collegeDomain.split('.')[0].toUpperCase() + ' College';
        college = await College.create({ name: collegeName, domain: payload.collegeDomain });
      }
    } else {
      // For non-admin users without a domain, create a default college
      college = await College.findOne({ domain: 'default.college' });
      if (!college) {
        college = await College.create({ name: 'Default College', domain: 'default.college' });
      }
    }

    const hash = await bcrypt.hash(payload.password, 10);
    const user = await User.create({
      email: payload.email,
      name: payload.name,
      password: hash,
      role: payload.role || 'STUDENT_ORGANIZER',
      collegeId: college._id,
    });

    const access = jwt.sign({ sub: user._id, role: user.role, collegeId: user.collegeId }, process.env.JWT_ACCESS_SECRET || 'dev-access-secret', { expiresIn: '24h' });
    const refresh = jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret', { expiresIn: '30d' });

    res.json({ access, refresh, user: { id: user._id, email: user.email, name: user.name, role: user.role, collegeId: user.collegeId } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export const login = async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email });
    if (!user || user.deleted) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(payload.password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const access = jwt.sign({ sub: user._id, role: user.role, collegeId: user.collegeId }, process.env.JWT_ACCESS_SECRET || 'dev-access-secret', { expiresIn: '24h' });
    const refresh = jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret', { expiresIn: '30d' });

    res.json({ access, refresh, user: { id: user._id, email: user.email, name: user.name, role: user.role, collegeId: user.collegeId } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  res.json(req.user);
};