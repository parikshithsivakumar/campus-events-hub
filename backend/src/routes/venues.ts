import { Router } from 'express';
import { listVenues, createVenue } from '../controllers/venueController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, listVenues);
router.post('/', authenticate, createVenue);

export default router;