import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Trainer, MembershipPlan, AttendanceRecord, PaymentTransaction, InventoryItem, AIInsight, SystemSettings } from '../types';
import { 
  initialMembers, 
  initialTrainers, 
  initialPlans, 
  initialAttendance, 
  initialPayments, 
  initialInventory, 
  initialAIInsights, 
  initialSettings 
} from '../data/mockData';

interface GymDataContextType {
  members: Member[];
  trainers: Trainer[];
  plans: MembershipPlan[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  inventory: InventoryItem[];
  aiInsights: AIInsight[];
  settings: SystemSettings;
  loading: boolean;
  addMember: (member: Omit<Member, 'id' | 'memberCode' | 'status' | 'joinDate' | 'expiryDate'>) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addTrainer: (trainer: Omit<Trainer, 'id' | 'trainerCode' | 'rating' | 'activeClientsCount' | 'status'>) => Promise<void>;
  addPlan: (plan: Omit<MembershipPlan, 'id' | 'activeMembersCount' | 'status'>) => Promise<void>;
  checkInMember: (memberCode: string, method?: 'qr_code' | 'nfc' | 'manual') => Promise<{ success: boolean; message: string }>;
  checkOutMember: (attendanceId: string) => Promise<void>;
  recordPayment: (payment: Omit<PaymentTransaction, 'id' | 'invoiceNo' | 'paymentDate' | 'status'>) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status' | 'lastRestocked'>) => Promise<void>;
  updateInventoryStock: (id: string, newQuantity: number) => Promise<void>;
  generateAIInsight: (prompt?: string, topic?: string) => Promise<AIInsight | null>;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
}

const GymDataContext = createContext<GymDataContextType | undefined>(undefined);

export const GymDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [plans, setPlans] = useState<MembershipPlan[]>(initialPlans);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [payments, setPayments] = useState<PaymentTransaction[]>(initialPayments);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(initialAIInsights);
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [loading, setLoading] = useState(false);

