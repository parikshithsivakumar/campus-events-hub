import { Router } from 'express';
import { listVenues, createVenue, updateVenue, deleteVenue } from '../controllers/venueController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, listVenues);
router.post('/', authenticate, createVenue);
router.put('/:id', authenticate, updateVenue);
router.delete('/:id', authenticate, deleteVenue);

export default router;