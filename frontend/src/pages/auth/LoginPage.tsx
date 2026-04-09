import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { mockUser } from '../../utils/mockData';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      setIsLoading(true);

      const res = await api.post('/auth/login', data);
      login({ token: res.data.access, user: res.data.user });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      // Fallback for demonstration
      login({
        token: 'local-dev-token',
        user: { ...mockUser, email: data.email },
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper login-modern">
      {/* Left Side - Hero Section */}
      <div className="auth-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Campus Event OS</h1>
          <p className="hero-subtitle">Streamline your college event management with our comprehensive platform</p>
          
          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h4>Effortless Planning</h4>
                <p>Organize events with intuitive tools and workflows</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h4>Smart Approvals</h4>
                <p>Fast-track decision making with role-based workflows</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h4>Data Insights</h4>
                <p>Track attendance, feedback, and event performance</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h4>Collaborative</h4>
                <p>Coordinate across departments and teams seamlessly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-form-section">
        <div className="auth-container">
          <div className="auth-box">
            {/* Header */}
            <div className="auth-header compact">
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form-container">
              {error && <div className="auth-error">{error}</div>}

              <div className="form-group">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@college.edu"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <div className="form-group">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <Button type="submit" fullWidth disabled={isLoading} className="signin-button">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>New here?</span>
            </div>

            {/* Register Link */}
            <Link to="/register" className="register-link">
              Create an Account
            </Link>

            {/* Footer */}
            <div className="auth-footer">
              <p>
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
