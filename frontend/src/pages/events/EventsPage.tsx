import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useEventsData } from '../../hooks/useDashboardData';

const createEventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  department: z.string().min(2, 'Department is required'),
  venue: z.string().min(2, 'Venue is required'),
  startAt: z.string().min(1, 'Start is required'),
  endAt: z.string().min(1, 'End is required'),
  budget: z.coerce.number().min(0, 'Budget must be non-negative'),
  description: z.string().min(10, 'Description should be at least 10 characters'),
});

type CreateEventForm = z.infer<typeof createEventSchema>;

export default function EventsPage() {
  const { data: events = [] } = useEventsData();
  const [createdCount, setCreatedCount] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventForm>({
    resolver: zodResolver(createEventSchema),
  });

  const onSubmit = async () => {
    setCreatedCount(prev => prev + 1);
    reset();
  };

  return (
    <div className="grid-layout">
      <Card title="Create Event Proposal" subtitle="Routes into your configured approval workflow">
        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
          <Input label="Event title" placeholder="AI Innovation Summit" error={errors.title?.message} {...register('title')} />
          <Input label="Department" placeholder="Computer Science" error={errors.department?.message} {...register('department')} />
          <Input label="Venue" placeholder="Main Auditorium" error={errors.venue?.message} {...register('venue')} />
          <Input label="Start" type="datetime-local" error={errors.startAt?.message} {...register('startAt')} />
          <Input label="End" type="datetime-local" error={errors.endAt?.message} {...register('endAt')} />
          <Input label="Budget" type="number" error={errors.budget?.message} {...register('budget')} />
          <label className="field field-full">
            <span>Description</span>
            <textarea className="input textarea" rows={4} {...register('description')} />
            {errors.description?.message && <small className="field-error">{errors.description.message}</small>}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
          </Button>
          <small className="muted">Created this session: {createdCount}</small>
        </form>
      </Card>

      <Card title="Active Events" subtitle="Latest proposals and approved events">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.department}</td>
                  <td>{event.venue}</td>
                  <td>{event.status}</td>
                  <td>INR {event.budget?.toLocaleString?.() ?? '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
