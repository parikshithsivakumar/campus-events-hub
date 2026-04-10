import { Router } from 'express';
import authRoutes from './auth';
import collegeRoutes from './colleges';
import eventRoutes from './events';
import approvalRoutes from './approvals';
import venueRoutes from './venues';
import bookingRoutes from './bookings';
import reportRoutes from './reports';
import taskRoutes from './tasks';
import volunteerRoutes from './volunteers';

const router = Router();

router.use('/auth', authRoutes);
router.use('/colleges', collegeRoutes);
router.use('/events', eventRoutes);
router.use('/approvals', approvalRoutes);
router.use('/venues', venueRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reports', reportRoutes);
router.use('/tasks', taskRoutes);
router.use('/volunteers', volunteerRoutes);

export default router;