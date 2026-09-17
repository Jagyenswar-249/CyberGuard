import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { RadialGlowButton } from '../components/shared/RadialGlowButton';

interface SignUpProps {
  onNavigate: (route: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('Jordan Hayes');
  const [email, setEmail] = useState('jordan.hayes@cyberguard.internal');
  const [password, setPassword] = useState('CyberSec@2026!');
  const [role, setRole] = useState<'SOC Analyst' | 'SOC Lead'>('SOC Analyst');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await signup(name, email, role);
    setIsLoading(false);
    onNavigate('dashboard');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 mb-2">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
              Create Analyst Profile
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Register as an authorized security operator in the CyberGuard SOC network.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

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
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Designated Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none"
              >
                <option value="SOC Analyst">SOC Analyst (Tier-1/2 Threat Investigator)</option>
                <option value="SOC Lead">SOC Lead (Incident Approver & Escalation Manager)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Security Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <RadialGlowButton
                variant="glow"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-xs font-semibold flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Registering Analyst Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </RadialGlowButton>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Sign In to Console
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
