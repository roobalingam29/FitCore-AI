import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Dumbbell, ShieldCheck, User, UserCheck, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@fitcore.ai');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(role, email);
    navigate('/dashboard');
  };

  const selectDemoRole = async (demoRole: UserRole, demoEmail: string) => {
    setRole(demoRole);
    setEmail(demoEmail);
    await login(demoRole, demoEmail);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-xl shadow-cyan-500/20">
            <Dumbbell className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">FitCore AI</h1>
          <p className="text-xs text-slate-400">Enterprise Smart Gym Management System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { r: 'admin', icon: ShieldCheck, label: 'Admin' },
                { r: 'trainer', icon: UserCheck, label: 'Trainer' },
                { r: 'member', icon: User, label: 'Member' },
              ].map(({ r, icon: Icon, label }) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r as UserRole)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    role === r
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <Lock className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>Sign In to Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Demo Accounts */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Instant Demo Account Access
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => selectDemoRole('admin', 'admin@fitcore.ai')}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-slate-200 block">System Administrator</span>
                <span className="text-[10px] text-slate-400">admin@fitcore.ai</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 font-bold">Full Access</span>
            </button>

            <button
              onClick={() => selectDemoRole('trainer', 'marcus.v@fitcore.ai')}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-slate-200 block">Personal Trainer</span>
                <span className="text-[10px] text-slate-400">marcus.v@fitcore.ai</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 font-bold">Coach Hub</span>
            </button>

            <button
              onClick={() => selectDemoRole('member', 'sarah.j@example.com')}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-slate-200 block">VIP Member</span>
                <span className="text-[10px] text-slate-400">sarah.j@example.com</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">Member App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
