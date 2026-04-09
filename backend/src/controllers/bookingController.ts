import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';
import { Booking, Event } from '../models';

const schema = z.object({ eventId: z.string(), venueId: z.string(), startAt: z.string(), endAt: z.string() });

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const payload = schema.parse(req.body);
    const start = new Date(payload.startAt);
    const end = new Date(payload.endAt);

    // conflict detection
    const conflicts = await Booking.findOne({
      venueId: payload.venueId,
      $or: [{ startAt: { $lte: end }, endAt: { $gte: start } }],
    });
    if (conflicts) return res.status(409).json({ error: 'Booking conflict' });

    // verify event belongs to college
    const ev = await Event.findOne({ _id: payload.eventId, collegeId: req.user.collegeId });
    if (!ev) return res.status(403).json({ error: 'Event not found in your college' });

    const booking = await Booking.create({
      eventId: payload.eventId,
      venueId: payload.venueId,
      startAt: start,
      endAt: end,
      collegeId: req.user.collegeId,
    });
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};