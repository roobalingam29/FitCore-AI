import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CreditCard, DollarSign, Plus, Download, Printer, FileText } from 'lucide-react';

export const Payments: React.FC = () => {
  const { payments, recordPayment, members } = useGymData();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [memberId, setMemberId] = useState(members[0]?.id || 'm1');
  const [amount, setAmount] = useState(89);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer' | 'cash' | 'upi'>('credit_card');
  const [purpose, setPurpose] = useState<'membership_renewal' | 'personal_training' | 'pro_shop' | 'locker'>('membership_renewal');

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMember = members.find(m => m.id === memberId);
    await recordPayment({
      memberId,
      memberName: selectedMember?.name || 'Walk-in Guest',
      amount,
      paymentMethod,
      purpose,
    });
    setShowAddModal(false);
  };

  const totalRevenue = payments.reduce((acc, p) => p.status === 'paid' ? acc + p.amount : acc, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            Financial Ledger & Payment Gateway
          </h1>
          <p className="text-xs text-slate-400">Track membership billing, personal training invoices, pro-shop POS transactions, and payment status.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Revenue Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Processed Revenue</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">${totalRevenue.toLocaleString()} USD</div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs">
          {payments.length} Validated Transactions
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Purpose</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{p.invoiceNo}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{p.memberName}</td>
                  <td className="py-3 px-4 font-bold text-slate-100">${p.amount}</td>
                  <td className="py-3 px-4 capitalize text-slate-300">{p.purpose.replace('_', ' ')}</td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-400">{p.paymentMethod.replace('_', ' ')}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{p.paymentDate}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Record New Payment">
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Member</label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.memberCode})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount ($)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="credit_card">Credit / Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="upi">Digital UPI / Wallet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="membership_renewal">Membership Renewal</option>
              <option value="personal_training">Personal Training Package</option>
              <option value="pro_shop">Pro Shop Merchandise</option>
              <option value="locker">Locker Rental</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            Process & Record Invoice
          </button>
        </form>
      </Modal>
    </div>
  );
};
