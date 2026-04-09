import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Approval, Event } from '../models';

export const getApprovals = async (req: AuthRequest, res: Response) => {
  try {
    const approvals = await Approval.find({}).populate('eventId approverId');
    res.json(approvals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPendingApprovals = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ collegeId: req.user.collegeId, status: { $in: ['PENDING', 'IN_REVIEW'] } });
    const eventIds = events.map(e => e._id);
    const approvals = await Approval.find({ eventId: { $in: eventIds }, decision: 'PENDING' }).populate('eventId approverId');
    res.json(approvals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
