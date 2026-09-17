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
        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-teal-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`radial-glow-btn relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

