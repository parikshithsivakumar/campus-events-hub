import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { User } from '../models';

export const listVolunteers = async (req: AuthRequest, res: Response) => {
  try {
    // Get all volunteers from the same college as the user
    const volunteers = await User.find({
      role: 'VOLUNTEER',
      collegeId: req.user.collegeId,
      deleted: false,
    }).select('_id name email');

    // Normalize _id to id for frontend consistency
    const normalizedVolunteers = volunteers.map(v => ({
      id: v._id?.toString(),
      name: v.name,
      email: v.email,
    }));

    res.json(normalizedVolunteers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
