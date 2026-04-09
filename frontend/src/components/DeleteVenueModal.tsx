import Button from './ui/Button';
import api from '../services/api';
import { useState } from 'react';

interface DeleteVenueModalProps {
  isOpen: boolean;
  venue?: any;
  onClose: () => void;
  onVenueDeleted: () => void;
}

export default function DeleteVenueModal({ isOpen, venue, onClose, onVenueDeleted }: DeleteVenueModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      setError('');
      setIsLoading(true);

      await api.delete(`/venues/${venue._id}`);
      onVenueDeleted();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete venue');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !venue) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Venue</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="delete-content">
          {error && <div className="auth-error">{error}</div>}

          <div className="delete-warning">
            <div className="warning-icon">⚠️</div>
            <p>
              Are you sure you want to delete <strong>{venue.name}</strong>?
            </p>
            <p className="warning-sub">
              This action cannot be undone. All event bookings for this venue will be affected.
            </p>
          </div>

          <div className="modal-buttons">
            <Button
              onClick={onClose}
              type="button"
              style={{ background: '#6c757d', color: 'white' }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              type="button"
              disabled={isLoading}
              style={{ background: '#a22525', color: 'white' }}
            >
              {isLoading ? 'Deleting...' : 'Delete Venue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
