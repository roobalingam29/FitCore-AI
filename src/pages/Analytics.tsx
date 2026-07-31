import React from 'react';
import { useGymData } from '../context/GymDataContext';
import { BarChart3, TrendingUp, Users, DollarSign, PieChart as PieIcon, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const Analytics: React.FC = () => {
  const { members, plans, payments } = useGymData();

  // Demographic breakdown
  const genderDistribution = [
    { name: 'Male', value: members.filter(m => m.gender === 'male').length, color: '#06b6d4' },
    { name: 'Female', value: members.filter(m => m.gender === 'female').length, color: '#ec4899' },
    { name: 'Other', value: members.filter(m => m.gender === 'other').length, color: '#a855f7' },
  ];

  // Plan distribution
  const planDistribution = plans.map(p => ({
    name: p.name,
    count: p.activeMembersCount,
  }));

  const churnTrendData = [
    { month: 'Jan', churnRate: 3.2 },
    { month: 'Feb', churnRate: 2.8 },
    { month: 'Mar', churnRate: 2.4 },
    { month: 'Apr', churnRate: 2.1 },
    { month: 'May', churnRate: 1.9 },
    { month: 'Jun', churnRate: 1.5 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Gym Analytics & Business Intelligence
        </h1>
        <p className="text-xs text-slate-400">Deep performance indicators, retention cohorts, demographic distributions, and financial projections.</p>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Tier Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Membership Subscription Tier Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#38bdf8', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Reduction Trajectory */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Member Churn Rate Trajectory (%)</h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Down to 1.5%
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={churnTrendData}>
                <defs>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#34d399', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="churnRate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorChurn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
