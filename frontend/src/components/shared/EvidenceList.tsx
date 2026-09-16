import React from 'react';
import { Evidence } from '../../types/alert';
import { BrainCircuit, ShieldAlert, Globe, UserCheck, Activity, Eye } from 'lucide-react';

interface EvidenceListProps {
  evidence: Evidence[];
}

export const EvidenceList: React.FC<EvidenceListProps> = ({ evidence }) => {
  const getIcon = (signal: Evidence['signal']) => {
    switch (signal) {
      case 'ml_model':
        return <BrainCircuit className="h-4 w-4 text-teal-500 shrink-0" />;
      case 'heuristic':
        return <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'threat_intel':
        return <Globe className="h-4 w-4 text-blue-400 shrink-0" />;
      case 'identity':
        return <UserCheck className="h-4 w-4 text-purple-400 shrink-0" />;
      case 'behavior':
        return <Activity className="h-4 w-4 text-orange-400 shrink-0" />;
      case 'synthetic_ai':
        return <Eye className="h-4 w-4 text-rose-400 shrink-0" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0" />;
    }
  };

  const getSignalLabel = (signal: Evidence['signal']) => {
    switch (signal) {
      case 'ml_model':
        return 'ML Core (PhishMind)';
      case 'heuristic':
        return 'Rule Engine';
      case 'threat_intel':
        return 'Threat Intelligence';
      case 'identity':
        return 'Identity Spoof';
      case 'behavior':
        return 'Behavior Telemetry';
      case 'synthetic_ai':
        return 'Deepfake Forensics';
      default:
        return 'Detection Engine';
    }
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div className="py-3 text-center text-xs text-slate-500">
        No specific threat evidence recorded.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {evidence.map((item, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
        >
          <div className="mt-0.5">{getIcon(item.signal)}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {getSignalLabel(item.signal)}
              </span>
              {item.confidence && (
                <span className="font-mono text-[11px] text-slate-400">
                  {Math.round(item.confidence * 100)}% match
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
