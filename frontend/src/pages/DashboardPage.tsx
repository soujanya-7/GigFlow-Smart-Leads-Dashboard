import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, Target, AlertCircle, ArrowRight, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { leadsApi } from '../api/leads';
import { LeadStats } from '../types';
import Header from '../components/layout/Header';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/StateViews';

// Mock data for the AreaChart to make the dashboard look premium
const chartData = [
  { name: 'Mon', leads: 4 },
  { name: 'Tue', leads: 7 },
  { name: 'Wed', leads: 5 },
  { name: 'Thu', leads: 11 },
  { name: 'Fri', leads: 8 },
  { name: 'Sat', leads: 14 },
  { name: 'Sun', leads: 19 },
];

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor, subtitle, trend }) => (
  <div className="card p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform group-hover:scale-110">
      <div className={color}>{icon}</div>
    </div>
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0 shadow-inner`}>
        <div className={color}>{icon}</div>
      </div>
      <div className="flex-1 min-w-0 z-10">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-black font-display text-gray-900 dark:text-white tracking-tight">{value}</p>
          {trend && <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">{trend}</span>}
        </div>
        {subtitle && <p className="text-sm text-gray-400 mt-2">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { data: statsData, isLoading: isLoadingStats, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: leadsApi.getStats,
  });

  const { data: leadsData, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['recent-leads'],
    queryFn: () => leadsApi.getLeads({ page: 1, limit: 5 }),
  });

  const stats: LeadStats | undefined = statsData?.data;
  const recentLeads = leadsData?.data || [];

  if (statsError) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Overview of your pipeline" />
        <div className="p-6">
          <ErrorState message="Failed to load dashboard statistics" onRetry={refetchStats} />
        </div>
      </div>
    );
  }

  const getStatusPercent = (status: string) => {
    if (!stats || !stats.total) return 0;
    return Math.round(((stats.byStatus[status as keyof typeof stats.byStatus] || 0) / stats.total) * 100);
  };

  return (
    <div className="pb-12">
      <Header title="Dashboard" subtitle="Overview of your pipeline and recent activities" />

      <div className="p-6 space-y-6 animate-fade-in-up">
        {/* Quick Actions & Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-primary-500/20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight mb-2">Welcome back to GigFlow! 👋</h2>
            <p className="text-primary-100 max-w-xl">You have {stats?.byStatus?.New || 0} new leads waiting to be processed. Check your performance and recent activities below.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/leads" className="bg-white/10 hover:bg-white/20 text-white border-0 px-6 py-2.5 rounded-xl font-medium transition-all backdrop-blur-sm flex items-center gap-2">
              View All Leads <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingStats ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Total Leads"
                value={stats?.total || 0}
                icon={<Users className="w-6 h-6" />}
                color="text-primary-600"
                bgColor="bg-primary-50 dark:bg-primary-900/20"
                trend="+12%"
              />
              <StatCard
                title="Qualified"
                value={stats?.byStatus?.Qualified || 0}
                icon={<TrendingUp className="w-6 h-6" />}
                color="text-green-600"
                bgColor="bg-green-50 dark:bg-green-900/20"
                subtitle={`${getStatusPercent('Qualified')}% conversion`}
              />
              <StatCard
                title="New Leads"
                value={stats?.byStatus?.New || 0}
                icon={<Target className="w-6 h-6" />}
                color="text-blue-600"
                bgColor="bg-blue-50 dark:bg-blue-900/20"
                trend="+5%"
              />
              <StatCard
                title="Lost Deals"
                value={stats?.byStatus?.Lost || 0}
                icon={<AlertCircle className="w-6 h-6" />}
                color="text-red-500"
                bgColor="bg-red-50 dark:bg-red-900/20"
                subtitle="Needs attention"
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" />
                Lead Generation Over Time
              </h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderRadius: '12px', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-5">
                Leads by Status
              </h3>
              {isLoadingStats ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-8 rounded" />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {(['New', 'Contacted', 'Qualified', 'Lost'] as const).map((status) => {
                    const count = stats?.byStatus?.[status] || 0;
                    const percent = getStatusPercent(status);
                    const colors = { New: 'bg-blue-500', Contacted: 'bg-yellow-500', Qualified: 'bg-green-500', Lost: 'bg-red-500' };
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{status}</span>
                          <span className="font-bold text-gray-900 dark:text-white">{count} <span className="text-gray-400 font-normal">({percent}%)</span></span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                          <div className={`${colors[status]} h-2 rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Leads Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-500" />
              Recent Leads
            </h3>
            <Link to="/leads" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {isLoadingLeads ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="skeleton h-5 w-32 rounded" /></td>
                      <td className="px-6 py-4"><div className="skeleton h-5 w-20 rounded" /></td>
                      <td className="px-6 py-4"><div className="skeleton h-5 w-24 rounded" /></td>
                      <td className="px-6 py-4"><div className="skeleton h-5 w-24 rounded" /></td>
                    </tr>
                  ))
                ) : recentLeads.length > 0 ? (
                  recentLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          lead.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                          lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' :
                          lead.status === 'Qualified' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                          'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {lead.source}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No recent leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
