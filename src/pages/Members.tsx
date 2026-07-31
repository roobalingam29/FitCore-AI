import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { Member } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { 
  Users, 
  Search, 
  UserPlus, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  MoreVertical, 
  Trash2, 
  Edit,
  UserCheck,
  QrCode
} from 'lucide-react';

export const Members: React.FC = () => {
  const { members, plans, trainers, addMember, updateMember, deleteMember } = useGymData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formGender, setFormGender] = useState<'male' | 'female' | 'other'>('male');
  const [formPlanId, setFormPlanId] = useState(plans[0]?.id || 'p1');
  const [formTrainerId, setFormTrainerId] = useState('');
  const [formEmergency, setFormEmergency] = useState('');
  const [formGoal, setFormGoal] = useState('');

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.memberCode.toLowerCase().includes(search.toLowerCase()) ||
                          m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlan = plans.find(p => p.id === formPlanId);
    const selectedTrainer = trainers.find(t => t.id === formTrainerId);

    await addMember({
      name: formName,
      email: formEmail,
      phone: formPhone,
      gender: formGender,
      dateOfBirth: '1995-01-01',
      planId: formPlanId,
      planName: selectedPlan?.name || 'Basic Fitness',
      assignedTrainerId: formTrainerId || undefined,
      assignedTrainerName: selectedTrainer?.name || undefined,
      emergencyContact: formEmergency || 'Not Provided',
      fitnessGoal: formGoal || 'General Fitness',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
    });

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormEmergency('');
    setFormGoal('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Gym Member Directory
          </h1>
          <p className="text-xs text-slate-400">Manage member profiles, active plans, biometric codes, and assigned personal trainers.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Member</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by member name, code (FC-1001), or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 capitalize"
          >
            <option value="all">All Membership Statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Member Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Member Info</th>
                <th className="py-3.5 px-4">Membership Plan</th>
                <th className="py-3.5 px-4">Assigned Trainer</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={member.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <span className="font-semibold text-slate-100 block">{member.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono font-bold">{member.memberCode}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-200 block">{member.planName}</span>
                    <span className="text-[10px] text-slate-400">Joined: {member.joinDate}</span>
                  </td>

                  <td className="py-3 px-4">
                    {member.assignedTrainerName ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]">
                        <UserCheck className="w-3 h-3" />
                        {member.assignedTrainerName}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-medium">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px]">
                    {member.expiryDate}
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={member.status} />
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Register New Gym Member">
        <form onSubmit={handleCreateMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Member Name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Jessica Taylor"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="jessica@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Membership Plan</label>
              <select
                value={formPlanId}
                onChange={(e) => setFormPlanId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (${p.price}/mo)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Trainer (Optional)</label>
              <select
                value={formTrainerId}
                onChange={(e) => setFormTrainerId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="">No Trainer (Self Workout)</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.specialization[0]})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact Info</label>
            <input
              type="text"
              value={formEmergency}
              onChange={(e) => setFormEmergency(e.target.value)}
              placeholder="Contact Name & Phone"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            Save & Generate Member QR Code
          </button>
        </form>
      </Modal>

      {/* Member Details Modal */}
      {selectedMember && (
        <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} title={`Member Profile: ${selectedMember.name}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={selectedMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={selectedMember.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40"
              />
              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedMember.name}</h3>
                <span className="text-xs text-cyan-400 font-mono font-bold block">{selectedMember.memberCode}</span>
                <StatusBadge status={selectedMember.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block font-semibold mb-0.5">Plan Tier:</span>
                <span className="text-slate-100 font-bold">{selectedMember.planName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block font-semibold mb-0.5">Expiry Date:</span>
                <span className="text-slate-100 font-mono font-bold">{selectedMember.expiryDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block font-semibold mb-0.5">Email:</span>
                <span className="text-slate-100 truncate block">{selectedMember.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block font-semibold mb-0.5">Phone:</span>
                <span className="text-slate-100">{selectedMember.phone}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
              <span className="text-slate-400 block font-semibold mb-0.5">Fitness Goal:</span>
              <p className="text-slate-200">{selectedMember.fitnessGoal || 'Hypertrophy & General Fitness'}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
