import Card from '../../components/ui/Card';
import { useReportsData } from '../../hooks/useDashboardData';

export default function ReportsPage() {
  const { data: reports = [] } = useReportsData();

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
              {reports.map((report: any) => (
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
