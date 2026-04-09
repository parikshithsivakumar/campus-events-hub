import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';
import { Event, Approval } from '../models';

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  startAt: z.string(),
  endAt: z.string(),
  venueId: z.string().min(1, 'Venue is required'),
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
    // Check authorization - only approvers can approve events
    const allowedRoles = ['FACULTY_ADVISOR', 'DEPARTMENT_APPROVER', 'COLLEGE_ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Only approvers can approve events' });
    }

    const { id } = req.params;
    const { decision, comment, stage } = req.body;

    // Validate event ID
    if (!id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Verify event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

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

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Only organizer can update their own event
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only event organizer can update this event' });
    }

    const payload = createEventSchema.partial().parse(req.body);
    const updatedEvent = await Event.findByIdAndUpdate(id, payload, { new: true }).populate('organizerId');
    res.json(updatedEvent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Only organizer can delete their own event
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only event organizer can delete this event' });
    }

    await Event.findByIdAndUpdate(id, { deleted: true });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};