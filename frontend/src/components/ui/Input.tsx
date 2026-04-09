import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', ...props },
  ref,
) {
  return (
    <label className="field">
      <span>{label}</span>
      <input ref={ref} className={`input ${className}`.trim()} {...props} />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
});

export default Input;
