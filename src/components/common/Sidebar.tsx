import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  Package, 
  BarChart3, 
  FileText, 
  Settings as SettingsIcon, 
  Sparkles, 
  ShieldAlert, 
  CalendarCheck, 
  UserCircle,
  Dumbbell
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  // Navigation Links based on RBAC rules
  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/members', label: 'Members', icon: Users },
    { to: '/trainers', label: 'Trainers', icon: UserCheck },
    { to: '/plans', label: 'Membership Plans', icon: CreditCard },
    { to: '/attendance', label: 'Attendance & QR', icon: CalendarCheck },
    { to: '/payments', label: 'Payments & Ledger', icon: CreditCard },
    { to: '/inventory', label: 'Pro Shop & Inventory', icon: Package },
    { to: '/analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { to: '/reports', label: 'Reports & Audits', icon: FileText },
    { to: '/settings', label: 'Gym Settings', icon: SettingsIcon },
  ];

  const trainerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/members', label: 'Assigned Clients', icon: Users },
    { to: '/attendance', label: 'Attendance Logs', icon: CalendarCheck },
    { to: '/analytics', label: 'Performance Metrics', icon: BarChart3 },
    { to: '/profile', label: 'My Trainer Profile', icon: UserCircle },
  ];

  const memberLinks = [
    { to: '/dashboard', label: 'My Member Hub', icon: LayoutDashboard },
    { to: '/attendance', label: 'My Check-in History', icon: CalendarCheck },
    { to: '/plans', label: 'My Plan & Upgrades', icon: CreditCard },
    { to: '/profile', label: 'Fitness Profile', icon: UserCircle },
  ];

  const links = role === 'admin' ? adminLinks : role === 'trainer' ? trainerLinks : memberLinks;

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Navigation Category Header */}
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3">
            Main Navigation ({role})
          </span>
          <nav className="mt-2 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* AI Assistant Quick Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 font-bold text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>FitCore AI Assistant</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Real-time gym capacity forecasts & personalized member workout retention recommendations.
          </p>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          System Operational
        </span>
        <span className="font-mono text-[10px]">v2.4.0</span>
      </div>
    </aside>
  );
};
