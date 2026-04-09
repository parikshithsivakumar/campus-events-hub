import Button from './ui/Button';
import Card from './ui/Card';
import { useState } from 'react';

interface DeleteEventModalProps {
  isOpen: boolean;
  event: any;
  onClose: () => void;
  onEventDeleted: () => void;
}

export default function DeleteEventModal({ isOpen, event, onClose, onEventDeleted }: DeleteEventModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!event?.id) return;

    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:4000/api/events/${event.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onEventDeleted();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete event');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <Card title="Delete Event" style={{ width: '90%', maxWidth: '500px' }}>
        {error && <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
        <div style={{ marginBottom: '1.5rem' }}>
          <p>Are you sure you want to delete this event?</p>
          <p style={{ fontWeight: 'bold', color: '#d32f2f', marginTop: '0.5rem' }}>{event?.title}</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>This action cannot be undone.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ background: '#d32f2f' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Event'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
