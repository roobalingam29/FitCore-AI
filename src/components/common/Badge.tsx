import React from 'react';

interface BadgeProps {
  status: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'active':
    case 'paid':
    case 'in_stock':
    case 'checked_in':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {status.replace('_', ' ').toUpperCase()}
        </span>
      );

    case 'expiring':
    case 'pending':
    case 'low_stock':
    case 'on_leave':
    case 'medium':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {status.replace('_', ' ').toUpperCase()}
        </span>
      );

    case 'expired':
    case 'failed':
    case 'out_of_stock':
    case 'suspended':
    case 'inactive':
    case 'high':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          {status.replace('_', ' ').toUpperCase()}
        </span>
      );

    case 'checked_out':
    case 'low':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {status.replace('_', ' ').toUpperCase()}
        </span>
      );
  }
};
