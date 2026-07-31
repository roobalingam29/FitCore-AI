import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { Settings as SettingsIcon, Save, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useGymData();
  const [gymName, setGymName] = useState(settings.gymName);
  const [gymEmail, setGymEmail] = useState(settings.gymEmail);
  const [gymPhone, setGymPhone] = useState(settings.gymPhone);
  const [currency, setCurrency] = useState(settings.currency);
  const [capacityLimit, setCapacityLimit] = useState(settings.capacityLimit);
  const [operatingHours, setOperatingHours] = useState(settings.operatingHours);
  const [enableAutoReminder, setEnableAutoReminder] = useState(settings.enableAutoReminder);
  const [enableAiInsights, setEnableAiInsights] = useState(settings.enableAiInsights);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      gymName,
      gymEmail,
      gymPhone,
      currency,
      capacityLimit,
      operatingHours,
      enableAutoReminder,
      enableAiInsights,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          Gym System Configuration & AI Rules
        </h1>
        <p className="text-xs text-slate-400">Manage business profile details, gym capacity limits, tax rules, and AI feature behavior.</p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>System Settings successfully updated & persisted!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gym Identity */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Gym Center Identity</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gym Facility Name</label>
              <input
                type="text"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={gymEmail}
                onChange={(e) => setGymEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={gymPhone}
                onChange={(e) => setGymPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Gym Floor Capacity Limit</label>
              <input
                type="number"
                value={capacityLimit}
                onChange={(e) => setCapacityLimit(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Operating Hours</label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* AI & Automation Features */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            AI & Automation Rules
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Automated Renewal Reminders</span>
              <span className="text-[11px] text-slate-400">Send SMS/Email alerts 7 days prior to membership expiration</span>
            </div>
            <input
              type="checkbox"
              checked={enableAutoReminder}
              onChange={(e) => setEnableAutoReminder(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Gemini AI Churn Predictor</span>
              <span className="text-[11px] text-slate-400">Run background machine learning on check-in frequencies</span>
            </div>
            <input
              type="checkbox"
              checked={enableAiInsights}
              onChange={(e) => setEnableAiInsights(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
};
