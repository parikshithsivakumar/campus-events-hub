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
    // All authenticated users (SO, VOLUNTEER, FACULTY_ADVISOR) see all tasks
    const tasks = await Task.find({ deleted: false });
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
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Permission checks based on role
    if (req.user.role === 'STUDENT_ORGANIZER') {
      // Student organizers can update any task (they manage the team)
      const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });
      return res.json(updatedTask);
    } else if (req.user.role === 'VOLUNTEER') {
      // Volunteers can update only tasks assigned to them
      // Compare both as ObjectId strings for consistency
      const assigneeId = task.assignee?.toString() || '';
      const userId = req.user._id?.toString() || '';
      
      console.log(`🔍 Volunteer update check - Task assignee: "${assigneeId}", User ID: "${userId}"`);
      
      if (assigneeId !== userId) {
        return res.status(403).json({ error: `You can only update tasks assigned to you. Task assignee: ${assigneeId}, Your ID: ${userId}` });
      }
      const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });
      return res.json(updatedTask);
    } else {
      return res.status(403).json({ error: 'Only student organizers or assigned volunteers can update tasks' });
    }
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
