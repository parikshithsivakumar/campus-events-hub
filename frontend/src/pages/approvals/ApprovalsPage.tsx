import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useApprovalsData, useEventsData } from '../../hooks/useDashboardData';

export default function ApprovalsPage() {
  const { data: events = [] } = useEventsData();
  const { data: approvals = [] } = useApprovalsData();

  return (
    <div className="grid-layout">
      <Card title="Approval Timeline" subtitle="Faculty Advisor -> DoSA -> Facilities">
        <div className="timeline">
          {approvals.map((item: any) => (
            <article key={item.id} className="timeline-item">
              <div className="timeline-dot" />
              <div>
                <p className="timeline-title">{item.stage}</p>
                <p className="muted">{item.approver}</p>
                {item.comment && <p>{item.comment}</p>}
              </div>
              <Badge
                variant={
                  item.decision === 'APPROVED' ? 'success' : item.decision === 'REJECTED' ? 'danger' : 'warning'
                }
              >
                {item.decision}
              </Badge>
            </article>
          ))}
        </div>
      </Card>

      <Card title="Action Queue" subtitle="Approve or reject pending proposals">
        <ul className="list-compact">
          {events
            .filter((event: any) => event.status === 'PENDING' || event.status === 'IN_REVIEW')
            .map((event: any) => (
              <li key={event.id}>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.department}</p>
                </div>
                <div className="button-row">
                  <Button variant="secondary">Reject</Button>
                  <Button>Approve</Button>
                </div>
              </li>
            ))}
        </ul>
      </Card>
    </div>
  );
}
