import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Running Multi-Signal Threat Analysis...',
  subtext = 'Correlating PhishMind ML, heuristic rules, and live threat intelligence feeds'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-slate-700 border-t-teal-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 text-teal-500 animate-pulse" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {message}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          {subtext}
        </p>
      </div>
    </div>
  );
};
