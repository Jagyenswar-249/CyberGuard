import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RadialGlowButton } from '../components/shared/RadialGlowButton';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginProps {
  onNavigate: (route: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('alex.vance@cyberguard.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'SOC Analyst' | 'SOC Lead'>('SOC Analyst');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await login(email, role);
    setIsLoading(false);
    onNavigate('dashboard');
  };

  const handleQuickFill = (presetRole: 'SOC Analyst' | 'SOC Lead') => {
    setRole(presetRole);
    if (presetRole === 'SOC Lead') {
      setEmail('elena.rostova@cyberguard.internal');
    } else {
      setEmail('alex.vance@cyberguard.internal');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 mb-2">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
              CyberGuard SOC Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authenticate to access live threat detection, XAI telemetry, and containment gates.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Role Switcher
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('SOC Analyst')}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  role === 'SOC Analyst'
                    ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs font-bold">Alex Vance</span>
                <span className="text-[10px] opacity-75">SOC Analyst (Tier-1/2)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('SOC Lead')}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  role === 'SOC Lead'
                    ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs font-bold">Elena Rostova</span>
                <span className="text-[10px] opacity-75">SOC Lead (Approver)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 pl-9 pr-10 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <RadialGlowButton
                variant="glow"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-xs font-semibold"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Console'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </RadialGlowButton>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Don't have an operator account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Register as Analyst
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
