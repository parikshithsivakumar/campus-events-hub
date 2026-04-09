import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, subtitle, children, className = '' }: CardProps) {
  return (
    <article className={`card ${className}`}>
      {(title || subtitle) && (
        <header className="card-header">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </header>
      )}
      {children}
    </article>
  );
}
