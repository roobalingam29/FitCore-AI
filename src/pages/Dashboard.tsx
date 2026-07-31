import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/Badge';
import { AIInsightModal } from '../components/common/AIInsightModal';
import { 
  Users, 
  DollarSign, 
  CalendarCheck, 
  Package, 
  Sparkles, 
  UserPlus, 
  QrCode, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Dashboard: React.FC = () => {
  const { members, attendance, payments, inventory, aiInsights, settings } = useGymData();
  const { role, user } = useAuth();
  const [showAIModal, setShowAIModal] = useState(false);

  // Computed metrics
  const activeMembersCount = members.filter(m => m.status === 'active').length;
  const totalRevenue = payments.reduce((acc, p) => p.status === 'paid' ? acc + p.amount : acc, 0);
  const todayCheckedIn = attendance.filter(a => a.status === 'checked_in').length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.minThreshold).length;

  // Chart dataset
  const revenueTrendData = [
    { month: 'Feb', revenue: 14200, checkIns: 1250 },
    { month: 'Mar', revenue: 16800, checkIns: 1420 },
    { month: 'Apr', revenue: 18500, checkIns: 1680 },
    { month: 'May', revenue: 21200, checkIns: 1890 },
    { month: 'Jun', revenue: 23900, checkIns: 2100 },
    { month: 'Jul', revenue: 27400, checkIns: 2450 },
  ];

  const peakHoursData = [
    { hour: '6 AM', count: 42 },
    { hour: '9 AM', count: 78 },
    { hour: '12 PM', count: 35 },
    { hour: '3 PM', count: 54 },
    { hour: '6 PM', count: 128 },
    { hour: '9 PM', count: 64 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            FitCore AI Gym System is running at <span className="text-cyan-400 font-semibold">{Math.round((todayCheckedIn / settings.capacityLimit) * 100)}% capacity</span> today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Gym Insights</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Gym Members"
          value={activeMembersCount}
          subtitle={`Total Registered: ${members.length}`}
          change="12.4% vs last mo"
          isPositive={true}
          icon={Users}
          iconColor="text-cyan-400 bg-cyan-500/10"
        />

        <StatCard
          title="Monthly Gross Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle={`${payments.length} Processed Payments`}
          change="18.2% growth"
          isPositive={true}
          icon={DollarSign}
          iconColor="text-emerald-400 bg-emerald-500/10"
        />

        <StatCard
          title="Live Checked-in Now"
          value={todayCheckedIn}
          subtitle={`Capacity Limit: ${settings.capacityLimit}`}
          badge={`${Math.round((todayCheckedIn / settings.capacityLimit) * 100)}% Full`}
          icon={CalendarCheck}
          iconColor="text-blue-400 bg-blue-500/10"
        />

        <StatCard
          title="Inventory Low Stock"
          value={lowStockItems}
          subtitle="Items below min threshold"
          change={lowStockItems > 0 ? "Action Needed" : "Stock Healthy"}
          isPositive={lowStockItems === 0}
          icon={Package}
          iconColor="text-amber-400 bg-amber-500/10"
        />
      </div>

      {/* Featured AI Insight Banner */}
      {aiInsights.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              FitCore AI Intelligence Recommendation
            </span>
            <StatusBadge status={aiInsights[0].impact} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-100">{aiInsights[0].title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aiInsights[0].summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            {aiInsights[0].actionableSteps?.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Revenue & Membership Trajectory</h3>
              <p className="text-xs text-slate-400">Monthly gross income performance (USD)</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              +18.2% YOY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#38bdf8', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today Peak Gym Floor Occupancy */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Peak Hour Check-in Density</h3>
            <p className="text-xs text-slate-400">Gym floor capacity distribution by hour</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#38bdf8', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Ledger */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Live Gym Floor Check-in Feed</h3>
        <div className="divide-y divide-slate-800/60 overflow-x-auto">
          {attendance.slice(0, 5).map((att) => (
            <div key={att.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400">
                  {att.memberName.charAt(0)}
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block">{att.memberName}</span>
                  <span className="text-[10px] text-slate-400">{att.memberCode} • {att.planName}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-mono text-[11px]">
                  {new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <StatusBadge status={att.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIInsightModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
    </div>
  );
};
