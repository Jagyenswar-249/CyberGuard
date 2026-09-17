import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Sun,
  Moon,
  Zap,
  Activity,
  UserCheck,
  Layers,
  LogIn,
  UserPlus,
  LogOut,
  Bell,
  User as UserIcon
} from 'lucide-react';
import { RadialGlowButton } from '../shared/RadialGlowButton';

interface TopTaskbarProps {
  activeRoute: string;
  onRouteChange: (route: string) => void;
  onOpenDeepfakeModal?: () => void;
}

export const TopTaskbar: React.FC<TopTaskbarProps> = ({
  activeRoute,
  onRouteChange
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [analyzersMenuOpen, setAnalyzersMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'URL Scanner', icon: Zap },
    { id: 'dashboard', label: 'SOC Dashboard', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'incidents', label: 'Incidents', icon: Layers }
  ];

  return (
    <header className="sticky top-0 z-50 w-full taskbar-container">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* TOP-LEFT: CYBERGUARD WORDMARK & STATUS */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onRouteChange('home')}
            className="group flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.2)] group-hover:scale-105 transition-transform">
              <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                CyberGuard
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                AI Defense SOC
              </div>
            </div>
          </button>

          {/* CENTER NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onRouteChange(item.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}

            {/* Analyzers Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAnalyzersMenuOpen(!analyzersMenuOpen)}
                onBlur={() => setTimeout(() => setAnalyzersMenuOpen(false), 200)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  ['analyze_url', 'analyze_identity', 'analyze_behavior'].includes(activeRoute)
                    ? 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>Threat Engines</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>

              {analyzersMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-50">
                  <button
                    onClick={() => {
                      onRouteChange('analyze_url');
                      setAnalyzersMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Zap className="h-3.5 w-3.5 text-teal-500" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">URL & Phishing Engine</div>
                      <div className="text-[10px] text-slate-400">Lexical + PhishMind AI</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRouteChange('analyze_identity');
                      setAnalyzersMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-purple-500" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">Impersonation & Deepfake</div>
                      <div className="text-[10px] text-slate-400">Synthetic media & domain spoof</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRouteChange('analyze_behavior');
                      setAnalyzersMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Activity className="h-3.5 w-3.5 text-orange-500" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">Behavior & ATO Engine</div>
                      <div className="text-[10px] text-slate-400">Impossible travel & anomalies</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* TOP-RIGHT CONTROLS: THEME TOGGLE, LOGIN & SIGN UP (NO DEEPFAKE BUTTON, NO PROFILE TEXT) */}
        <div className="flex items-center gap-2.5">
          
          {/* DARK / LIGHT THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* AUTHENTICATION: USER PROFILE WHEN LOGGED IN / LOGIN & SIGN UP WHEN LOGGED OUT */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRouteChange('dashboard')}
                title={`Logged in as ${user.name} (${user.role})`}
                className="flex items-center gap-2 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-colors cursor-pointer"
              >
                <UserIcon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                <span className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300">
                  {user.role}
                </span>
              </button>

              <button
                onClick={logout}
                title="Sign out of SOC console"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-red-500 hover:border-red-500/40 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* LOGIN BUTTON */}
              <RadialGlowButton
                variant="glow"
                onClick={() => onRouteChange('login')}
              >
                <LogIn className="h-3.5 w-3.5 text-white" />
                <span>Login</span>
              </RadialGlowButton>

              {/* SIGN UP BUTTON BESIDE LOGIN */}
              <button
                onClick={() => onRouteChange('signup')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-transparent px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <UserPlus className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
