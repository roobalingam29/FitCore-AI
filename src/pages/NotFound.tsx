import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Home, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-2xl">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The route or view you are attempting to access does not exist or has been moved.
      </p>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
      >
        <Home className="w-4 h-4" />
        <span>Return to FitCore Dashboard</span>
      </Link>
    </div>
  );
};
