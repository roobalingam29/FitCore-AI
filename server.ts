import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { 
  initialMembers, 
  initialTrainers, 
  initialPlans, 
  initialAttendance, 
  initialPayments, 
  initialInventory, 
  initialAIInsights, 
  initialSettings 
} from './src/data/mockData';
import { Member, Trainer, MembershipPlan, AttendanceRecord, PaymentTransaction, InventoryItem, AIInsight } from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory data store initialized with mock data
let members: Member[] = [...initialMembers];
let trainers: Trainer[] = [...initialTrainers];
let plans: MembershipPlan[] = [...initialPlans];
let attendance: AttendanceRecord[] = [...initialAttendance];
let payments: PaymentTransaction[] = [...initialPayments];
let inventory: InventoryItem[] = [...initialInventory];
let aiInsights: AIInsight[] = [...initialAIInsights];
let settings = { ...initialSettings };

// Initialize Gemini Client (lazy server-side)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// ==================== API ENDPOINTS ====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'FitCore AI Backend API', version: '1.0.0' });
});

// Authentication Endpoint (Demo Login)
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  let user = {
    id: 'u-1',
    name: 'Admin Executive',
    email: email || 'admin@fitcore.ai',
    role: role || 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  };

  if (role === 'trainer') {
    user = {
      id: 't1',
      name: 'Marcus Vance',
      email: email || 'marcus.v@fitcore.ai',
      role: 'trainer',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150',
    };
  } else if (role === 'member') {
    user = {
      id: 'm1',
      name: 'Sarah Jenkins',
      email: email || 'sarah.j@example.com',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    };
  }

  // Simulated JWT
  const token = `fitcore_jwt_${user.id}_${Date.now()}`;
  res.json({ token, user });
});

// Dashboard Stats & KPI summary
app.get('/api/v1/dashboard/kpi', (req: Request, res: Response) => {
  const activeMembersCount = members.filter(m => m.status === 'active').length;
  const totalRevenue = payments.reduce((acc, p) => p.status === 'paid' ? acc + p.amount : acc, 0);
  const todayCheckedInCount = attendance.filter(a => a.status === 'checked_in').length;
  const lowStockCount = inventory.filter(i => i.quantity <= i.minThreshold).length;

  res.json({
    totalMembers: members.length,
    activeMembers: activeMembersCount,
    totalRevenue,
    todayCheckIns: todayCheckedInCount,
    lowStockItems: lowStockCount,
    activeTrainers: trainers.filter(t => t.status === 'active').length,
    gymCapacity: settings.capacityLimit,
    occupancyRate: Math.round((todayCheckedInCount / settings.capacityLimit) * 100),
  });
});

// Members CRUD
app.get('/api/v1/members', (req: Request, res: Response) => {
  res.json(members);
});

