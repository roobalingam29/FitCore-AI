export type UserRole = 'admin' | 'trainer' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Member {
  id: string;
  memberCode: string; // e.g., FC-1001
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  planId: string;
  planName: string;
  status: 'active' | 'expiring' | 'expired' | 'suspended';
  joinDate: string;
  expiryDate: string;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  avatar?: string;
  emergencyContact: string;
  fitnessGoal?: string;
  medicalNotes?: string;
  lastCheckIn?: string;
}

export interface Trainer {
  id: string;
  trainerCode: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experienceYears: number;
  status: 'active' | 'on_leave' | 'inactive';
  rating: number;
  activeClientsCount: number;
  bio?: string;
  avatar?: string;
  shiftHours: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  code: string;
  durationMonths: number;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  activeMembersCount: number;
  status: 'active' | 'archived';
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  planName: string;
  checkInTime: string;
  checkOutTime?: string;
  method: 'qr_code' | 'nfc' | 'manual';
  status: 'checked_in' | 'checked_out';
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceNo: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash' | 'upi';
  purpose: 'membership_renewal' | 'personal_training' | 'pro_shop' | 'locker';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  notes?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'supplements' | 'apparel' | 'equipment' | 'beverages' | 'accessories';
  quantity: number;
  minThreshold: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastRestocked: string;
}

export interface AIInsight {
  id: string;
  type: 'business_optimization' | 'member_retention' | 'workout_recommendation' | 'equipment_maintenance';
  title: string;
  summary: string;
  confidenceScore: number;
  actionableSteps: string[];
  createdAt: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SystemSettings {
  gymName: string;
  gymEmail: string;
  gymPhone: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  enableAutoReminder: boolean;
  enableAiInsights: boolean;
  capacityLimit: number;
  operatingHours: string;
}

export interface ReportSummary {
  period: string;
  totalRevenue: number;
  newMembers: number;
  renewals: number;
  totalCheckIns: number;
  churnRate: number;
  inventorySales: number;
}
