import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const allLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/events', label: 'Events' },
  { to: '/approvals', label: 'Approvals', studentLabel: 'Proposed Events' },
  { to: '/venues', label: 'Venues' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/reports', label: 'Reports' },
];

// Role-based navigation access
const roleNavigation: Record<string, string[]> = {
  SUPER_ADMIN: ['Dashboard', 'Events', 'Approvals', 'Venues', 'Tasks', 'Reports'],
  COLLEGE_ADMIN: ['Dashboard', 'Events', 'Approvals', 'Venues', 'Tasks', 'Reports'],
  FACULTY_ADVISOR: ['Dashboard', 'Approvals', 'Events', 'Reports'],
  STUDENT_ORGANIZER: ['Dashboard', 'Events', 'Proposed Events', 'Tasks', 'Reports'],
  VOLUNTEER: ['Dashboard', 'Tasks', 'Events'],
  DEPARTMENT_APPROVER: ['Dashboard', 'Events', 'Approvals', 'Reports'],
};

export default function AppShell() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Filter navigation links based on user role
  const userRole = user?.role || 'STUDENT_ORGANIZER';
  const allowedNavItems = roleNavigation[userRole] || [];
  const filteredLinks = allLinks
    .filter(link => {
      const labelToUse = userRole === 'STUDENT_ORGANIZER' && link.studentLabel ? link.studentLabel : link.label;
      return allowedNavItems.includes(labelToUse);
    })
    .map(link => ({
      ...link,
      displayLabel: userRole === 'STUDENT_ORGANIZER' && link.studentLabel ? link.studentLabel : link.label,
    }));

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <div>
          <p className="brand-sub">Multi-tenant SaaS</p>
          <h1 className="brand-main">Campus Event OS</h1>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          {filteredLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              {link.displayLabel}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="current-user">
            <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role?.replace(/_/g, ' ') || 'Member'}</div>
            </div>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-full">
            Sign out
          </button>
        </div>
      </aside>

      <section className="content-shell">
        <header className="topbar">
          <div>
            <h2>{filteredLinks.find(link => link.to === location.pathname)?.displayLabel || 'Overview'}</h2>
            <p>{user?.name} • {user?.email}</p>
          </div>
          <span className="badge badge-info">{user?.role?.replace(/_/g, ' ')}</span>
        </header>

        <main className="page">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
