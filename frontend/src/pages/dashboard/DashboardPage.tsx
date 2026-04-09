import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useApprovalsData, useEventsData, useNotificationsData, useReportsData } from '../../hooks/useDashboardData';
import { useAuthStore } from '../../store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: events = [] } = useEventsData();
  const { data: approvals = [] } = useApprovalsData();
  const { data: reports = [] } = useReportsData();
  const { data: notifications = [] } = useNotificationsData();

  const pending = approvals.filter((item: { decision: string }) => item.decision === 'PENDING').length;
  const approved = events.filter((item: { status: string }) => item.status === 'APPROVED').length;
  const avgFeedback = reports.length
    ? (reports.reduce((sum: number, curr: { feedbackScore: number }) => sum + curr.feedbackScore, 0) / reports.length).toFixed(1)
    : '0.0';

  // Role-based dashboard rendering
  const renderSuperAdminDashboard = () => (
    <div className="grid-layout">
      <Card title="Platform Overview" subtitle="System-wide statistics">
        <div className="stat-row">
          <div>
            <strong>12</strong>
            <span>Total Colleges</span>
          </div>
          <div>
            <strong>2.4K</strong>
            <span>Total Users</span>
          </div>
          <div>
            <strong>1.2K</strong>
            <span>Total Events</span>
          </div>
          <div>
            <strong>98%</strong>
            <span>System Uptime</span>
          </div>
        </div>
      </Card>

      <Card title="User Distribution" subtitle="Breakdown by role">
        <ul className="list-compact">
          <li>
            <div>
              <strong>College Administrators</strong>
              <p>College management & oversight</p>
            </div>
            <Badge variant="info">342</Badge>
          </li>
          <li>
            <div>
              <strong>Faculty Advisors</strong>
              <p>Event approval & guidance</p>
            </div>
            <Badge variant="info">856</Badge>
          </li>
          <li>
            <div>
              <strong>Student Organizers</strong>
              <p>Event creators</p>
            </div>
            <Badge variant="success">1024</Badge>
          </li>
          <li>
            <div>
              <strong>Volunteers</strong>
              <p>Event support staff</p>
            </div>
            <Badge variant="neutral">1852</Badge>
          </li>
        </ul>
      </Card>

      <Card title="Recent Activity" subtitle="System notifications">
        <ul className="list-compact">
          {notifications.slice(0, 5).map((item: { id: string; title: string; message: string }) => (
            <li key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );

  const renderCollegeAdminDashboard = () => (
    <div className="grid-layout">
      <Card title="College Pipeline" subtitle="Your college workload">
        <div className="stat-row">
          <div>
            <strong>{events.length}</strong>
            <span>Total Events</span>
          </div>
          <div>
            <strong>{pending}</strong>
            <span>Pending Approvals</span>
          </div>
          <div>
            <strong>{approved}</strong>
            <span>Approved Events</span>
          </div>
          <div>
            <strong>24</strong>
            <span>Active Venues</span>
          </div>
        </div>
      </Card>

      <Card title="Events by Status" subtitle="Quick overview">
        <ul className="list-compact">
          {events.slice(0, 8).map((event: { id: string; title: string; status: string; department: string }) => (
            <li key={event.id}>
              <div>
                <strong>{event.title}</strong>
                <p>{event.department}</p>
              </div>
              <Badge
                variant={
                  event.status === 'APPROVED'
                    ? 'success'
                    : event.status === 'REJECTED'
                      ? 'danger'
                      : event.status === 'IN_REVIEW'
                        ? 'info'
                        : 'warning'
                }
              >
                {event.status}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Performance Metrics" subtitle="Event attendance trends">
        <div className="chart-wrap">
          {reports.slice(0, 5).map((report: { id: string; eventTitle: string; attendance: number }) => (
            <div key={report.id} className="bar-row">
              <span>{report.eventTitle}</span>
              <div>
                <i style={{ width: `${Math.min(100, Math.round((report.attendance / 700) * 100))}%` }} />
              </div>
              <strong>{report.attendance}</strong>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderFacultyAdvisorDashboard = () => (
    <div className="grid-layout">
      <Card title="My Approvals Queue" subtitle="Events awaiting your review">
        <div className="stat-row">
          <div>
            <strong>{pending}</strong>
            <span>Pending Review</span>
          </div>
          <div>
            <strong>{approved}</strong>
            <span>Approved This Month</span>
          </div>
          <div>
            <strong>6</strong>
            <span>Rejected</span>
          </div>
          <div>
            <strong>18</strong>
            <span>Total Reviewed</span>
          </div>
        </div>
      </Card>

      <Card title="Events Needing Approval" subtitle="Action required">
        <ul className="list-compact">
          {events
            .filter((e: { status: string }) => e.status === 'PENDING' || e.status === 'IN_REVIEW')
            .slice(0, 8)
            .map((event: { id: string; title: string; status: string; department: string }) => (
              <li key={event.id}>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.department}</p>
                </div>
                <Badge variant="warning">{event.status}</Badge>
              </li>
            ))}
        </ul>
      </Card>

      <Card title="My Profile" subtitle="Advisor information">
        <ul className="list-compact">
          <li>
            <div>
              <strong>{user?.name || 'Faculty Advisor'}</strong>
              <p>{user?.email || 'advisor@college.edu'}</p>
            </div>
            <Badge variant="neutral">Active</Badge>
          </li>
        </ul>
      </Card>
    </div>
  );

  const renderStudentOrganizerDashboard = () => {
    // Filter events to only show those organized by current user
    const userEvents = events.filter((event: any) => event.organizerId === user?.id);
    const userPending = userEvents.filter((event: any) => event.status === 'PENDING' || event.status === 'IN_REVIEW').length;
    const userApproved = userEvents.filter((event: any) => event.status === 'APPROVED').length;
    const userReports = reports.length; // In a real app, this would also be filtered
    
    return (
      <div className="grid-layout">
        <Card title="My Events" subtitle="Events you've organized">
          <div className="stat-row">
            <div>
              <strong>{userEvents.length}</strong>
              <span>Total Events</span>
            </div>
            <div>
              <strong>{userApproved}</strong>
              <span>Approved</span>
            </div>
            <div>
              <strong>{userPending}</strong>
              <span>Pending Approval</span>
            </div>
            <div>
              <strong>{userReports}</strong>
              <span>Completed</span>
            </div>
          </div>
        </Card>

        <Card title="Event Checklist" subtitle="Status of all your events">
          <ul className="list-compact">
            {userEvents.slice(0, 6).map((event: { id: string; title: string; status: string; department: string }) => (
              <li key={event.id}>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.department}</p>
                </div>
                <Badge
                  variant={
                    event.status === 'APPROVED'
                      ? 'success'
                      : event.status === 'REJECTED'
                        ? 'danger'
                        : 'info'
                  }
                >
                  {event.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Notifications" subtitle="Updates on your events">
          <ul className="list-compact">
            {notifications.slice(0, 5).map((item: { id: string; title: string; message: string }) => (
              <li key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  };

  const renderVolunteerDashboard = () => (
    <div className="grid-layout">
      <Card title="My Assignments" subtitle="Tasks and events for you">
        <div className="stat-row">
          <div>
            <strong>8</strong>
            <span>Active Tasks</span>
          </div>
          <div>
            <strong>12</strong>
            <span>Completed Tasks</span>
          </div>
          <div>
            <strong>5</strong>
            <span>Upcoming Events</span>
          </div>
          <div>
            <strong>95%</strong>
            <span>Completion Rate</span>
          </div>
        </div>
      </Card>

      <Card title="Upcoming Events" subtitle="Where you'll be volunteering">
        <ul className="list-compact">
          {events.slice(0, 5).map((event: { id: string; title: string; status: string; department: string }) => (
            <li key={event.id}>
              <div>
                <strong>{event.title}</strong>
                <p>{event.department}</p>
              </div>
              <Badge variant="success">View Details</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Latest Updates" subtitle="What's happening">
        <ul className="list-compact">
          {notifications.slice(0, 4).map((item: { id: string; title: string; message: string }) => (
            <li key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );

  const renderDepartmentApproverDashboard = () => {
    // Calculate real statistics for department approver
    const deptEvents = events.filter((e: any) => e.department === user?.department);
    const deptPending = deptEvents.filter((e: any) => e.status === 'PENDING' || e.status === 'IN_REVIEW').length;
    const deptApproved = deptEvents.filter((e: any) => e.status === 'APPROVED').length;
    const deptRejected = deptEvents.filter((e: any) => e.status === 'REJECTED').length;
    const deptTotal = deptEvents.length;

    return (
      <div className="grid-layout">
        <Card title="Approval Workload" subtitle={`${user?.department || 'Department'} submissions`}>
          <div className="stat-row">
            <div>
              <strong>{deptPending}</strong>
              <span>Pending</span>
            </div>
            <div>
              <strong>{deptApproved}</strong>
              <span>Approved</span>
            </div>
            <div>
              <strong>{deptRejected}</strong>
              <span>Rejected</span>
            </div>
            <div>
              <strong>{deptTotal}</strong>
              <span>Total</span>
            </div>
          </div>
        </Card>

        <Card title="Events Awaiting Review" subtitle="Action required">
          <ul className="list-compact">
            {events
              .filter((e: any) => (e.status === 'PENDING' || e.status === 'IN_REVIEW') && e.department === user?.department)
              .slice(0, 8)
              .map((event: any) => (
                <li key={event.id}>
                  <div>
                    <strong>{event.title}</strong>
                    <p>🏫 {event.department} • Budget: INR {event.budget?.toLocaleString?.() ?? '0'}</p>
                  </div>
                  <Badge variant="warning">{event.status}</Badge>
                </li>
              ))}
          </ul>
          {deptPending === 0 && (
            <p style={{ textAlign: 'center', color: '#999', padding: '1rem' }}>No pending approvals for your department</p>
          )}
        </Card>

        <Card title="Department Analytics" subtitle="Your approval metrics">
          <div className="chart-wrap">
            <div className="bar-row">
              <span>Pending Rate</span>
              <div>
                <i style={{ width: `${deptTotal > 0 ? (deptPending / deptTotal) * 100 : 0}%` }} />
              </div>
              <strong>{deptTotal > 0 ? ((deptPending / deptTotal) * 100).toFixed(0) : 0}%</strong>
            </div>
            <div className="bar-row">
              <span>Approval Rate</span>
              <div>
                <i style={{ width: `${deptTotal > 0 ? (deptApproved / deptTotal) * 100 : 0}%` }} />
              </div>
              <strong>{deptTotal > 0 ? ((deptApproved / deptTotal) * 100).toFixed(0) : 0}%</strong>
            </div>
            <div className="bar-row">
              <span>Rejection Rate</span>
              <div>
                <i style={{ width: `${deptTotal > 0 ? (deptRejected / deptTotal) * 100 : 0}%` }} />
              </div>
              <strong>{deptTotal > 0 ? ((deptRejected / deptTotal) * 100).toFixed(0) : 0}%</strong>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Render dashboard based on user role
  switch (user?.role) {
    case 'SUPER_ADMIN':
      return renderSuperAdminDashboard();
    case 'COLLEGE_ADMIN':
      return renderCollegeAdminDashboard();
    case 'FACULTY_ADVISOR':
      return renderFacultyAdvisorDashboard();
    case 'STUDENT_ORGANIZER':
      return renderStudentOrganizerDashboard();
    case 'VOLUNTEER':
      return renderVolunteerDashboard();
    case 'DEPARTMENT_APPROVER':
      return renderDepartmentApproverDashboard();
    default:
      return renderStudentOrganizerDashboard();
  }
}