app.post('/api/v1/members', (req: Request, res: Response) => {
  const newMember: Member = {
    id: `m${Date.now()}`,
    memberCode: `FC-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ...req.body,
  };
  members.unshift(newMember);
  res.status(201).json(newMember);
});

app.put('/api/v1/members/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...req.body };
    return res.json(members[index]);
  }
  res.status(404).json({ error: 'Member not found' });
});

app.delete('/api/v1/members/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  members = members.filter(m => m.id !== id);
  res.json({ success: true, message: 'Member removed' });
});

// Trainers CRUD
app.get('/api/v1/trainers', (req: Request, res: Response) => {
  res.json(trainers);
});

app.post('/api/v1/trainers', (req: Request, res: Response) => {
  const newTrainer: Trainer = {
    id: `t${Date.now()}`,
    trainerCode: `TR-0${trainers.length + 1}`,
    rating: 5.0,
    activeClientsCount: 0,
    status: 'active',
    ...req.body,
  };
  trainers.push(newTrainer);
  res.status(201).json(newTrainer);
});

// Plans CRUD
app.get('/api/v1/plans', (req: Request, res: Response) => {
  res.json(plans);
});

app.post('/api/v1/plans', (req: Request, res: Response) => {
  const newPlan: MembershipPlan = {
    id: `p${Date.now()}`,
    activeMembersCount: 0,
    status: 'active',
    ...req.body,
  };
  plans.push(newPlan);
  res.status(201).json(newPlan);
});

// Attendance Check-In / Out
app.get('/api/v1/attendance', (req: Request, res: Response) => {
  res.json(attendance);
});

app.post('/api/v1/attendance/check-in', (req: Request, res: Response) => {
  const { memberCode, method } = req.body;
  const member = members.find(m => m.memberCode.toLowerCase() === (memberCode || '').toLowerCase());

  if (!member) {
    return res.status(404).json({ error: 'Invalid Member Code or Member Not Found' });
  }

  // Check if member already checked in
  const existingActive = attendance.find(a => a.memberId === member.id && a.status === 'checked_in');
  if (existingActive) {
    return res.status(400).json({ error: `${member.name} is already checked in!` });
  }

  const record: AttendanceRecord = {
    id: `att-${Date.now()}`,
    memberId: member.id,
    memberName: member.name,
    memberCode: member.memberCode,
    planName: member.planName,
    checkInTime: new Date().toISOString(),
    method: method || 'qr_code',
    status: 'checked_in',
  };

  attendance.unshift(record);
  member.lastCheckIn = record.checkInTime;

  res.status(201).json({ message: `Successfully checked in ${member.name}`, record, member });
});

app.post('/api/v1/attendance/check-out/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const record = attendance.find(a => a.id === id);
  if (record) {
    record.status = 'checked_out';
    record.checkOutTime = new Date().toISOString();
    return res.json({ message: 'Checked out successfully', record });
  }
  res.status(404).json({ error: 'Attendance record not found' });
});

// Payments API
app.get('/api/v1/payments', (req: Request, res: Response) => {
  res.json(payments);
});

app.post('/api/v1/payments', (req: Request, res: Response) => {
  const newPayment: PaymentTransaction = {
    id: `pay-${Date.now()}`,
    invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'paid',
    ...req.body,
  };
  payments.unshift(newPayment);
  res.status(201).json(newPayment);
});

// Inventory API
app.get('/api/v1/inventory', (req: Request, res: Response) => {
  res.json(inventory);
});

app.post('/api/v1/inventory', (req: Request, res: Response) => {
  const item: InventoryItem = {
    id: `inv-${Date.now()}`,
    status: req.body.quantity > req.body.minThreshold ? 'in_stock' : req.body.quantity > 0 ? 'low_stock' : 'out_of_stock',
    lastRestocked: new Date().toISOString().split('T')[0],
    ...req.body,
  };
  inventory.unshift(item);
  res.status(201).json(item);
});

// AI Insights Generator Endpoint (Powered by Gemini)
app.post('/api/v1/ai-insights/generate', async (req: Request, res: Response) => {
  const { prompt, topic } = req.body;

  try {
    const ai = getGeminiClient();
    let generatedText = '';

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are FitCore AI, an elite gym operations manager & personal training advisor.
Context:
- Total Members: ${members.length}
- Active Members: ${members.filter(m => m.status === 'active').length}
- Monthly Revenue: $${payments.reduce((acc, p) => p.amount + acc, 0)}
- Gym Capacity: ${settings.capacityLimit}
User Request / Query: ${prompt || topic || 'Analyze gym retention and operational optimization recommendations.'}

Provide a concise, highly structured JSON response with:
1. title (string)
2. summary (string)
3. impact ("high" | "medium" | "low")
4. actionableSteps (array of 3 specific strings)
`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      generatedText = response.text || '';
    }

    if (!generatedText) {
      // Intelligent fallback structured insight if API key is not present or processing
      const fallbackInsight: AIInsight = {
        id: `ai-${Date.now()}`,
        type: topic === 'workout' ? 'workout_recommendation' : 'business_optimization',
        title: topic === 'workout' 
          ? 'Personalized Progressive Hypertrophy & Metabolism Protocol' 
          : 'Predictive Revenue & Retention Opportunity (Q3 Strategy)',
        summary: topic === 'workout'
          ? 'Based on member biometrics, recommend a 4-day upper/lower split focusing on progressive overload and 2.0g/kg protein synthesis intake.'
          : 'Analysis indicates 18% higher retention when members log at least 3 check-ins per week. Recommended targeted push notifications.',
        confidenceScore: 0.95,
        actionableSteps: topic === 'workout' ? [
          'Week 1-2: 4x8-10 reps compound movements at 75% 1RM.',
          'Week 3-4: Introduce drop-sets on final hypertrophy sets.',
          'Daily target: 7-8 hours deep sleep recovery & hydration.'
        ] : [
          'Launch 14-day streak challenge with free pro-shop smoothie incentive.',
          'Schedule automated SMS reminders for members inactive > 5 days.',
          'Promote off-peak personal training sessions at a 15% discount.'
        ],
        createdAt: new Date().toISOString(),
        impact: 'high',
      };
      aiInsights.unshift(fallbackInsight);
      return res.json(fallbackInsight);
    }

    const parsed = JSON.parse(generatedText);
    const newInsight: AIInsight = {
      id: `ai-${Date.now()}`,
      type: topic === 'workout' ? 'workout_recommendation' : 'business_optimization',
      title: parsed.title || 'AI Optimized Gym Operational Strategy',
      summary: parsed.summary || 'AI analysis completed successfully based on active member trends.',
      confidenceScore: 0.92,
      actionableSteps: Array.isArray(parsed.actionableSteps) ? parsed.actionableSteps : ['Implement staff alignment', 'Track weekly retention stats'],
      createdAt: new Date().toISOString(),
      impact: parsed.impact || 'high',
    };

    aiInsights.unshift(newInsight);
    res.json(newInsight);
  } catch (error) {
    console.error('Error generating AI insight:', error);
    res.status(500).json({ error: 'Failed to generate AI insight' });
  }
});

app.get('/api/v1/ai-insights', (req: Request, res: Response) => {
  res.json(aiInsights);
});

// Settings API
app.get('/api/v1/settings', (req: Request, res: Response) => {
  res.json(settings);
});

app.put('/api/v1/settings', (req: Request, res: Response) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// ==================== VITE MIDDLEWARE & SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FitCore AI Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
