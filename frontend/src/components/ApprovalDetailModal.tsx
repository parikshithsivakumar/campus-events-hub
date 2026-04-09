import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';
import { useState } from 'react';

interface ApprovalDetailModalProps {
  isOpen: boolean;
  event: any;
  approval: any;
  onClose: () => void;
  onApproveWithData: (feedback: string) => Promise<void>;
  onRejectWithData: (feedback: string) => Promise<void>;
}

export default function ApprovalDetailModal({ 
  isOpen, 
  event, 
  approval, 
  onClose, 
  onApproveWithData,
  onRejectWithData
}: ApprovalDetailModalProps) {
  const [feedback, setFeedback] = useState(approval?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [error, setError] = useState<string>('');

  if (!isOpen || !event) return null;

  const handleApprove = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      setDecision('APPROVED');
      await onApproveWithData(feedback);
      setFeedback('');
      setDecision(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve event');
      setDecision(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      setDecision('REJECTED');
      await onRejectWithData(feedback);
      setFeedback('');
      setDecision(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject event');
      setDecision(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div style={{ width: '90%', maxWidth: '700px', margin: '2rem auto' }}>
        <Card title="Event Approval Details">
          <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Error Display */}
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '1rem', 
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {/* Event Header */}
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
            <Badge variant={event.status === 'PENDING' ? 'warning' : event.status === 'APPROVED' ? 'success' : 'danger'}>
              {event.status}
            </Badge>
          </div>

          {/* Event Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <strong>Department</strong>
              <p>{event.department || 'N/A'}</p>
            </div>
            <div>
              <strong>Organizer</strong>
              <p>{event.organizer || 'N/A'}</p>
            </div>
            <div>
              <strong>Budget</strong>
              <p>INR {event.budget?.toLocaleString?.() ?? '0'}</p>
            </div>
            <div>
              <strong>Venue</strong>
              <p>{event.venue || 'N/A'}</p>
            </div>
            <div>
              <strong>Start Date</strong>
              <p>{event.startAt ? new Date(event.startAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <strong>End Date</strong>
              <p>{event.endAt ? new Date(event.endAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <strong>Description</strong>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>{event.description}</p>
            </div>
          )}

          {/* Existing Feedback */}
          {approval?.comment && (
            <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
              <strong>Previous Feedback</strong>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>{approval.comment}</p>
            </div>
          )}

          {/* Feedback Input */}
          <div>
            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <strong>Your Approval Feedback</strong>
              <textarea
                className="input textarea"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add any conditions, requests for changes, or comments..."
                disabled={isSubmitting}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <Button 
              variant="secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReject}
              disabled={isSubmitting}
              style={{ background: '#d32f2f' }}
            >
              {decision === 'REJECTED' && isSubmitting ? 'Rejecting...' : 'Reject'}
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={isSubmitting}
              style={{ background: '#1f7a5d' }}
            >
              {decision === 'APPROVED' && isSubmitting ? 'Approving...' : 'Approve'}
            </Button>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
