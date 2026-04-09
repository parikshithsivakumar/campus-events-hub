import { Router, Request, Response } from 'express';
import { listVenues, createVenue, updateVenue, deleteVenue } from '../controllers/venueController';
import { authenticate } from '../middlewares/auth';
import { Venue } from '../models';

const router = Router();

// Debug endpoint - GET ALL venues (unauthenticated, for debugging only)
router.get('/debug/all', async (req: Request, res: Response) => {
  try {
    const venues = await Venue.find({}).select('_id name collegeId location capacity deleted');
    const count = await Venue.countDocuments();
    res.json({ total: count, venues });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, listVenues);
router.post('/', authenticate, createVenue);
router.put('/:id', authenticate, updateVenue);
router.delete('/:id', authenticate, deleteVenue);

export default router;