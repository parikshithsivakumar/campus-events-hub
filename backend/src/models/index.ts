import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY_ADVISOR', 'STUDENT_ORGANIZER', 'VOLUNTEER', 'DEPARTMENT_APPROVER'],
      default: 'STUDENT_ORGANIZER',
    },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    permissions: [String],
    isActive: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ collegeId: 1 });

export const User = mongoose.model('User', userSchema);

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    subscriptionPlan: { type: String, default: 'starter' },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

collegeSchema.index({ domain: 1 });

export const College = mongoose.model('College', collegeSchema);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
    department: { type: String },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'IN_REVIEW'], default: 'PENDING' },
    budget: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

eventSchema.index({ collegeId: 1 });
eventSchema.index({ organizerId: 1 });

export const Event = mongoose.model('Event', eventSchema);

const approvalSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stage: { type: String, required: true },
    decision: { type: String, enum: ['APPROVED', 'REJECTED', 'PENDING'], default: 'PENDING' },
    comment: { type: String },
  },
  { timestamps: true },
);

approvalSchema.index({ eventId: 1 });

export const Approval = mongoose.model('Approval', approvalSchema);

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    capacity: { type: Number, required: true },
    location: { type: String, required: true },
    building: { type: String },
    floor: { type: String },
    facilities: [{ type: String }],
    description: { type: String },
    amenities: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

venueSchema.index({ collegeId: 1 });

export const Venue = mongoose.model('Venue', venueSchema);

const bookingSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    status: { type: String, enum: ['CONFIRMED', 'PENDING', 'CANCELLED'], default: 'CONFIRMED' },
  },
  { timestamps: true },
);

bookingSchema.index({ venueId: 1, startAt: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    team: { type: String },
    status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: Date },
  },
  { timestamps: true },
);

taskSchema.index({ eventId: 1 });

export const Task = mongoose.model('Task', taskSchema);

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);

const reportSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    attendance: { type: Number, default: 0 },
    feedbackScore: { type: Number, default: 0 },
    budgetSpent: { type: Number, default: 0 },
    summary: { type: String },
  },
  { timestamps: true },
);

reportSchema.index({ eventId: 1 });

export const Report = mongoose.model('Report', reportSchema);
