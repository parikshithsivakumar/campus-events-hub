import { Router } from 'express';
import { createCollege, getColleges, getMyCollege } from '../controllers/collegeController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getColleges);
router.get('/my-college', authenticate, getMyCollege);
router.post('/', authenticate, createCollege);

export default router;