import { Router } from 'express';
import { generateReport, getReports, getReportById } from '../controllers/reportController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, generateReport);
router.get('/', authenticate, getReports);
router.get('/:id', authenticate, getReportById);

export default router;
