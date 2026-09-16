import React from 'react';
import { RecommendedAction, RiskTier } from '../../types/alert';
import { ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

interface RecommendationCardProps {
  action: RecommendedAction;
  severity?: RiskTier;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  action,
  severity = 'High'
}) => {
  const getBorderAccent = () => {
    switch (severity) {
      case 'Critical':
        return 'border-l-red-500';
      case 'High':
        return 'border-l-orange-500';
      case 'Medium':
        return 'border-l-amber-500';
      default:
        return 'border-l-teal-500';
    }
  };

  return (
    <div
      className={`rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 border-l-4 ${getBorderAccent()} shadow-sm space-y-3`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recommended Playbook Action
          </h4>
        </div>
        {action.requires_human_approval && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            <UserCheck className="h-3.5 w-3.5" />
            Requires Human Approval
          </span>
        )}
      </div>

      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {action.primary}
      </div>

      {action.secondary && action.secondary.length > 0 && (
        <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400">
            Secondary Remediation Steps:
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
            {action.secondary.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
