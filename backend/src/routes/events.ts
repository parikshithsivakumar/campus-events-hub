import { Router } from 'express';
import { listEvents, createEvent, approveEvent } from '../controllers/eventController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, listEvents);
router.post('/', authenticate, createEvent);
router.post('/:id/approve', authenticate, approveEvent);

export default router;