  // Initial fetch from Express server (with graceful fallback to state)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mRes, tRes, pRes, aRes, payRes, invRes, aiRes, sRes] = await Promise.all([
          fetch('/api/v1/members'),
          fetch('/api/v1/trainers'),
          fetch('/api/v1/plans'),
          fetch('/api/v1/attendance'),
          fetch('/api/v1/payments'),
          fetch('/api/v1/inventory'),
          fetch('/api/v1/ai-insights'),
          fetch('/api/v1/settings'),
        ]);

        if (mRes.ok) setMembers(await mRes.json());
        if (tRes.ok) setTrainers(await tRes.json());
        if (pRes.ok) setPlans(await pRes.json());
        if (aRes.ok) setAttendance(await aRes.json());
        if (payRes.ok) setPayments(await payRes.json());
        if (invRes.ok) setInventory(await invRes.json());
        if (aiRes.ok) setAiInsights(await aiRes.json());
        if (sRes.ok) setSettings(await sRes.json());
      } catch (err) {
        console.warn('API fetch fell back to local memory state:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addMember = async (newMemberData: Omit<Member, 'id' | 'memberCode' | 'status' | 'joinDate' | 'expiryDate'>) => {
    try {
      const res = await fetch('/api/v1/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemberData),
      });
      if (res.ok) {
        const created = await res.json();
        setMembers(prev => [created, ...prev]);
        return;
      }
    } catch {
      // Fallback
    }
    const createdFallback: Member = {
      id: `m-${Date.now()}`,
      memberCode: `FC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ...newMemberData,
    };
    setMembers(prev => [createdFallback, ...prev]);
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    try {
      await fetch(`/api/v1/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMember = async (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    try {
      await fetch(`/api/v1/members/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const addTrainer = async (trainerData: Omit<Trainer, 'id' | 'trainerCode' | 'rating' | 'activeClientsCount' | 'status'>) => {
    const newTrainer: Trainer = {
      id: `t-${Date.now()}`,
      trainerCode: `TR-0${trainers.length + 1}`,
      rating: 5.0,
      activeClientsCount: 0,
      status: 'active',
      ...trainerData,
    };
    setTrainers(prev => [...prev, newTrainer]);
  };

  const addPlan = async (planData: Omit<MembershipPlan, 'id' | 'activeMembersCount' | 'status'>) => {
    const newPlan: MembershipPlan = {
      id: `p-${Date.now()}`,
      activeMembersCount: 0,
      status: 'active',
      ...planData,
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const checkInMember = async (memberCode: string, method: 'qr_code' | 'nfc' | 'manual' = 'qr_code') => {
    const cleanCode = memberCode.trim().toUpperCase();
    const foundMember = members.find(m => m.memberCode.toUpperCase() === cleanCode || m.name.toUpperCase().includes(cleanCode));

    if (!foundMember) {
      return { success: false, message: `No member found matching "${memberCode}"` };
    }

    const alreadyCheckedIn = attendance.some(a => a.memberId === foundMember.id && a.status === 'checked_in');
    if (alreadyCheckedIn) {
      return { success: false, message: `${foundMember.name} is ALREADY checked in!` };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: foundMember.id,
      memberName: foundMember.name,
      memberCode: foundMember.memberCode,
      planName: foundMember.planName,
      checkInTime: new Date().toISOString(),
      method,
      status: 'checked_in',
    };

    setAttendance(prev => [newRecord, ...prev]);
    setMembers(prev => prev.map(m => m.id === foundMember.id ? { ...m, lastCheckIn: newRecord.checkInTime } : m));

    try {
      await fetch('/api/v1/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberCode: foundMember.memberCode, method }),
      });
    } catch {
      // Handled via local state
    }

    return { success: true, message: `🎉 Check-in Success! Welcome, ${foundMember.name} (${foundMember.planName})` };
  };

  const checkOutMember = async (attendanceId: string) => {
    setAttendance(prev => prev.map(a => a.id === attendanceId ? { ...a, status: 'checked_out', checkOutTime: new Date().toISOString() } : a));
    try {
      await fetch(`/api/v1/attendance/check-out/${attendanceId}`, { method: 'POST' });
    } catch {
      // local update handled
    }
  };

  const recordPayment = async (paymentData: Omit<PaymentTransaction, 'id' | 'invoiceNo' | 'paymentDate' | 'status'>) => {
    const newPay: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      ...paymentData,
    };
    setPayments(prev => [newPay, ...prev]);
  };

  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'status' | 'lastRestocked'>) => {
    const newInv: InventoryItem = {
      id: `inv-${Date.now()}`,
      status: itemData.quantity > itemData.minThreshold ? 'in_stock' : itemData.quantity > 0 ? 'low_stock' : 'out_of_stock',
      lastRestocked: new Date().toISOString().split('T')[0],
      ...itemData,
    };
    setInventory(prev => [newInv, ...prev]);
  };

  const updateInventoryStock = async (id: string, newQuantity: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const status = newQuantity > item.minThreshold ? 'in_stock' : newQuantity > 0 ? 'low_stock' : 'out_of_stock';
        return { ...item, quantity: newQuantity, status, lastRestocked: new Date().toISOString().split('T')[0] };
      }
      return item;
    }));
  };

  const generateAIInsight = async (prompt?: string, topic?: string): Promise<AIInsight | null> => {
    try {
      const res = await fetch('/api/v1/ai-insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, topic }),
      });
      if (res.ok) {
        const insight: AIInsight = await res.json();
        setAiInsights(prev => [insight, ...prev]);
        return insight;
      }
    } catch {
      // Fallback
    }

    const fallback: AIInsight = {
      id: `ai-${Date.now()}`,
      type: 'business_optimization',
      title: 'Peak Operational Capacity Optimization',
      summary: 'Automated data heuristics indicate 14% high conversion rate for members offered personal trainer consultations during their first 14 days.',
      confidenceScore: 0.91,
      actionableSteps: [
        'Trigger automatic onboarding sequence for new members.',
        'Offer complimentary 30-min trial session with Trainer Marcus Vance.',
        'Track member goal progress after 30 days.'
      ],
      createdAt: new Date().toISOString(),
      impact: 'high',
    };
    setAiInsights(prev => [fallback, ...prev]);
    return fallback;
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <GymDataContext.Provider
      value={{
        members,
        trainers,
        plans,
        attendance,
        payments,
        inventory,
        aiInsights,
        settings,
        loading,
        addMember,
        updateMember,
        deleteMember,
        addTrainer,
        addPlan,
        checkInMember,
        checkOutMember,
        recordPayment,
        addInventoryItem,
        updateInventoryStock,
        generateAIInsight,
        updateSettings,
      }}
    >
      {children}
    </GymDataContext.Provider>
  );
};

export const useGymData = () => {
  const context = useContext(GymDataContext);
  if (!context) {
    throw new Error('useGymData must be used within a GymDataProvider');
  }
  return context;
};
