import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';
import { Venue } from '../models';

const schema = z.object({ name: z.string().min(1), capacity: z.number().min(1) });

export const listVenues = async (req: AuthRequest, res: Response) => {
  try {
    const venues = await Venue.find({ collegeId: req.user.collegeId, deleted: false });
    res.json(venues);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createVenue = async (req: AuthRequest, res: Response) => {
  try {
    const payload = schema.parse(req.body);
    const v = await Venue.create({
      name: payload.name,
      capacity: payload.capacity,
      collegeId: req.user.collegeId,
    });
    res.json(v);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};