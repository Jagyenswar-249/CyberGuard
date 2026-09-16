import React from 'react';

interface RadialGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'glow';
  className?: string;
}

export const RadialGlowButton: React.FC<RadialGlowButtonProps> = ({
  children,
  variant = 'glow',
  className = '',
  ...props
}) => {
  if (variant === 'primary') {
    return (
      <button
        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500 active:scale-95 transition-all shadow-sm cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`radial-glow-btn relative inline-flex items-center justify-center gap-2 rounded-lg border border-teal-500/40 bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:border-teal-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] active:scale-95 transition-all cursor-pointer ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
