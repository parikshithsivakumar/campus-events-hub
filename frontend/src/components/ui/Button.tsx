import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
