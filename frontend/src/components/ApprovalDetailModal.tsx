import Badge from './ui/Badge';
import Button from './ui/Button';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface ApprovalDetailModalProps {
  isOpen: boolean;
  event: any;
  approval: any;
  onClose: () => void;
  onApproveWithData: (feedback: string) => Promise<void>;
  onRejectWithData: (feedback: string) => Promise<void>;
  canApprove?: boolean;
}

export default function ApprovalDetailModal({ 
  isOpen, 
  event, 
  approval, 
  onClose, 
  onApproveWithData,
  onRejectWithData,
  canApprove = true
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
        maxWidth: '650px',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        margin: 'auto'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Event Approval Details</h2>
        </div>

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

          {/* Feedback Input & Action Buttons (Only for Approvers) */}
          {canApprove && (
            <>
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
            </>
          )}

          {/* Close Button for Non-Approvers */}
          {!canApprove && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <Button 
                variant="secondary" 
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
