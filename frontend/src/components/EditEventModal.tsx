import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from './ui/Button';
import api from '../services/api';

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
      const response = await api.put(`/events/${event.id}`, formData);
      onEventUpdated();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to update event';
      setError(msg);
    } finally {
      setIsSubmitting(false);
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
        maxWidth: '550px',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        margin: 'auto'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Edit Event</h2>
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

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
            <input
              type="text"
              className="input"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Department</label>
            <input
              type="text"
              className="input"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
            <textarea
              className="input textarea"
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.startAt}
                onChange={e => setFormData({ ...formData, startAt: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Date</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.endAt}
                onChange={e => setFormData({ ...formData, endAt: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Budget (INR)</label>
            <input
              type="number"
              className="input"
              value={formData.budget}
              onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button 
              variant="secondary" 
              onClick={onClose} 
              type="button"
              fullWidth
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
