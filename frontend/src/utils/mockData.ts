import {
  ApprovalStep,
  EventItem,
  NotificationItem,
  ReportItem,
  Role,
  TaskItem,
  User,
  VenueAvailability,
} from '../types/models';

export const roles: Role[] = [
  'SUPER_ADMIN',
  'COLLEGE_ADMIN',
  'FACULTY_ADVISOR',
  'STUDENT_ORGANIZER',
  'VOLUNTEER',
  'DEPARTMENT_APPROVER',
];

export const mockUser: User = {
  id: 'u-01',
  name: 'Aarav Sharma',
  email: 'aarav@demo.edu',
  role: 'COLLEGE_ADMIN',
  collegeId: 'c-demo',
};

export const mockEvents: EventItem[] = [
  {
    id: 'ev-101',
    title: 'Tech Fest 2026',
    description: 'Annual inter-college technology showcase and hackathon.',
    startAt: '2026-04-15T09:00:00.000Z',
    endAt: '2026-04-16T17:00:00.000Z',
    venue: 'Main Auditorium',
    department: 'Computer Science',
    organizer: 'Innovation Club',
    status: 'IN_REVIEW',
    budget: 175000,
  },
  {
    id: 'ev-102',
    title: 'Cultural Night',
    description: 'Dance, music, and theater by student societies.',
    startAt: '2026-04-22T14:00:00.000Z',
    endAt: '2026-04-22T21:00:00.000Z',
    venue: 'Open Amphitheater',
    department: 'Arts Council',
    organizer: 'Culture Circle',
    status: 'APPROVED',
    budget: 120000,
  },
  {
    id: 'ev-103',
    title: 'Placement Prep Bootcamp',
    description: 'Aptitude and interview workshops with alumni mentors.',
    startAt: '2026-04-18T10:00:00.000Z',
    endAt: '2026-04-18T16:00:00.000Z',
    venue: 'Seminar Hall B',
    department: 'Training & Placement',
    organizer: 'Career Cell',
    status: 'PENDING',
    budget: 45000,
  },
];

export const mockApprovals: ApprovalStep[] = [
  {
    id: 'ap-1',
    eventId: 'ev-101',
    stage: 'Faculty Advisor',
    approver: 'Dr. R. Menon',
    decision: 'APPROVED',
    comment: 'Good proposal. Ensure backup internet.',
    timestamp: '2026-04-05T11:30:00.000Z',
  },
  {
    id: 'ap-2',
    eventId: 'ev-101',
    stage: 'DoSA',
    approver: 'Dean Student Affairs',
    decision: 'PENDING',
  },
  {
    id: 'ap-3',
    eventId: 'ev-101',
    stage: 'Facilities',
    approver: 'Estate Manager',
    decision: 'PENDING',
  },
  {
    id: 'ap-4',
    eventId: 'ev-102',
    stage: 'Faculty Advisor',
    approver: 'Prof. Lata Iyer',
    decision: 'APPROVED',
    timestamp: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'ap-5',
    eventId: 'ev-102',
    stage: 'DoSA',
    approver: 'Dean Student Affairs',
    decision: 'APPROVED',
    timestamp: '2026-04-01T17:40:00.000Z',
  },
  {
    id: 'ap-6',
    eventId: 'ev-102',
    stage: 'Facilities',
    approver: 'Estate Manager',
    decision: 'APPROVED',
    timestamp: '2026-04-02T10:10:00.000Z',
  },
];

export const mockVenues: VenueAvailability[] = [
  {
    id: 'v-1',
    name: 'Main Auditorium',
    capacity: 500,
    slots: [
      { day: 'Mon', blocks: ['BOOKED', 'FREE', 'FREE'] },
      { day: 'Tue', blocks: ['FREE', 'BOOKED', 'FREE'] },
      { day: 'Wed', blocks: ['FREE', 'FREE', 'FREE'] },
      { day: 'Thu', blocks: ['BOOKED', 'BOOKED', 'FREE'] },
      { day: 'Fri', blocks: ['FREE', 'FREE', 'BOOKED'] },
    ],
  },
  {
    id: 'v-2',
    name: 'Seminar Hall B',
    capacity: 180,
    slots: [
      { day: 'Mon', blocks: ['FREE', 'FREE', 'BOOKED'] },
      { day: 'Tue', blocks: ['BOOKED', 'FREE', 'FREE'] },
      { day: 'Wed', blocks: ['FREE', 'BOOKED', 'FREE'] },
      { day: 'Thu', blocks: ['FREE', 'FREE', 'FREE'] },
      { day: 'Fri', blocks: ['BOOKED', 'FREE', 'FREE'] },
    ],
  },
];

export const mockTasks: TaskItem[] = [
  {
    id: 't-001',
    title: 'Finalize sponsor deck',
    team: 'Media',
    assignee: 'Priya',
    dueDate: '2026-04-11',
    priority: 'High',
    status: 'IN_PROGRESS',
  },
  {
    id: 't-002',
    title: 'Stage lighting dry run',
    team: 'Tech',
    assignee: 'Karan',
    dueDate: '2026-04-13',
    priority: 'Medium',
    status: 'TODO',
  },
  {
    id: 't-003',
    title: 'Volunteer briefing schedule',
    team: 'Hospitality',
    assignee: 'Neha',
    dueDate: '2026-04-12',
    priority: 'Low',
    status: 'DONE',
  },
  {
    id: 't-004',
    title: 'Equipment logistics checklist',
    team: 'Logistics',
    assignee: 'Arjun',
    dueDate: '2026-04-14',
    priority: 'High',
    status: 'TODO',
  },
];

export const mockReports: ReportItem[] = [
  {
    id: 'r-01',
    eventTitle: 'Innovation Sprint 2026',
    attendance: 620,
    feedbackScore: 4.5,
    budgetSpent: 210000,
    generatedAt: '2026-03-28T13:30:00.000Z',
  },
  {
    id: 'r-02',
    eventTitle: 'Startup Weekend',
    attendance: 410,
    feedbackScore: 4.2,
    budgetSpent: 145000,
    generatedAt: '2026-03-18T10:20:00.000Z',
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Approval pending',
    message: 'Tech Fest 2026 is waiting for DoSA decision.',
    read: false,
    createdAt: '2026-04-09T09:30:00.000Z',
  },
  {
    id: 'n-2',
    title: 'Venue released',
    message: 'Seminar Hall B slot auto-released after event rejection.',
    read: true,
    createdAt: '2026-04-08T16:45:00.000Z',
  },
];
