import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { Trainer } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { UserCheck, Star, Clock, Users, Plus, Mail, Phone, Award } from 'lucide-react';

export const Trainers: React.FC = () => {
  const { trainers, addTrainer } = useGymData();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specializations, setSpecializations] = useState('Strength & Conditioning, HIIT');
  const [expYears, setExpYears] = useState(5);
  const [shiftHours, setShiftHours] = useState('06:00 AM - 02:00 PM');
  const [bio, setBio] = useState('');

  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTrainer({
      name,
      email,
      phone,
      specialization: specializations.split(',').map(s => s.trim()),
      experienceYears: expYears,
      shiftHours,
      bio,
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150',
    });
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setBio('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            Fitness Trainers & Coaching Staff
          </h1>
          <p className="text-xs text-slate-400">Manage certified trainers, specializations, client rosters, and floor shift schedules.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Coach</span>
        </button>
      </div>

      {/* Trainers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={trainer.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150'}
                  alt={trainer.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/30"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{trainer.name}</h3>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold block">{trainer.trainerCode}</span>
                  <div className="flex items-center gap-1 mt-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{trainer.rating} / 5.0</span>
                  </div>
                </div>
              </div>

              <StatusBadge status={trainer.status} />
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{trainer.bio}</p>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  Experience:
                </span>
                <span className="font-semibold text-slate-200">{trainer.experienceYears} Years</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Active Clients:
                </span>
                <span className="font-semibold text-slate-200">{trainer.activeClientsCount} Members</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Floor Shift:
                </span>
                <span className="font-mono text-[11px] text-slate-300">{trainer.shiftHours}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Specialization Tag Matrix:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {trainer.specialization.map((spec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 text-[10px] font-medium border border-slate-700/60">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Trainer Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Certified Coach">
        <form onSubmit={handleCreateTrainer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Coach Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@fitcore.ai"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Specializations (comma separated)</label>
              <input
                type="text"
                value={specializations}
                onChange={(e) => setSpecializations(e.target.value)}
                placeholder="Strength, Powerlifting, HIIT"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={expYears}
                onChange={(e) => setExpYears(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Shift Hours</label>
            <input
              type="text"
              value={shiftHours}
              onChange={(e) => setShiftHours(e.target.value)}
              placeholder="06:00 AM - 02:00 PM"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Coach Bio / Qualifications</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Certified CSCS coach specializing in body transformations..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            Save Trainer Profile
          </button>
        </form>
      </Modal>
    </div>
  );
};
