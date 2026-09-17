import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  Shield,
  Key,
  LogOut,
  Sparkles,
  Zap,
  Activity,
  Cpu,
  CheckCircle,
  Copy,
  Clock,
  Layers,
  ArrowRight,
  Save
} from 'lucide-react';

interface ProfileProps {
  onNavigate: (route: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [department, setDepartment] = useState(user?.department || 'Threat Response & Triage');
  const [location, setLocation] = useState(user?.location || 'HQ Security Ops Center (Sector 4)');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 max-w-md shadow-xl">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Active Operator Session
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Please log in or sign up with an authorized analyst profile to view usage metrics and credentials.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs py-2.5 transition-all cursor-pointer"
          >
            Sign In to SOC Console
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      department,
      location,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyToken = () => {
    if (user.token) {
      navigator.clipboard.writeText(user.token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  const handleConfirmLogout = () => {
    logout();
    onNavigate('home');
  };

  // Usage Telemetry Metrics
  const usageStats = [
    {
      label: 'Phishing URL Scans',
      used: 842,
      limit: 1000,
      unit: 'scans',
      percentage: 84,
      icon: Zap,
      color: 'teal',
      trend: '+12% from yesterday'
    },
    {
      label: 'Deepfake & Synthetic Media Scans',
      used: 48,
      limit: 100,
      unit: 'files',
      percentage: 48,
      icon: Sparkles,
      color: 'purple',
      trend: 'Neural model v4.2'
    },
    {
      label: 'Behavioral & ATO Events Processed',
      used: 14280,
      limit: 50000,
      unit: 'events',
      percentage: 28.5,
      icon: Activity,
      color: 'amber',
      trend: 'Isolation Forest live'
    },
    {
      label: 'XAI Inference Compute Tokens',
      used: 124500,
      limit: 500000,
      unit: 'tokens',
      percentage: 24.9,
      icon: Cpu,
      color: 'blue',
      trend: 'Explainability sub-engine'
    }
  ];

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto">
      {/* HEADER BREADCRUMB & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-600 dark:text-teal-400 mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>OPERATOR CREDENTIALS & USAGE CONSOLE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Operator Profile & Telemetry
          </h1>
        </div>

        {/* TOP RIGHT QUICK ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('subscription')}
            className="inline-flex items-center gap-2 rounded-lg border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Manage Plan ({user.plan || 'SOC Pro'})</span>
          </button>

          {/* PROMINENT RED LOGOUT BUTTON */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
            title="Terminate operator session"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="h-4 w-4" />
          <span>Operator details updated successfully and synchronized to SOC registry.</span>
        </div>
      )}

      {/* OPERATOR CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: IDENTITY & CLEARANCE */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-teal-500/20">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h2>
                <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  {user.role}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {user.id}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  Corporate Email
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-200">{user.email}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  Department
                </span>
                <span className="text-slate-900 dark:text-slate-200 font-medium">{user.department}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-teal-500" />
                  Clearance Level
                </span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">{user.clearanceLevel || 'Level 3'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Current Plan
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{user.plan || 'SOC Pro'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile Details'}
            </button>
          </div>
        </div>

        {/* MIDDLE & RIGHT: EDIT FORM OR USAGE TELEMETRY */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-teal-500" />
                Modify Operator Record
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Operator Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Department / Pod
                    </label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    SOC Facility / Node Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* USAGE & QUOTA STATS GRID */
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-4 w-4 text-teal-500" />
                    Live Quota & Detection Usage
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Daily telemetry and AI inference capacity reset at 00:00 UTC.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('subscription')}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Upgrade Limits</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usageStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {stat.label}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {stat.percentage}%
                        </span>
                      </div>

                      {/* PROGRESS BAR */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            stat.percentage > 80
                              ? 'bg-amber-500'
                              : 'bg-teal-500'
                          }`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        <span>
                          {stat.used.toLocaleString()} / {stat.limit.toLocaleString()} {stat.unit}
                        </span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400">{stat.trend}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECURITY & TOKEN DETAILS */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-500" />
              SOC API & Session Credentials
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Active Operator Bearer Token (JWT)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-400 truncate">
                    {user.token || 'jwt-bearer-mock-9281-valid-soc-auth'}
                  </div>
                  <button
                    onClick={handleCopyToken}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    {copiedToken ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-teal-500" />
                        <span className="text-teal-600 dark:text-teal-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">MFA Security</div>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Hardware 2FA Active</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Session Protocol</div>
                  <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-slate-200">
                    <Clock className="h-3.5 w-3.5 text-teal-500" />
                    <span>TLS 1.3 / mTLS Guard</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Audit Trail</div>
                  <div className="font-semibold text-teal-600 dark:text-teal-400">
                    Immutable SOC Ledger
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DANGER ZONE / LOGOUT BANNER */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 dark:bg-red-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Session Termination & Sign Out
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Signing out revokes your local JWT authorization and invalidates active telemetry tokens.
              </p>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs px-5 py-2.5 shadow-md shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out Operator</span>
            </button>
          </div>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confirm Sign Out?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You will be logged out of the CyberGuard SOC network. Any unsaved live triage filters will reset.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                onClick={handleConfirmLogout}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
