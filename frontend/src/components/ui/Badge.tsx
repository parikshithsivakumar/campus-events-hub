import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
}

export default function Badge({ variant = 'neutral', children }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
