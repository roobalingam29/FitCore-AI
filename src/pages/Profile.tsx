import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Shield, Key, Mail, Phone, CheckCircle2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-2831');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-cyan-400" />
          User Profile & Security
        </h1>
        <p className="text-xs text-slate-400">Manage account credentials, active role permissions, and notification preferences.</p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile & Security preferences updated!</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-5">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={user?.name}
          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-500/40"
        />
        <div>
          <h2 className="text-lg font-bold text-slate-100">{user?.name}</h2>
          <p className="text-xs text-slate-400">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase border border-cyan-500/30 tracking-wider">
            {user?.role} Mode Active
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Personal Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            Security & Authentication
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          Save Profile Updates
        </button>
      </form>
    </div>
  );
};
