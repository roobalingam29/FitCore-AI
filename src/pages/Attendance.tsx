import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CalendarCheck, QrCode, LogOut, CheckCircle2, AlertCircle, Search, RefreshCw } from 'lucide-react';

export const Attendance: React.FC = () => {
  const { attendance, checkInMember, checkOutMember, members } = useGymData();
  const [memberCodeInput, setMemberCodeInput] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [showScannerSimulator, setShowScannerSimulator] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberCodeInput.trim()) return;
    const res = await checkInMember(memberCodeInput, 'manual');
    setFeedback(res);
    if (res.success) {
      setMemberCodeInput('');
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const simulateQRScan = async (code: string) => {
    setSimulating(true);
    setTimeout(async () => {
      const res = await checkInMember(code, 'qr_code');
      setFeedback(res);
      setSimulating(false);
      setShowScannerSimulator(false);
      setTimeout(() => setFeedback(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-cyan-400" />
            Attendance & QR Access Terminal
          </h1>
          <p className="text-xs text-slate-400">Real-time gym turnstile check-in log, biometric QR scanning, and active occupancy tracking.</p>
        </div>

        <button
          onClick={() => setShowScannerSimulator(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch QR Scanner Simulator</span>
        </button>
      </div>

      {/* Manual Check-in Console */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          Desk Access Terminal & Manual Member Check-in
        </h3>

        <form onSubmit={handleManualCheckIn} className="flex gap-3">
          <input
            type="text"
            value={memberCodeInput}
            onChange={(e) => setMemberCodeInput(e.target.value)}
            placeholder="Type Member Code (e.g., FC-1001) or Member Name..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 shrink-0"
          >
            Check-In Now
          </button>
        </form>

        {feedback && (
          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            feedback.success 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {feedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Live Attendance Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Today's Check-in Log</h3>
          <span className="text-xs text-slate-400 font-medium">
            Currently Checked-in: <strong className="text-cyan-400">{attendance.filter(a => a.status === 'checked_in').length}</strong> Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Member Code</th>
                <th className="py-3.5 px-4">Membership Plan</th>
                <th className="py-3.5 px-4">Check-in Time</th>
                <th className="py-3.5 px-4">Verification Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-100">{rec.memberName}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{rec.memberCode}</td>
                  <td className="py-3 px-4 text-slate-300">{rec.planName}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold tracking-wider text-slate-400">
                    {rec.method.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {rec.status === 'checked_in' && (
                      <button
                        onClick={() => checkOutMember(rec.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 ml-auto"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Check-Out</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Simulator Modal */}
      <Modal isOpen={showScannerSimulator} onClose={() => setShowScannerSimulator(false)} title="📷 Turnstile Camera QR Code Scanner Simulator">
        <div className="space-y-4 text-center">
          <div className="w-full h-48 rounded-2xl bg-slate-950 border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400 animate-pulse shadow-lg shadow-cyan-500" />
            <QrCode className="w-16 h-16 text-cyan-400 mb-2 animate-bounce" />
            <p className="text-xs font-semibold text-slate-300">Simulating Optical Turnstile Camera</p>
            <p className="text-[11px] text-slate-500">Click any member badge below to simulate instant optical scanning.</p>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Available Member QR Badges:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {members.map((m) => (
                <button
                  key={m.id}
                  disabled={simulating}
                  onClick={() => simulateQRScan(m.memberCode)}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all hover:border-cyan-500/50"
                >
                  <span className="font-bold text-slate-100 text-xs block">{m.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{m.memberCode}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
