import { Router } from 'express';
import { listEvents, createEvent, approveEvent, getEventById, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticate } from '../middlewares/auth';
import { permit } from '../middlewares/rbac';

const router = Router();

router.get('/', authenticate, listEvents);
router.get('/:id', authenticate, getEventById);
router.post('/', authenticate, permit(['STUDENT_ORGANIZER']), createEvent);
router.post('/:id/approve', authenticate, permit(['FACULTY_ADVISOR', 'DEPARTMENT_APPROVER', 'COLLEGE_ADMIN', 'SUPER_ADMIN']), approveEvent);
router.put('/:id', authenticate, permit(['STUDENT_ORGANIZER', 'COLLEGE_ADMIN', 'SUPER_ADMIN']), updateEvent);
router.delete('/:id', authenticate, permit(['STUDENT_ORGANIZER', 'COLLEGE_ADMIN', 'SUPER_ADMIN']), deleteEvent);

export default router;