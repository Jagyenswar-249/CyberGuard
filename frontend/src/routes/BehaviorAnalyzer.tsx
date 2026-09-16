import React from 'react';
import { BehaviorScanner } from '../components/analyzer/BehaviorScanner';
import { Activity } from 'lucide-react';

interface BehaviorAnalyzerProps {
  onNavigate: (route: string, param?: string) => void;
}

export const BehaviorAnalyzer: React.FC<BehaviorAnalyzerProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 py-6 pb-20 max-w-5xl mx-auto">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Behavior & Account Takeover (ATO) Analyzer
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Evaluates login session anomalies, impossible travel velocity calculations, and device fingerprint entropy using Isolation Forest clustering.
        </p>
      </div>

      <BehaviorScanner onIncidentCreated={(id) => onNavigate('incident_detail', id)} />
    </div>
  );
};
