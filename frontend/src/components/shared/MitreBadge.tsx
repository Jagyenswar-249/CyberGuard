import React from 'react';
import { MitreTechnique } from '../../types/alert';
import { Target } from 'lucide-react';

interface MitreBadgeProps {
  technique: MitreTechnique;
}

export const MitreBadge: React.FC<MitreBadgeProps> = ({ technique }) => {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 transition-colors hover:border-teal-500/50">
      <Target className="h-3 w-3 text-teal-600 dark:text-teal-400" />
      <span className="font-mono font-semibold text-teal-600 dark:text-teal-400">
        {technique.technique_id}
      </span>
      <span className="text-slate-400 dark:text-slate-600">|</span>
      <span>{technique.name}</span>
      {technique.tactic && (
        <span className="text-[10px] text-slate-400">({technique.tactic})</span>
      )}
    </div>
  );
};
