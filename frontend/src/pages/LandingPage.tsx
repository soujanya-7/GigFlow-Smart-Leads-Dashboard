import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Filter, ArrowRight, ShieldCheck, Download, Sun, Moon, Target, BarChart, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background selection:bg-primary-500/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 relative z-10 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black font-display text-gray-900 dark:text-white tracking-tight">
            GigFlow
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary px-6 py-2 rounded-full shadow-lg hover:shadow-primary-500/50">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary px-6 py-2 rounded-full shadow-lg hover:shadow-primary-500/50">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-display text-gray-900 dark:text-white mb-6 animate-fade-in-up">
            Manage Your Leads with{' '}
            <span className="text-gradient">Ultimate Precision</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            A powerful, modern CRM dashboard designed to streamline your gig workflow, scale your outreach, and deliver an incredible user experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3.5 w-full sm:w-auto rounded-full">
                Enter Dashboard <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            ) : (
              <Link to="/register" className="btn-primary text-lg px-8 py-3.5 w-full sm:w-auto rounded-full shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50">
                Start Managing Now
              </Link>
            )}
          </div>
        </div>

        {/* Mockup Preview */}
        <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 rounded-2xl" />
          <div className="glass rounded-2xl p-2 md:p-4 shadow-2xl border border-gray-200/50 dark:border-gray-800/50 animate-float-slow">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-800 hover:scale-[1.02] transition-transform duration-700 ease-in-out cursor-pointer">
              <div className="h-10 bg-gray-200 dark:bg-gray-950 flex items-center px-4 gap-2 border-b border-gray-300 dark:border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors" />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80" 
                alt="GigFlow Dashboard Preview" 
                className="w-full h-auto opacity-90 mix-blend-luminosity dark:mix-blend-normal hover:mix-blend-normal transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </main>

      {/* How it Works Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
              How GigFlow Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A streamlined process designed to help you close more deals, faster.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 group cursor-default">
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-primary-500/30">
                <Target className="w-8 h-8 group-hover:animate-pulse-soft" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Capture</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Centralize all your leads from various sources into one unified dashboard automatically.
              </p>
            </div>
            <div className="text-center p-6 group cursor-default">
              <div className="w-16 h-16 mx-auto bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-accent-500/30">
                <Filter className="w-8 h-8 group-hover:animate-pulse-soft" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Qualify</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Filter, sort, and prioritize your prospects instantly to focus on high-value opportunities.
              </p>
            </div>
            <div className="text-center p-6 group cursor-default">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-blue-500/30">
                <BarChart className="w-8 h-8 group-hover:animate-pulse-soft" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Convert</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track statuses, manage sales performance, and convert more leads into successful gigs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white/50 dark:bg-gray-900/20 border-t border-gray-200/50 dark:border-gray-800/50 py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built with clean architecture, scalable code practices, and a world-class user interface.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-primary-500 group-hover:animate-spin-slow" />}
              title="Secure Authentication"
              description="JWT-based authentication with bcrypt hashing and Role-Based Access Control (RBAC) for Admins & Sales."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-accent-500 group-hover:animate-pulse-soft" />}
              title="Team Management"
              description="Easily onboard new sales representatives and manage team permissions within the unified admin portal."
            />
            <FeatureCard 
              icon={<Download className="w-6 h-6 text-blue-500 group-hover:animate-float" />}
              title="Data Export"
              description="Generate insightful statistics and export your filtered lead datasets directly to CSV format with one click."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400 relative z-10 bg-background">
        &copy; {new Date().getFullYear()} GigFlow. All rights reserved.
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="card p-8 group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/20 cursor-default">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-gray-100 dark:border-gray-700">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default LandingPage;
