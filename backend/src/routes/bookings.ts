import { Router } from 'express';
import { createBooking } from '../controllers/bookingController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createBooking);

export default router;