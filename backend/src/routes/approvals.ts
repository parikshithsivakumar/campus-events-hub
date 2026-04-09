import { Router } from 'express';
import { getApprovals, getPendingApprovals } from '../controllers/approvalController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getApprovals);
router.get('/pending', authenticate, getPendingApprovals);

export default router;
