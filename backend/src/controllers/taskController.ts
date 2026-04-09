import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';
import { Task } from '../models';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  team: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  dueDate: z.string().optional(),
});

export const listTasks = async (req: AuthRequest, res: Response) => {
  try {
    // Only student organizers can create/manage tasks
    if (req.user.role !== 'STUDENT_ORGANIZER') {
      return res.status(403).json({ error: 'Only student organizers can manage tasks' });
    }

    const tasks = await Task.find({ organizerId: req.user._id, deleted: false });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    // Only student organizers can create tasks
    if (req.user.role !== 'STUDENT_ORGANIZER') {
      return res.status(403).json({ error: 'Only student organizers can create tasks' });
    }

    const payload = createTaskSchema.parse(req.body);
    const task = await Task.create({
      ...payload,
      organizerId: req.user._id,
      status: 'TODO',
      deleted: false,
    });
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    // Only student organizers can update task status
    if (req.user.role !== 'STUDENT_ORGANIZER') {
      return res.status(403).json({ error: 'Only student organizers can update tasks' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Verify ownership
    if (task.organizerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only task creator can update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedTask);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Verify ownership
    if (task.organizerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only task creator can delete this task' });
    }

    await Task.findByIdAndUpdate(id, { deleted: true });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
