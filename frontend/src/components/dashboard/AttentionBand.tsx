import React from 'react';
import { AlertOctagon, ArrowRight, ShieldAlert } from 'lucide-react';
import { RiskTier } from '../../types/alert';

interface AttentionBandProps {
  item: {
    incident_id: string;
    title: string;
    severity: RiskTier;
    time: string;
    summary: string;
  } | null | undefined;
  onSelectIncident: (id: string) => void;
}

export const AttentionBand: React.FC<AttentionBandProps> = ({ item, onSelectIncident }) => {
  if (!item) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-red-900/20 to-slate-900/60 p-4 backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pl-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-500 dark:text-red-400">
            <AlertOctagon className="h-4 w-4 animate-pulse" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-red-500/20 text-red-500 dark:text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                Action Required Now
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {item.incident_id} • {item.time}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {item.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
              {item.summary}
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectIncident(item.incident_id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow transition-all cursor-pointer shrink-0"
        >
          <span>Triage Incident</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
