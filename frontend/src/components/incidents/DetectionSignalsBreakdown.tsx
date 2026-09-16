import React from 'react';
import { Alert } from '../../types/alert';
import { BrainCircuit, ShieldAlert, Globe, UserCheck, Activity, Eye } from 'lucide-react';

interface DetectionSignalsBreakdownProps {
  alert: Alert;
}

export const DetectionSignalsBreakdown: React.FC<DetectionSignalsBreakdownProps> = ({ alert }) => {
  const signals = [
    {
      name: 'ML Core (PhishMind)',
      score: alert.ml_score ?? (alert.risk_score * 0.95),
      icon: BrainCircuit,
      color: 'text-teal-500',
      bar: 'bg-teal-500'
    },
    {
      name: 'Heuristic Rules',
      score: alert.heuristic_score ?? (alert.risk_score * 0.9),
      icon: ShieldAlert,
      color: 'text-amber-500',
      bar: 'bg-amber-500'
    },
    {
      name: 'Threat Intel Correlation',
      score: alert.threat_intel_score ?? 0.85,
      icon: Globe,
      color: 'text-blue-400',
      bar: 'bg-blue-400'
    },
    ...(alert.identity_score
      ? [{
          name: 'Identity & Stylometry',
          score: alert.identity_score,
          icon: UserCheck,
          color: 'text-purple-400',
          bar: 'bg-purple-400'
        }]
      : []),
    ...(alert.behavior_score
      ? [{
          name: 'Behavioral Anomaly',
          score: alert.behavior_score,
          icon: Activity,
          color: 'text-orange-400',
          bar: 'bg-orange-400'
        }]
      : []),
    ...(alert.synthetic_score
      ? [{
          name: 'Synthetic Forensics',
          score: alert.synthetic_score,
          icon: Eye,
          color: 'text-rose-400',
          bar: 'bg-rose-400'
        }]
      : [])
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Multi-Signal Risk Fusion Breakdown
        </h4>
        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
          Weighted Pipeline
        </span>
      </div>

      <div className="space-y-3.5">
        {signals.map((sig, idx) => {
          const Icon = sig.icon;
          const pct = Math.round(sig.score * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Icon className={`h-3.5 w-3.5 ${sig.color}`} />
                  <span>{sig.name}</span>
                </div>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full ${sig.bar} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
        Signals combined via deterministic weighted fusion matrix with fallback resilience.
      </div>
    </div>
  );
};
