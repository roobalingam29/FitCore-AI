import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-cyan-400 bg-cyan-500/10',
  badge,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>
        </div>
        <div className={`p-3 rounded-xl border border-slate-800 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change || badge) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800/60">
          {change && (
            <span className={`font-semibold flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {badge && <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold">{badge}</span>}
        </div>
      )}
    </div>
  );
};
