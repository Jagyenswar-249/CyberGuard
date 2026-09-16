import React from 'react';
import { RiskTier } from '../../types/alert';

interface RiskBadgeProps {
  tier: RiskTier;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  tier,
  size = 'md',
  showDot = true
}) => {
  const getStyles = () => {
    switch (tier) {
      case 'Critical':
        return 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/30';
      case 'High':
        return 'bg-orange-500/15 text-orange-500 dark:text-orange-400 border-orange-500/30';
      case 'Medium':
        return 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      case 'Low':
        return 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30';
      case 'Safe':
      default:
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  const getDotColor = () => {
    switch (tier) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-teal-500';
      case 'Safe':
      default:
        return 'bg-emerald-500';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3.5 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${getStyles()} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${getDotColor()} ${
            tier === 'Critical' ? 'animate-pulse' : ''
          }`}
        />
      )}
      {tier}
    </span>
  );
};
