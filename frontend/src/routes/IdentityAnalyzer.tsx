import React, { useState } from 'react';
import { DeepfakeDetector } from '../components/analyzer/DeepfakeDetector';
import { ImpersonationScanner } from '../components/analyzer/ImpersonationScanner';
import { Sparkles, UserCheck, Eye } from 'lucide-react';

interface IdentityAnalyzerProps {
  onNavigate: (route: string, param?: string) => void;
  defaultTab?: 'deepfake' | 'impersonation';
}

export const IdentityAnalyzer: React.FC<IdentityAnalyzerProps> = ({
  onNavigate,
  defaultTab = 'deepfake'
}) => {
  const [activeTab, setActiveTab] = useState<'deepfake' | 'impersonation'>(defaultTab);

  return (
    <div className="space-y-6 py-6 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Deepfake & Digital Impersonation Defense Suite
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-modal verification for AI-generated synthetic video/voice and domain-level executive spoofing.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-300 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('deepfake')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'deepfake'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Deepfake Detection</span>
          </button>

          <button
            onClick={() => setActiveTab('impersonation')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'impersonation'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Sender Impersonation</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'deepfake' ? (
        <DeepfakeDetector onIncidentCreated={(id) => onNavigate('incident_detail', id)} />
      ) : (
        <ImpersonationScanner onIncidentCreated={(id) => onNavigate('incident_detail', id)} />
      )}
    </div>
  );
};
