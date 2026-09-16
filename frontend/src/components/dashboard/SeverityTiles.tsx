import React from 'react';
import { RiskTier } from '../../types/alert';

interface SeverityTilesProps {
  counts: Record<RiskTier, number>;
  onFilterSeverity?: (tier: RiskTier) => void;
}

export const SeverityTiles: React.FC<SeverityTilesProps> = ({ counts, onFilterSeverity }) => {
  const tiles: { tier: RiskTier; count: number; border: string; bg: string; text: string }[] = [
    {
      tier: 'Critical',
      count: counts.Critical || 0,
      border: 'border-red-500/30 hover:border-red-500/60',
      bg: 'bg-red-500/5',
      text: 'text-red-500 dark:text-red-400'
    },
    {
      tier: 'High',
      count: counts.High || 0,
      border: 'border-orange-500/30 hover:border-orange-500/60',
      bg: 'bg-orange-500/5',
      text: 'text-orange-500 dark:text-orange-400'
    },
    {
      tier: 'Medium',
      count: counts.Medium || 0,
      border: 'border-yellow-500/30 hover:border-yellow-500/60',
      bg: 'bg-yellow-500/5',
      text: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      tier: 'Low',
      count: counts.Low || 0,
      border: 'border-teal-500/30 hover:border-teal-500/60',
      bg: 'bg-teal-500/5',
      text: 'text-teal-600 dark:text-teal-400'
    },
    {
      tier: 'Safe',
      count: counts.Safe || 0,
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      bg: 'bg-emerald-500/5',
      text: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {tiles.map((tile) => (
        <div
          key={tile.tier}
          onClick={() => onFilterSeverity && onFilterSeverity(tile.tier)}
          className={`rounded-xl border ${tile.border} ${tile.bg} p-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm bg-white/40 dark:bg-slate-900/40`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {tile.tier}
            </span>
            <span className={`h-2 w-2 rounded-full ${tile.text.replace('text-', 'bg-')}`} />
          </div>
          <div className={`mt-2 font-display text-2xl font-bold ${tile.text}`}>
            {tile.count}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Active threat alerts
          </div>
        </div>
      ))}
    </div>
  );
};
