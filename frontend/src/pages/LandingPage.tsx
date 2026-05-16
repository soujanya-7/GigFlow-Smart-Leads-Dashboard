import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Filter, ArrowRight, ShieldCheck, Download, Sun, Moon, Target, BarChart, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import Aurora from '../components/ui/Aurora';
import ScrollFloat from '../components/ui/ScrollFloat';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen selection:bg-primary-500/30 overflow-hidden relative">
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
          <ScrollFloat
            animationDuration={1.2}
            ease='expo.out'
            scrollStart='top 80%'
            scrollEnd='top 20%'
            stagger={0.02}
            containerClassName="mb-8"
            textClassName="text-4xl md:text-7xl font-black font-display text-gray-900 dark:text-white leading-[1.1]"
            as="h1"
          >
            Manage Your Leads with Ultimate Precision
          </ScrollFloat>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            The all-in-one workspace for modern sales teams. Streamline your gig workflow, automate lead tracking, and close deals with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-xl px-10 py-4 w-full sm:w-auto rounded-full group">
                Enter Dashboard <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link to="/register" className="btn-primary text-xl px-10 py-4 w-full sm:w-auto rounded-full shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300">
                Start for Free
              </Link>
            )}
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold text-lg px-8 py-4 transition-colors">
              Explore Features
            </a>
          </div>
        </div>

        {/* Mockup Preview */}
        <div className="mt-24 relative max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 blur-2xl -z-10 rounded-3xl" />
          <div className="glass rounded-3xl p-3 md:p-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] border border-white/20 dark:border-white/5">
            <div className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 group cursor-pointer relative">
              <div className="h-12 bg-gray-50 dark:bg-gray-900/50 flex items-center px-6 gap-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400/80 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/80 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400/80 shadow-sm" />
                </div>
                <div className="flex-1 text-center pr-10">
                  <span className="text-xs font-medium text-gray-400 font-mono">dashboard.gigflow.io</span>
                </div>
              </div>
              <div className="relative group overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80" 
                  alt="GigFlow Dashboard Preview" 
                  className="w-full h-auto opacity-95 group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trusted By / Tech Stack */}
      <section className="py-20 border-y border-gray-200/50 dark:border-gray-800/50 relative z-10 bg-white/5 dark:bg-black/5">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-12">
            Built with World-Class Technology
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#61DAFB] rounded-lg" />
              <span className="text-xl font-black text-gray-700 dark:text-gray-300">REACT</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3178C6] rounded-lg" />
              <span className="text-xl font-black text-gray-700 dark:text-gray-300">TYPESCRIPT</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00ED64] rounded-lg" />
              <span className="text-xl font-black text-gray-700 dark:text-gray-300">MONGODB</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#38B2AC] rounded-lg" />
              <span className="text-xl font-black text-gray-700 dark:text-gray-300">TAILWIND</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-black text-primary-600 dark:text-primary-400 font-display">10K+</div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">Leads Managed</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-accent-600 dark:text-accent-400 font-display">99.9%</div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">Uptime Guarantee</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-blue-600 dark:text-blue-400 font-display">24/7</div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">Smart Monitoring</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-purple-600 dark:text-purple-400 font-display">150+</div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">Global Teams</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 relative z-10 bg-gray-50/50 dark:bg-gray-900/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-6">
              Three Steps to <span className="text-gradient">Total Control</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We've simplified the complex sales lifecycle into a seamless, automated process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
            <StepCard 
              number="01"
              icon={<Target className="w-10 h-10" />}
              title="Centralized Capture"
              description="Connect your website, social platforms, and emails. GigFlow pulls every prospect into a single, clean interface automatically."
              color="primary"
            />
            <StepCard 
              number="02"
              icon={<Filter className="w-10 h-10" />}
              title="Smart Qualification"
              description="Our AI-powered filters help you identify the hottest leads instantly, so your sales team never wastes a second."
              color="accent"
            />
            <StepCard 
              number="03"
              icon={<BarChart className="w-10 h-10" />}
              title="Insightful Growth"
              description="Track conversion rates, team performance, and revenue growth with beautiful, real-time analytics dashboards."
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-6">
              Everything you need to <span className="text-gradient">Scale Fast</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-8 max-w-6xl mx-auto h-auto md:h-[600px]">
            <div className="md:col-span-3 md:row-span-2 glass-card p-10 flex flex-col justify-between group overflow-hidden">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Your data is protected with industry-standard JWT authentication and BCrypt hashing. Rest easy knowing your leads are safe and secure.
                </p>
              </div>
              <div className="mt-8 flex gap-4 flex-wrap">
                <span className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full text-sm font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">RBAC Controls</span>
                <span className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full text-sm font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">HTTPS Encrypted</span>
              </div>
            </div>

            <div className="md:col-span-3 glass-card p-10 group">
              <div className="flex items-start gap-8">
                <div className="w-14 h-14 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Team Management</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Onboard sales reps, assign roles, and track individual performance with ease.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 glass-card p-10 group">
              <div className="flex items-start gap-8">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Download className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Export Anywhere</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Export your lead lists and analytics reports to CSV or PDF with a single click.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative z-10 bg-white/50 dark:bg-gray-900/20 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-6">
              Pricing that <span className="text-gradient">Grows with You</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              name="Starter"
              price="0"
              features={["Up to 100 Leads", "Basic Analytics", "1 Team Member", "Email Support"]}
            />
            <PricingCard 
              name="Professional"
              price="49"
              featured={true}
              features={["Unlimited Leads", "Advanced Insights", "5 Team Members", "Priority Support", "CSV Exports"]}
            />
            <PricingCard 
              name="Enterprise"
              price="99"
              features={["Custom CRM Sync", "Dedicated Manager", "Unlimited Members", "API Access", "Custom Roles"]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black font-display text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <FaqItem 
              question="How easy is it to migrate from my current CRM?"
              answer="Incredibly easy. We support one-click CSV imports and offer free migration assistance for our Professional and Enterprise plans."
            />
            <FaqItem 
              question="Is my data secure on GigFlow?"
              answer="Absolutely. We use enterprise-grade encryption and secure authentication protocols to ensure your data remains private and protected."
            />
            <FaqItem 
              question="Can I cancel my subscription anytime?"
              answer="Yes, GigFlow is a month-to-month service with no long-term contracts. You can upgrade, downgrade, or cancel at any time."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="glass-card bg-primary-600 dark:bg-primary-900/40 p-12 md:p-24 text-center rounded-[3rem] border-none shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.3)]">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to transform your sales?</h2>
            <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
              Join 1,000+ sales teams already using GigFlow to manage their leads with precision.
            </p>
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 text-2xl font-bold px-12 py-5 rounded-full transition-all inline-flex items-center gap-3">
              Get Started for Free <ArrowRight className="w-7 h-7" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 pt-24 pb-12 relative z-10 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
            <div className="col-span-2 md:col-span-1 space-y-6">
              <span className="text-2xl font-black font-display text-gray-900 dark:text-white">GigFlow</span>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Empowering modern sales teams with the precision they deserve. Built for growth, designed for speed.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Product</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><a href="#features" className="hover:text-primary-500 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary-500 transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-primary-500 transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Social</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary-500 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div>&copy; {new Date().getFullYear()} GigFlow. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard: React.FC<{number: string, icon: React.ReactNode, title: string, description: string, color: 'primary' | 'accent' | 'blue'}> = ({ number, icon, title, description, color }) => {
  const colorClasses = {
    primary: "text-primary-600 dark:text-primary-400",
    accent: "text-accent-600 dark:text-accent-400",
    blue: "text-blue-600 dark:text-blue-400"
  };
  return (
    <div className="relative group p-10 glass-card bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 hover:-translate-y-4 transition-all duration-500">
      <div className="absolute -top-6 -left-6 text-6xl font-black text-gray-100 dark:text-gray-800 group-hover:text-primary-500/10 transition-colors -z-10">{number}</div>
      <div className={`mb-8 ${colorClasses[color]} group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
        {description}
      </p>
    </div>
  );
};

const PricingCard: React.FC<{name: string, price: string, features: string[], featured?: boolean}> = ({ name, price, features, featured }) => (
  <div className={`p-10 rounded-[2.5rem] flex flex-col h-full transition-all duration-500 hover:-translate-y-2 ${featured ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 scale-105 shadow-2xl' : 'glass-card border border-gray-200 dark:border-gray-800 shadow-xl'}`}>
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 opacity-80 uppercase tracking-widest">{name}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black font-display">${price}</span>
        <span className="text-lg opacity-60">/mo</span>
      </div>
    </div>
    <ul className="space-y-4 mb-10 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3">
          <ShieldCheck className={`w-5 h-5 ${featured ? 'text-primary-400 dark:text-primary-600' : 'text-primary-500'}`} />
          <span className="font-medium">{f}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${featured ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
      Choose {name}
    </button>
  </div>
);

const FaqItem: React.FC<{question: string, answer: string}> = ({ question, answer }) => (
  <div className="glass-card p-8 group cursor-pointer hover:bg-white dark:hover:bg-gray-900/60 transition-all border border-gray-200 dark:border-gray-800">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-500 transition-colors flex items-center justify-between">
      {question}
      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
    </h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{answer}</p>
  </div>
);

export default LandingPage;
