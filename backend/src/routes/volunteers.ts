import { Router } from 'express';
import { listVolunteers } from '../controllers/volunteerController';
import { authenticate } from '../middlewares/auth';
import { permit } from '../middlewares/rbac';

const router = Router();

router.get('/', authenticate, permit(['STUDENT_ORGANIZER', 'FACULTY_ADVISOR']), listVolunteers);

export default router;
