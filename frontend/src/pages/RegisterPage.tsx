import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User, Mail, Lock, Briefcase, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Aurora from '../components/ui/Aurora';

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
  const { theme } = useTheme();
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden selection:bg-primary-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 h-screen overflow-hidden -z-20 pointer-events-none bg-gray-950">
        <Aurora
          colorStops={theme === 'dark' ? ["#5227FF", "#FF2975", "#5227FF"] : ["#7cff67","#B497CF","#5227FF"]}
          blend={0.6}
          amplitude={1.5}
          speed={0.8}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950" />
      </div>

      <div className="w-full max-w-lg relative z-10 my-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/20 dark:border-white/5">
              <span className="text-3xl font-black text-primary-600 italic">G</span>
            </div>
            <h1 className="text-4xl font-black font-display text-white tracking-tight">GigFlow</h1>
          </Link>
        </div>

        {/* Register Card */}
        <div className="glass-card bg-white/10 dark:bg-gray-900/40 border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold font-display text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-400 font-medium">Join 1,000+ teams managing leads with GigFlow.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="register-form">
            <div className="space-y-2">
              <label htmlFor="reg-name" className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  {...register('name')}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-email" className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-password" className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-role" className="text-sm font-bold text-gray-300 uppercase tracking-widest ml-1">Business Role</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors pointer-events-none">
                  <Briefcase className="w-5 h-5" />
                </div>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <select 
                      id="reg-role" 
                      className="w-full bg-white/5 border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                      {...field}
                    >
                      <option value="sales" className="bg-gray-900">Sales Representative</option>
                      <option value="admin" className="bg-gray-900">System Administrator</option>
                    </select>
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.5)] transition-all flex items-center justify-center gap-3 group"
              id="register-submit-btn"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-black transition-colors" id="login-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
