import { Router } from 'express';
import { listTasks, createTask, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middlewares/auth';
import { permit } from '../middlewares/rbac';

const router = Router();

router.get('/', authenticate, permit(['STUDENT_ORGANIZER', 'FACULTY_ADVISOR']), listTasks);
router.post('/', authenticate, permit(['STUDENT_ORGANIZER']), createTask);
router.patch('/:id/status', authenticate, permit(['STUDENT_ORGANIZER']), updateTaskStatus);
router.delete('/:id', authenticate, permit(['STUDENT_ORGANIZER']), deleteTask);

export default router;
