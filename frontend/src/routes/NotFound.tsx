import React from 'react';
import { ShieldAlert, Home, Activity, Terminal } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (route: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center space-y-6">
        
        {/* Visual Badge */}
        <div className="relative inline-flex">
          <div className="h-20 w-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-xl">
            <ShieldAlert className="h-10 w-10 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest text-red-500 dark:text-red-400 font-bold">
            HTTP 404 • Threat Vector Unresolved
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            Target Resource Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            The requested SOC route or telemetry endpoint does not exist or has been quarantined by perimeter access control policies.
          </p>
        </div>

        {/* Telemetry diagnostics box */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 text-left font-mono text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Terminal className="h-3.5 w-3.5 text-teal-500" />
            <span>ERR_SOC_ROUTE_UNMAPPED</span>
          </div>
          <div>DNS_RESOLVER: 127.0.0.1 (CyberGuard Internal Proxy)</div>
          <div>STATUS_CODE: 404 Not Found (Egress Capped)</div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-500 transition-all cursor-pointer"
          >
            <Activity className="h-4 w-4" />
            <span>Return to SOC Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Go to Live URL Scanner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
