import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';
import { Venue } from '../models';

const schema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  location: z.string().min(1, 'Location is required'),
  building: z.string().optional(),
  floor: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

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
    // Only COLLEGE_ADMIN can create venues
    if (req.user.role !== 'COLLEGE_ADMIN') {
      return res.status(403).json({ error: 'Only admins can create venues' });
    }
    
    const payload = schema.parse(req.body);
    const v = await Venue.create({
      name: payload.name,
      capacity: payload.capacity,
      location: payload.location,
      building: payload.building || '',
      floor: payload.floor || '',
      facilities: payload.facilities || [],
      description: payload.description || '',
      amenities: payload.amenities || [],
      collegeId: req.user.collegeId,
    });
    res.json(v);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateVenue = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'COLLEGE_ADMIN') {
      return res.status(403).json({ error: 'Only admins can update venues' });
    }
    
    const { id } = req.params;
    const payload = schema.partial().parse(req.body);
    const v = await Venue.findByIdAndUpdate(id, payload, { new: true });
    res.json(v);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteVenue = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'COLLEGE_ADMIN') {
      return res.status(403).json({ error: 'Only admins can delete venues' });
    }
    
    const { id } = req.params;
    await Venue.findByIdAndUpdate(id, { deleted: true });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};