export type Role =
  | 'SUPER_ADMIN'
  | 'COLLEGE_ADMIN'
  | 'FACULTY_ADVISOR'
  | 'STUDENT_ORGANIZER'
  | 'VOLUNTEER'
  | 'DEPARTMENT_APPROVER';

export type EventStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_REVIEW';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  collegeId: string;
  department?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  venue: string;
  department: string;
  organizer: string;
  organizerId?: string;
  status: EventStatus;
  budget: number;
}

export interface ApprovalStep {
  id: string;
  eventId: string;
  stage: string;
  approver: string;
  decision: 'APPROVED' | 'REJECTED' | 'PENDING';
  comment?: string;
  timestamp?: string;
}

export interface VenueAvailability {
  id: string;
  name: string;
  capacity: number;
  slots: Array<{ day: string; blocks: Array<'FREE' | 'BOOKED'> }>;
}

export interface TaskItem {
  id: string;
  title: string;
  team: 'Media' | 'Logistics' | 'Tech' | 'Hospitality';
  assignee: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface ReportItem {
  id: string;
  eventTitle: string;
  attendance: number;
  feedbackScore: number;
  budgetSpent: number;
  generatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
