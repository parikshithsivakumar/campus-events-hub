import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { useTasksData } from '../../hooks/useDashboardData';

const columns: Array<'TODO' | 'IN_PROGRESS' | 'DONE'> = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function TasksPage() {
  const { grouped, updateStatus } = useTasksData();

  return (
    <div className="grid-layout">
      <Card title="Task Kanban" subtitle="Volunteer and team execution board">
        <div className="kanban">
          {columns.map(column => (
            <section key={column} className="kanban-col">
              <header>
                <h4>{column.replace('_', ' ')}</h4>
                <span>{grouped[column].length}</span>
              </header>
              <div className="kanban-list">
                {grouped[column].map(task => (
                  <article key={task.id} className="kanban-item">
                    <strong>{task.title}</strong>
                    <p>{task.team} • {task.assignee}</p>
                    <div className="kanban-meta">
                      <Badge
                        variant={
                          task.priority === 'High'
                            ? 'danger'
                            : task.priority === 'Medium'
                              ? 'warning'
                              : 'info'
                        }
                      >
                        {task.priority}
                      </Badge>
                      <select
                        className="input"
                        value={task.status}
                        onChange={event => updateStatus(task.id, event.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')}
                      >
                        {columns.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}
