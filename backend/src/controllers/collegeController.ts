import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { College, User } from '../models';

export const createCollege = async (req: AuthRequest, res: Response) => {
  try {
    const { name, domain } = req.body;

    const existing = await College.findOne({ domain });
    if (existing) return res.status(409).json({ error: 'Domain already exists' });

    const college = await College.create({ name, domain });

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { collegeId: college._id });
    }

    res.json(college);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getColleges = async (req: AuthRequest, res: Response) => {
  try {
    const colleges = await College.find({ deleted: false });
    res.json(colleges);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyCollege = async (req: AuthRequest, res: Response) => {
  try {
    const college = await College.findById(req.user.collegeId);
    if (!college) return res.status(404).json({ error: 'College not found' });
    res.json(college);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};