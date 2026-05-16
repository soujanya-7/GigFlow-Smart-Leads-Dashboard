import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, TrendingUp, Target, AlertCircle, ArrowRight, Activity, 
  Calendar, CheckCircle2, Clock, Plus, Download, Filter, Search 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { leadsApi } from '../api/leads';
import { LeadStats } from '../types';
import Header from '../components/layout/Header';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/StateViews';
import Modal from '../components/ui/Modal';
import LeadForm from '../components/leads/LeadForm';

// Mock data for charts
const chartData = [
  { name: 'Mon', leads: 4, qualified: 2 },
  { name: 'Tue', leads: 7, qualified: 3 },
  { name: 'Wed', leads: 5, qualified: 4 },
  { name: 'Thu', leads: 11, qualified: 6 },
  { name: 'Fri', leads: 8, qualified: 5 },
  { name: 'Sat', leads: 14, qualified: 9 },
  { name: 'Sun', leads: 19, qualified: 12 },
];

const sourceData = [
  { name: 'Website', value: 45, color: '#8b5cf6' },
  { name: 'LinkedIn', value: 30, color: '#3b82f6' },
  { name: 'Email', value: 15, color: '#ec4899' },
  { name: 'Referral', value: 10, color: '#10b981' },
];

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor, trend, isPositive }) => (
  <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${color} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{value}</h3>
    </div>
    {/* Decorative background icon */}
    <div className={`absolute -right-4 -bottom-4 opacity-5 ${color} transform scale-150 group-hover:scale-175 transition-transform duration-700`}>
      {icon}
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: statsData, isLoading: isLoadingStats, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: leadsApi.getStats,
  });

  const { data: leadsData, isLoading: isLoadingLeads, refetch: refetchLeads } = useQuery({
    queryKey: ['recent-leads'],
    queryFn: () => leadsApi.getLeads({ page: 1, limit: 6 }),
  });

  const stats: LeadStats | undefined = statsData?.data;
  const recentLeads = leadsData?.data || [];

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refetchStats();
    refetchLeads();
  };

  if (statsError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <ErrorState message="Failed to load dashboard statistics" onRetry={refetchStats} />
      </div>
    );
  }

  const getStatusPercent = (status: string) => {
    if (!stats || !stats.total) return 0;
    return Math.round(((stats.byStatus[status as keyof typeof stats.byStatus] || 0) / stats.total) * 100);
  };

  return (
    <div className="pb-12 px-4 sm:px-6 animate-fade-in">
      <Header 
        title="Dashboard Overview" 
        subtitle="Real-time analytics and lead management insights" 
      />

      <div className="space-y-8 mt-8">
        {/* Top Banner / Welcome Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-8 sm:p-12 text-white shadow-2xl shadow-primary-500/20 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6">
                Active Workspace
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight mb-4 leading-tight">
                Welcome back to <span className="text-primary-200">GigFlow!</span> 👋
              </h2>
              <p className="text-primary-100 text-lg max-w-xl leading-relaxed">
                You have <span className="font-black text-white">{stats?.byStatus?.New || 0} new leads</span> waiting to be processed today. Your qualified lead conversion is up <span className="font-black text-white">12%</span> this week.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 shrink-0">
              <Link to="/leads" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-black shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                Manage Leads <ArrowRight className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add New
              </button>
            </div>
          </div>
        </div>

        {/* Modal for adding new lead */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Prospect"
          size="md"
        >
          <LeadForm 
            onSuccess={handleAddSuccess}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingStats ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Total Pipeline"
                value={stats?.total || 0}
                icon={<Activity className="w-6 h-6" />}
                color="text-blue-500"
                bgColor="bg-blue-500/10"
                trend="+12.5%"
                isPositive={true}
              />
              <StatCard
                title="Highly Qualified"
                value={stats?.byStatus?.Qualified || 0}
                icon={<TrendingUp className="w-6 h-6" />}
                color="text-emerald-500"
                bgColor="bg-emerald-500/10"
                trend="+8.2%"
                isPositive={true}
              />
              <StatCard
                title="Needs Contact"
                value={stats?.byStatus?.New || 0}
                icon={<Clock className="w-6 h-6" />}
                color="text-amber-500"
                bgColor="bg-amber-500/10"
                trend="Action Required"
              />
              <StatCard
                title="Revenue Opportunity"
                value={`$${(stats?.total || 0) * 1250}`}
                icon={<CheckCircle2 className="w-6 h-6" />}
                color="text-primary-500"
                bgColor="bg-primary-500/10"
                trend="+15%"
                isPositive={true}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Analytics Chart */}
          <div className="lg:col-span-8 glass-card p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Lead Performance</h3>
                <p className="text-gray-500 font-medium">Daily lead generation and qualification</p>
              </div>
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button className="px-4 py-2 bg-white dark:bg-gray-700 shadow-sm rounded-lg text-xs font-black">7 Days</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-black transition-colors">30 Days</button>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }} 
                    dy={15} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorLeads)" />
                  <Area type="monotone" dataKey="qualified" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorQual)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Status & Source Breakdown */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Status Breakdown */}
            <div className="glass-card p-8 flex-1">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">Pipeline Health</h3>
              <div className="space-y-6">
                {(['New', 'Contacted', 'Qualified', 'Lost'] as const).map((status) => {
                  const percent = getStatusPercent(status);
                  const colors = { 
                    New: 'bg-blue-500', 
                    Contacted: 'bg-amber-500', 
                    Qualified: 'bg-emerald-500', 
                    Lost: 'bg-rose-500' 
                  };
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">{status}</span>
                        <span className="font-black text-gray-900 dark:text-white">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800/50 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`${colors[status]} h-full rounded-full transition-all duration-1000 ease-out shadow-sm`} 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Source Distribution */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Top Channels</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} layout="vertical" margin={{ left: -30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Leads Activity Feed */}
          <div className="lg:col-span-12 glass-card overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Active Pipeline</h3>
                <p className="text-gray-500 font-medium">Detailed view of your most recent prospects</p>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
                <button className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-primary-500 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 text-[11px] uppercase tracking-[0.2em]">
                    <th className="px-8 py-5 font-black">Lead Profile</th>
                    <th className="px-8 py-5 font-black">Current Status</th>
                    <th className="px-8 py-5 font-black">Channel Source</th>
                    <th className="px-8 py-5 font-black">Arrival Date</th>
                    <th className="px-8 py-5 font-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
                  {isLoadingLeads ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-8 py-6"><div className="skeleton h-10 w-48 rounded-xl" /></td>
                        <td className="px-8 py-6"><div className="skeleton h-8 w-24 rounded-lg" /></td>
                        <td className="px-8 py-6"><div className="skeleton h-5 w-28 rounded" /></td>
                        <td className="px-8 py-6"><div className="skeleton h-5 w-24 rounded" /></td>
                        <td className="px-8 py-6"><div className="skeleton h-5 w-8 rounded" /></td>
                      </tr>
                    ))
                  ) : recentLeads.length > 0 ? (
                    recentLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white font-black shadow-lg">
                              {lead.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{lead.name}</p>
                              <p className="text-xs text-gray-500 font-medium">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black tracking-tight ${
                            lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                            lead.status === 'Contacted' ? 'bg-amber-500/10 text-amber-500' :
                            lead.status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-500' :
                            'bg-rose-500/10 text-rose-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              lead.status === 'New' ? 'bg-blue-500' :
                              lead.status === 'Contacted' ? 'bg-amber-500' :
                              lead.status === 'Qualified' ? 'bg-emerald-500' :
                              'bg-rose-500'
                            }`} />
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-bold">
                            <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                            {lead.source}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-gray-500 font-medium">
                          {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-6">
                          <button className="text-gray-400 hover:text-primary-500 transition-colors font-black">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <Target className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-bold">No leads found in your pipeline.</p>
                          <Link to="/leads" className="text-primary-500 font-black hover:underline">Start capturing leads</Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50/50 dark:bg-gray-800/30 flex justify-center">
              <Link to="/leads" className="text-sm font-black text-primary-500 hover:text-primary-600 flex items-center gap-2 transition-all hover:gap-3">
                See Comprehensive Lead Inventory <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
