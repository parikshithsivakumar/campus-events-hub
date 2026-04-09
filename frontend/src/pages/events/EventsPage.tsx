import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EditEventModal from '../../components/EditEventModal';
import DeleteEventModal from '../../components/DeleteEventModal';
import { useEventsData } from '../../hooks/useDashboardData';
import { useAuthStore } from '../../store/authStore';
import { useQueryClient } from '@tanstack/react-query';

const createEventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  department: z.string().min(2, 'Department is required'),
  venueId: z.string().min(1, 'Venue is required'),
  startAt: z.string().min(1, 'Start is required'),
  endAt: z.string().min(1, 'End is required'),
  budget: z.coerce.number().min(0, 'Budget must be non-negative'),
  description: z.string().min(10, 'Description should be at least 10 characters'),
});

type CreateEventForm = z.infer<typeof createEventSchema>;

export default function EventsPage() {
  const { user } = useAuthStore();
  const { data: events = [] } = useEventsData();
  const queryClient = useQueryClient();
  const [venues, setVenues] = useState<Array<{_id: string, name: string, location: string, capacity: number}>>([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [venueError, setVenueError] = useState<string | null>(null);
  const [createdCount, setCreatedCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isStudentOrganizer = user?.role === 'STUDENT_ORGANIZER';

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoadingVenues(true);
        setVenueError(null);
        const token = localStorage.getItem('access_token');
        console.log('Fetching venues with token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
        
        const response = await fetch('http://localhost:4000/api/venues', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Venues response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Venues fetched:', data);
          setVenues(data);
        } else {
          const errorText = await response.text();
          console.error('Venues fetch failed:', response.status, errorText);
          setVenueError(`Failed to fetch venues: ${response.status} ${errorText}`);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('Failed to fetch venues:', error);
        setVenueError(`Network error: ${msg}`);
      } finally {
        setLoadingVenues(false);
      }
    };
    fetchVenues();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventForm>({
    resolver: zodResolver(createEventSchema),
  });

  const onSubmit = async (data: CreateEventForm) => {
    try {
      setSubmitError(null);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Invalidate events cache to trigger refetch
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        
        setCreatedCount(prev => prev + 1);
        setRefreshTrigger(prev => prev + 1);
        reset();
        // Added success feedback
      } else {
        const error = await response.json();
        setSubmitError(error.error || 'Failed to create event');
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create event');
    }
  };

  const handleEditClick = (event: any) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (event: any) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleEventUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEventDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="grid-layout">
      {/* Event Creation Form - only for Student Organizers */}
      {isStudentOrganizer && (
        <Card title="Create Event Proposal" subtitle="Routes into your configured approval workflow">
          {submitError && (
            <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
            <Input label="Event title" placeholder="AI Innovation Summit" error={errors.title?.message} {...register('title')} />
            <Input label="Department" placeholder="Computer Science" error={errors.department?.message} {...register('department')} />
            
            <label className="field">
              <span>Venue</span>
              <select {...register('venueId')} className="input" disabled={loadingVenues || venueError ? true : false}>
                <option value="">Select a venue...</option>
                {venues.map((venue: any) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name} ({venue.location}, Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
              {errors.venueId?.message && <small className="field-error">{errors.venueId.message}</small>}
              {loadingVenues && <small className="muted">Loading venues...</small>}
              {venueError && <small className="field-error">{venueError}</small>}
              {!loadingVenues && venues.length === 0 && !venueError && <small className="muted">No venues available. Ask your admin to create venues.</small>}
            </label>

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
      )}

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
                {isStudentOrganizer && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {events
                .filter((event: any) => {
                  // Student organizers see only their events
                  if (isStudentOrganizer) return event.organizerId === user?.id;
                  // Department approvers see only their department's events
                  if (user?.role === 'DEPARTMENT_APPROVER') return event.department === user?.department;
                  // Others see all events (filtered by college by default from backend)
                  return true;
                })
                .map((event: any) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.department}</td>
                    <td>{event.venue}</td>
                    <td>{event.status}</td>
                    <td>INR {event.budget?.toLocaleString?.() ?? '0'}</td>
                    {isStudentOrganizer && event.organizerId === user?.id && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditClick(event)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                            title="Edit event"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteClick(event)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                            title="Delete event"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <EditEventModal
          isOpen={isEditModalOpen}
          event={selectedEvent}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }}
          onEventUpdated={handleEventUpdated}
        />

        <DeleteEventModal
          isOpen={isDeleteModalOpen}
          event={selectedEvent}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedEvent(null);
          }}
          onEventDeleted={handleEventDeleted}
        />
      </Card>
    </div>
  );
}
