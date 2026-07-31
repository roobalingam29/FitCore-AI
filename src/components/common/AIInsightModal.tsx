import React, { useState } from 'react';
import { useGymData } from '../../context/GymDataContext';
import { Modal } from './Modal';
import { StatusBadge } from './Badge';
import { Sparkles, CheckCircle2, Bot, Loader2 } from 'lucide-react';

interface AIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIInsightModal: React.FC<AIInsightModalProps> = ({ isOpen, onClose }) => {
  const { generateAIInsight } = useGymData();
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState<'business' | 'workout' | 'retention'>('business');
  const [loading, setLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await generateAIInsight(prompt, topic);
    setActiveInsight(result);
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🤖 FitCore AI Neural Insight Generator" maxWidth="xl">
      <div className="space-y-5">
        <form onSubmit={handleGenerate} className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Analysis Topic</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'business', label: 'Business & Revenue' },
                { id: 'workout', label: 'Workout Protocols' },
                { id: 'retention', label: 'Member Retention' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTopic(t.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    topic === t.id
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom Prompt or Specific Goal (Optional)
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Recommend a strategy to increase off-peak gym floor occupancy..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Gemini 3.6 Flash Neural Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Intelligence Insight</span>
              </>
            )}
          </button>
        </form>

        {activeInsight && (
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                AI Strategy Output
              </span>
              <StatusBadge status={activeInsight.impact || 'high'} />
            </div>

            <h4 className="text-sm font-bold text-slate-100">{activeInsight.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{activeInsight.summary}</p>

            {activeInsight.actionableSteps && (
              <div className="pt-2 border-t border-slate-700/50">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                  Actionable Step Execution Plan:
                </span>
                <ul className="space-y-1.5">
                  {activeInsight.actionableSteps.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
