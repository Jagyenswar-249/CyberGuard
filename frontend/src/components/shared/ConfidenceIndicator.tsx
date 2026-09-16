import React from 'react';

interface ConfidenceIndicatorProps {
  confidence: number; // 0.0 - 1.0
  label?: string;
  showPercentage?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  label = 'AI Signal Confidence',
  showPercentage = true
}) => {
  const percent = Math.round(confidence * 100);

  const getColor = () => {
    if (percent >= 85) return 'bg-teal-500';
    if (percent >= 65) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">{label}</span>
        {showPercentage && (
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {percent}%
          </span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
