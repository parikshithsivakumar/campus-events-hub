import { useEffect, useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface EditEventModalProps {
  isOpen: boolean;
  event: any;
  onClose: () => void;
  onEventUpdated: () => void;
}

export default function EditEventModal({ isOpen, event, onClose, onEventUpdated }: EditEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    startAt: '',
    endAt: '',
    budget: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        department: event.department || '',
        description: event.description || '',
        startAt: event.startAt?.slice(0, 16) || '',
        endAt: event.endAt?.slice(0, 16) || '',
        budget: event.budget || 0,
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event?.id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:4000/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onEventUpdated();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update event');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <Card title="Edit Event" style={{ width: '90%', maxWidth: '600px' }}>
        {error && <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <Input
            label="Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Department"
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value })}
          />
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Description</span>
            <textarea
              className="input textarea"
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </label>
          <Input
            label="Start"
            type="datetime-local"
            value={formData.startAt}
            onChange={e => setFormData({ ...formData, startAt: e.target.value })}
            required
          />
          <Input
            label="End"
            type="datetime-local"
            value={formData.endAt}
            onChange={e => setFormData({ ...formData, endAt: e.target.value })}
            required
          />
          <Input
            label="Budget"
            type="number"
            value={formData.budget}
            onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </Button>
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
