import { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useTasksData } from '../../hooks/useDashboardData';
import { useAuthStore } from '../../store/authStore';

const columns: Array<'TODO' | 'IN_PROGRESS' | 'DONE'> = ['TODO', 'IN_PROGRESS', 'DONE'];
const teams: Array<'Media' | 'Logistics' | 'Tech' | 'Hospitality'> = ['Media', 'Logistics', 'Tech', 'Hospitality'];
const priorities: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];

export default function TasksPage() {
  const { user } = useAuthStore();
  const { grouped, updateStatus, addTask } = useTasksData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    team: 'Media' as const,
    assignee: '',
    priority: 'Medium' as const,
  });

  const isStudentOrganizer = user?.role === 'STUDENT_ORGANIZER';

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.assignee.trim()) {
      addTask(formData);
      setFormData({ title: '', team: 'Media', assignee: '', priority: 'Medium' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="grid-layout">
      <Card title="Task Kanban" subtitle="Volunteer and team execution board">
        {isStudentOrganizer && (
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
            {!showAddForm ? (
              <Button onClick={() => setShowAddForm(true)}>+ Add Task</Button>
            ) : (
              <form onSubmit={handleAddTask} style={{ display: 'grid', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <select
                    className="input"
                    value={formData.team}
                    onChange={e => setFormData({ ...formData, team: e.target.value as any })}
                  >
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                  <select
                    className="input"
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  className="input"
                  placeholder="Assign to"
                  value={formData.assignee}
                  onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Button type="submit">Create Task</Button>
                  <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        )}
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
                      {isStudentOrganizer && (
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
                      )}
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
