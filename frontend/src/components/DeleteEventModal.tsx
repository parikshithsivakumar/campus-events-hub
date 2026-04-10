import Button from './ui/Button';
import Card from './ui/Card';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';

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
      const response = await api.delete(`/events/${event.id}`);
      onEventDeleted();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to delete event';
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div style={{ 
      position: 'fixed', 
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 9999,
      overflowY: 'auto',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '450px',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        margin: 'auto'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Delete Event</h2>
        </div>

        {error && (
          <div style={{ 
            color: '#d32f2f', 
            backgroundColor: '#ffebee', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.75rem 0', color: '#333' }}>Are you sure you want to delete this event?</p>
          <p style={{ 
            fontWeight: 'bold', 
            color: '#d32f2f', 
            margin: '0',
            fontSize: '1rem'
          }}>
            {event?.title}
          </p>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#666', 
            margin: '0.75rem 0 0 0'
          }}>
            This action cannot be undone.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            disabled={isDeleting}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ background: '#d32f2f' }}
            fullWidth
          >
            {isDeleting ? 'Deleting...' : 'Delete Event'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
