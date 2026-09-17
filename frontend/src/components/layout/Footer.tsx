import React from 'react';
import { Shield, Cpu, Terminal, Lock, Sparkles, User } from 'lucide-react';

interface FooterProps {
  onNavigate?: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 py-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              CyberGuard SOC
            </span>
            <span>— AI Cyber Threat, Phishing & Deepfake Defense System</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <div className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-teal-500" />
              <span>PhishMind v2 Core</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>Human Approval Gate: Active</span>
            </div>
            <div className="flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5 text-purple-400" />
              <span>MITRE ATT&CK Matrix v14</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <div>Built for Enterprise Threat Operations & Autonomous Digital Defense</div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('subscription')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Sparkles className="h-3 w-3 text-teal-500" />
                  <span>Subscription Plans</span>
                </button>
                <span>•</span>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <User className="h-3 w-3" />
                  <span>Operator Usage</span>
                </button>
                <span>•</span>
              </>
            )}
            <span>Threat-Intel Fallback Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

