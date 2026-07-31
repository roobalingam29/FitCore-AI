import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CreditCard, Check, Sparkles, Plus, Users } from 'lucide-react';

export const Plans: React.FC = () => {
  const { plans, addPlan } = useGymData();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('PLAN-CUSTOM');
  const [durationMonths, setDurationMonths] = useState(1);
  const [price, setPrice] = useState(69);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('24/7 Access, Locker Room, AI App');

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPlan({
      name,
      code,
      durationMonths,
      price,
      description,
      features: features.split(',').map(f => f.trim()),
    });
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            Membership Plans & Tier Billing
          </h1>
          <p className="text-xs text-slate-400">Configure recurring subscription tiers, pricing, feature entitlements, and active subscriber metrics.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Subscription Tier</span>
        </button>
      </div>

      {/* Plans Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-3xl bg-slate-900/90 border flex flex-col justify-between space-y-6 relative overflow-hidden transition-all shadow-xl ${
              plan.isPopular ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-800'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{plan.code}</span>
                <h3 className="text-lg font-extrabold text-slate-100 mt-0.5">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-100">${plan.price}</span>
                <span className="text-xs text-slate-400">/ {plan.durationMonths === 1 ? 'month' : `${plan.durationMonths} months`}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Included Entitlements:
                </span>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Active Subscribers:
              </span>
              <span className="font-extrabold text-slate-100">{plan.activeMembersCount} Members</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Membership Tier">
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Recovery Pass"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Months)</label>
              <input
                type="number"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of tier"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Included Features (comma separated)</label>
            <textarea
              rows={3}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="24/7 Access, Free Towel Service, Guest Pass..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            Publish Subscription Tier
          </button>
        </form>
      </Modal>
    </div>
  );
};
