import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';
import { Event, Approval } from '../models';

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  startAt: z.string(),
  endAt: z.string(),
  venueId: z.string().optional(),
  department: z.string().optional(),
  budget: z.number().optional(),
});

export const listEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ collegeId: req.user.collegeId, deleted: false }).populate('organizerId venueId');
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const payload = createEventSchema.parse(req.body);
    const event = await Event.create({
      ...payload,
      startAt: new Date(payload.startAt),
      endAt: new Date(payload.endAt),
      organizerId: req.user._id,
      collegeId: req.user.collegeId,
    });
    res.json(event);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const approveEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { decision, comment, stage } = req.body;

    const approval = await Approval.create({
      eventId: id,
      approverId: req.user._id,
      decision: decision || 'PENDING',
      comment,
      stage: stage || 'GENERAL',
    });

    if (decision === 'APPROVED') {
      const allApprovals = await Approval.find({ eventId: id });
      const anyRejected = allApprovals.some(a => a.decision === 'REJECTED');
      if (!anyRejected) {
        await Event.findByIdAndUpdate(id, { status: 'APPROVED' });
      }
    } else if (decision === 'REJECTED') {
      await Event.findByIdAndUpdate(id, { status: 'REJECTED' });
    }

    res.json(approval);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};