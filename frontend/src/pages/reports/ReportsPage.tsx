import Card from '../../components/ui/Card';
import { useReportsData, useEventsData } from '../../hooks/useDashboardData';
import { useAuthStore } from '../../store/authStore';

export default function ReportsPage() {
  const { user } = useAuthStore();
  const { data: reports = [] } = useReportsData();
  const { data: events = [] } = useEventsData();

  // Apply role-specific filters
  let filteredReports = reports;
  
  if (user?.role === 'STUDENT_ORGANIZER') {
    // Student organizers only see reports for their events
    const userEventIds = new Set(events.filter((e: any) => e.organizerId === user.id).map((e: any) => e.id));
    filteredReports = reports.filter((report: any) => userEventIds.has(report.eventId || report.id));
  } else if (user?.role === 'DEPARTMENT_APPROVER' && user?.department) {
    // Department approvers only see reports for their department's events
    const deptEventIds = new Set(events.filter((e: any) => e.department === user.department).map((e: any) => e.id));
    filteredReports = reports.filter((report: any) => deptEventIds.has(report.eventId || report.id));
  }

  return (
    <div className="grid-layout">
      <Card title="Post-Event Reports" subtitle="Attendance, feedback, and budget insights">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Attendance</th>
                <th>Feedback</th>
                <th>Budget Spent</th>
                <th>Generated</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report: any) => (
                <tr key={report.id}>
                  <td>{report.eventTitle}</td>
                  <td>{report.attendance}</td>
                  <td>{report.feedbackScore.toFixed(1)} / 5</td>
                  <td>INR {report.budgetSpent.toLocaleString()}</td>
                  <td>{new Date(report.generatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
