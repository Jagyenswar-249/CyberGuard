import React from 'react';
import { Shield, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = Shield
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 space-y-3">
      <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
        >
          {actionText} →
        </button>
      )}
    </div>
  );
};
