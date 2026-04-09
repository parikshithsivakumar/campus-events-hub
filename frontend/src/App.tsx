import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import EventsPage from './pages/events/EventsPage'
import ApprovalsPage from './pages/approvals/ApprovalsPage'
import VenuesPage from './pages/venues/VenuesPage'
import TasksPage from './pages/tasks/TasksPage'
import ReportsPage from './pages/reports/ReportsPage'
import AppShell from './components/layout/AppShell'
import { useAuthStore } from './store/authStore'

function ProtectedRoutes() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoutes />}>
        <Route index element={<DashboardPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="venues" element={<VenuesPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
