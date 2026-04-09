import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Report, Event } from '../models';

export const generateReport = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, attendance, feedbackScore, budgetSpent, summary } = req.body;
    const report = await Report.create({ eventId, attendance, feedbackScore, budgetSpent, summary });
    res.json(report);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ collegeId: req.user.collegeId });
    const eventIds = events.map(e => e._id);
    const reports = await Report.find({ eventId: { $in: eventIds } }).populate('eventId');
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportById = async (req: AuthRequest, res: Response) => {
  try {
    const report = await Report.findById(req.params.id).populate('eventId');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
