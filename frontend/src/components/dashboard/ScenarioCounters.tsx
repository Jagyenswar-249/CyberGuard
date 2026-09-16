import React from 'react';
import { Zap, UserCheck, Activity, Sparkles } from 'lucide-react';

interface ScenarioCountersProps {
  counts: Record<string, number>;
  onSelectScenario?: (type: string) => void;
}

export const ScenarioCounters: React.FC<ScenarioCountersProps> = ({
  counts,
  onSelectScenario
}) => {
  const scenarios = [
    {
      id: 'phishing_url',
      label: 'Phishing URLs & Sites',
      count: counts.phishing_url || 82,
      icon: Zap,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    },
    {
      id: 'impersonation',
      label: 'Digital Impersonation',
      count: counts.impersonation || 29,
      icon: UserCheck,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      id: 'deepfake',
      label: 'Deepfakes & Synthetics',
      count: counts.deepfake || 14,
      icon: Sparkles,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    },
    {
      id: 'account_takeover',
      label: 'Account Takeover (ATO)',
      count: counts.account_takeover || 23,
      icon: Activity,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {scenarios.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.id}
            onClick={() => onSelectScenario && onSelectScenario(s.id)}
            className={`flex items-center gap-3.5 rounded-xl border ${s.border} bg-white/60 dark:bg-slate-900/60 p-4 backdrop-blur-sm transition-all hover:border-slate-400 dark:hover:border-slate-700 cursor-pointer shadow-sm`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bg} ${s.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {s.label}
              </div>
              <div className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
                {s.count}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
