import { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useTasksData, useVolunteersData } from '../../hooks/useDashboardData';
import { useAuthStore } from '../../store/authStore';

const columns: Array<'TODO' | 'IN_PROGRESS' | 'DONE'> = ['TODO', 'IN_PROGRESS', 'DONE'];
const teams: Array<'Media' | 'Logistics' | 'Tech' | 'Hospitality'> = ['Media', 'Logistics', 'Tech', 'Hospitality'];
const priorities: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];

export default function TasksPage() {
  const { user } = useAuthStore();
  const { grouped, updateStatus, addTask, tasks } = useTasksData();
  const { data: volunteers = [] } = useVolunteersData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    team: 'Media' as const,
    assignee: '',
    priority: 'Medium' as const,
  });

  const isStudentOrganizer = user?.role === 'STUDENT_ORGANIZER';
  const isFacultyAdvisor = user?.role === 'FACULTY_ADVISOR';
  const isVolunteer = user?.role === 'VOLUNTEER';
  const canCreateTasks = isStudentOrganizer;

  // Both SO and Volunteers see all tasks - just different permissions
  const displayGrouped = grouped;
  const canUpdateStatus = isStudentOrganizer || isVolunteer;

  console.log(`📋 TasksPage - Role: ${user?.role}, canUpdateStatus: ${canUpdateStatus}, taskCount: ${displayGrouped?.TODO?.length || 0 + displayGrouped?.IN_PROGRESS?.length || 0 + displayGrouped?.DONE?.length || 0}`);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.assignee.trim()) {
      addTask(formData);
      setFormData({ title: '', team: 'Media', assignee: '', priority: 'Medium' });
      setShowAddForm(false);
    }
  };

  const getVolunteerName = (volunteerId: string) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    return volunteer?.name || volunteerId;
  };

  return (
    <div className="grid-layout">
      <Card title="Task Kanban" subtitle={isFacultyAdvisor ? "View team task progress" : "Volunteer and team execution board"}>
        {canCreateTasks && (
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
                <select
                  className="input"
                  value={formData.assignee}
                  onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                  required
                >
                  <option value="">Select volunteer to assign</option>
                  {volunteers.map(volunteer => (
                    <option key={volunteer.id} value={volunteer.id}>
                      {volunteer.name}
                    </option>
                  ))}
                </select>
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
                <span>{displayGrouped[column]?.length || 0}</span>
              </header>
              <div className="kanban-list">
                {displayGrouped[column]?.map(task => (
                  <article key={task.id} className="kanban-item">
                    <strong>{task.title}</strong>
                    <p>{task.team} • {getVolunteerName(task.assignee || task.assigneeId)}</p>
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
                      {canUpdateStatus && (
                        <select
                          className="input"
                          value={task.status}
                          onChange={event => {
                            const taskId = task.id || task._id;
                            console.log(`📝 Updating task: ${taskId} to ${event.target.value}`);
                            updateStatus(taskId, event.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE');
                          }}
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
