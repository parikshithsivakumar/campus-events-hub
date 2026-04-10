import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ApprovalDetailModal from '../../components/ApprovalDetailModal';
import { useApprovalsData, useEventsData } from '../../hooks/useDashboardData';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function ApprovalsPage() {
  const { user } = useAuthStore();
  const { data: events = [] } = useEventsData();
  const { data: approvals = [] } = useApprovalsData();
  const queryClient = useQueryClient();
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  console.log('ApprovalsPage - events:', events);
  console.log('ApprovalsPage - selectedEvent:', selectedEvent);

  // Check if user has approval permissions
  const canApprove = user && ['FACULTY_ADVISOR', 'DEPARTMENT_APPROVER', 'COLLEGE_ADMIN', 'SUPER_ADMIN'].includes(user.role);

  const handleEventClick = (event: any) => {
    // Only Department Approvers should be able to click through for approval
    if (user?.role === 'DEPARTMENT_APPROVER' && event.status !== 'APPROVED') {
      alert('Only Faculty-approved events can be reviewed by Department Approvers');
      return;
    }
    setSelectedEvent(event);
    // Find approval by matching _id or id
    const eventId = event._id || event.id;
    setSelectedApproval(approvals.find((a: any) => a.eventId === eventId) || {});
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (feedback: string) => {
    if (!selectedEvent) {
      throw new Error('No event selected');
    }
    
    const eventId = selectedEvent._id || selectedEvent.id;
    
    if (!eventId) {
      console.error('Event object:', selectedEvent);
      throw new Error('Event ID is missing. Event data: ' + JSON.stringify(selectedEvent));
    }
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:4000/api/events/${eventId}/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ decision: 'APPROVED', comment: feedback }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve event');
      }
      
      // Invalidate cache to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['approvals'] });
      
      // Close modal
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Approval error:', error);
      throw error;
    }
  };

  const handleReject = async (feedback: string) => {
    if (!selectedEvent) {
      throw new Error('No event selected');
    }
    
    const eventId = selectedEvent._id || selectedEvent.id;
    
    if (!eventId) {
      console.error('Event object:', selectedEvent);
      throw new Error('Event ID is missing. Event data: ' + JSON.stringify(selectedEvent));
    }
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:4000/api/events/${eventId}/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ decision: 'REJECTED', comment: feedback }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject event');
      }
      
      // Invalidate cache to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['approvals'] });
      
      // Close modal
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Rejection error:', error);
      throw error;
    }
  };

  // Get filtered events based on role
  const getFilteredEvents = () => {
    if (canApprove) {
      // Approvers see events pending their approval
      if (user?.role === 'FACULTY_ADVISOR') {
        // Faculty Advisors see PENDING or IN_REVIEW events (events awaiting their approval)
        return events.filter((e: any) => 
          e.status === 'PENDING' || e.status === 'IN_REVIEW'
        );
      } else if (user?.role === 'DEPARTMENT_APPROVER') {
        // Department approvers ONLY see APPROVED events from ANY department (Faculty-approved only)
        // Note: NOT filtered by department - they review all Faculty-approved events
        return events.filter((e: any) => 
          e.status === 'APPROVED'
        );
      }
      // College Admins and Super Admins see all events
      return events;
    } else {
      // Organizers see only their events
      if (user?.role === 'STUDENT_ORGANIZER') {
        return events.filter((e: any) => {
          // Handle both cases: organizerId as string/ID and organizerId as populated object
          const organizerId = typeof e.organizerId === 'object' ? e.organizerId?.id || e.organizerId?._id : e.organizerId;
          return organizerId === user?.id;
        });
      }
      return [];
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="grid-layout">
      <Card 
        title="Events Status" 
        subtitle={
          user?.role === 'FACULTY_ADVISOR' 
            ? `Events awaiting your approval${filteredEvents.length === 0 ? ' (none pending)' : ''}`
            : canApprove 
              ? "Review and approve events" 
              : "Status of your proposals"
        }
      >
        {/* Combined Events List Table */}
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            <p>
              {user?.role === 'FACULTY_ADVISOR' 
                ? 'No events pending for your approval' 
                : 'No events to display'}
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event: any) => {
                  const eventId = event._id || event.id;
                  const isDeptApprover = user?.role === 'DEPARTMENT_APPROVER';
                  
                  return (
                    <tr key={eventId} style={{ cursor: 'pointer' }} onClick={() => handleEventClick(event)}>
                      <td>
                        <div>
                          <strong>{event.title}</strong>
                          {isDeptApprover && (
                            <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0 0' }}>
                              ✓ Faculty Approved
                            </p>
                          )}
                        </div>
                      </td>
                      <td>{event.department}</td>
                      <td>{event.startAt ? new Date(event.startAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <Badge
                          variant={
                            isDeptApprover
                              ? event.status === 'APPROVED_FINAL'
                                ? 'success'  // Show success when fully approved
                                : 'warning'  // Show warning while pending dept approval
                              : event.status === 'APPROVED' || event.status === 'APPROVED_FINAL'
                              ? 'success'
                              : event.status === 'REJECTED'
                                ? 'danger'
                                : event.status === 'IN_REVIEW'
                                  ? 'info'
                                  : 'warning'
                          }
                        >
                          {isDeptApprover 
                            ? (event.status === 'APPROVED_FINAL' ? '✓ Approved' : 'Dept: Pending')
                            : event.status}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'right', color: '#1976d2', fontSize: '0.85rem' }}>→</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Approval Detail Modal */}
      <ApprovalDetailModal
        isOpen={isDetailModalOpen}
        event={selectedEvent}
        approval={selectedApproval}
        onClose={() => setIsDetailModalOpen(false)}
        onApproveWithData={handleApprove}
        onRejectWithData={handleReject}
        canApprove={canApprove}
        userRole={user?.role}
      />
    </div>
  );
}
