import React from 'react'
import { useAuthStore } from '../store/authStore'

interface Props { roles: string[]; children: React.ReactNode }

export default function RoleGuard({ roles, children }: Props) {
  const { user } = useAuthStore();
  const ok = user ? roles.includes(user.role) : false;

  if (!ok) {
    return (
      <div className="card">
        <div className="card-header">
          <h3>Restricted Area</h3>
          <p>This view is available only for selected roles.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>
}
