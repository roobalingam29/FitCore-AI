import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGymData } from '../../context/GymDataContext';
import { UserRole } from '../../types';
import { 
  Dumbbell, 
  Sparkles, 
  UserCheck, 
  Bell, 
  Search, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  ChevronDown,
  QrCode
} from 'lucide-react';
import { Modal } from './Modal';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { checkInMember, members } = useGymData();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showQuickCheckIn, setShowQuickCheckIn] = useState(false);
  const [checkInInput, setCheckInInput] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleQuickCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInInput.trim()) return;
    const res = await checkInMember(checkInInput, 'qr_code');
    setCheckInResult(res);
    if (res.success) {
      setCheckInInput('');
      setTimeout(() => setCheckInResult(null), 4000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
        {/* Left Section: Brand & AI Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <Dumbbell className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-100 text-lg tracking-tight">FitCore</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest">AI OS</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Smart Gym & Fitness Management</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Neural Engine: <strong className="text-cyan-400">Gemini 3.6 Flash Active</strong></span>
          </div>
        </div>

        {/* Right Section: Controls, Role Switcher, Profile */}
        <div className="flex items-center gap-3">
          {/* Quick QR Check-in Button */}
          <button
            onClick={() => setShowQuickCheckIn(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Check-in</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="capitalize">{role} View</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/60">
                  Switch Active Role (RBAC)
                </div>
                {(['admin', 'trainer', 'member'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                      role === r ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span className="capitalize">{r} Mode</span>
                    {role === r && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-cyan-500/30"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-100 leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Check-In Modal */}
      <Modal
        isOpen={showQuickCheckIn}
        onClose={() => {
          setShowQuickCheckIn(false);
          setCheckInResult(null);
        }}
        title="⚡ Member Instant Check-in"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Scan QR Code badge or enter Member ID (e.g. <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">FC-1001</code>) or Member Name.
          </p>

          <form onSubmit={handleQuickCheckInSubmit} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={checkInInput}
                onChange={(e) => setCheckInInput(e.target.value)}
                placeholder="Enter Code (e.g. FC-1001 or Sarah)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Check-in Member Now
            </button>
          </form>

          {checkInResult && (
            <div className={`p-3 rounded-xl border text-xs font-semibold ${
              checkInResult.success 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {checkInResult.message}
            </div>
          )}

          <div className="pt-3 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Member Shortcuts:
            </span>
            <div className="flex flex-wrap gap-2">
              {members.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setCheckInInput(m.memberCode)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/60"
                >
                  {m.name} ({m.memberCode})
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
