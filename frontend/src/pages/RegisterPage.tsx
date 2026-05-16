import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Must contain uppercase, lowercase, and a number'
    ),
  role: z.union([z.literal('admin'), z.literal('sales')]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'sales' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authApi.register(data);
      if (response.success && response.data) {
        login(response.data.token, response.data.user);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden selection:bg-primary-500/30">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-3xl font-black font-display text-gray-900 dark:text-white tracking-tight hover:scale-105 transition-transform duration-300">GigFlow</h1>
          </Link>
          <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-[15px]">Join GigFlow today</p>
        </div>

        <div className="glass rounded-2xl p-8 sm:p-10 animate-slide-up">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="register-form">
            <div>
              <label htmlFor="reg-name" className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                className="form-input"
                {...register('name')}
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="form-label">Email Address</label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="form-input"
                {...register('email')}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="form-input pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                  id="reg-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-role" className="form-label">Role</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <select id="reg-role" className="form-input" {...field}>
                    <option value="sales">Sales User</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5"
              id="register-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline" id="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
