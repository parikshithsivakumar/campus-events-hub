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
    let query: any = { collegeId: req.user.collegeId, status: { $in: ['PENDING', 'IN_REVIEW'] } };
    
    // DEPARTMENT_APPROVER only sees events from their department
    if (req.user.role === 'DEPARTMENT_APPROVER' && req.user.department) {
      query.department = req.user.department;
    }

    const events = await Event.find(query).populate('organizerId');
    const eventIds = events.map(e => e._id);
    const approvals = await Approval.find({ eventId: { $in: eventIds }, decision: 'PENDING' })
      .populate('eventId', 'title description department budget organizerId venueId startAt endAt')
      .populate('approverId', 'name email role department');
    res.json(approvals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
