import React, { useState, useEffect } from 'react';
import { UrlPhishingScanner } from '../components/analyzer/UrlPhishingScanner';
import { StaggerText } from '../components/ui/staggerText';
import {
  Zap,
  Sparkles,
  Activity,
  ArrowRight,
  Lock,
  Cpu,
  Terminal,
  Globe
} from 'lucide-react';
import { RadialGlowButton } from '../components/shared/RadialGlowButton';

interface HomeProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenDeepfakeModal?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const rotatingWords = [
    'MALICIOUS URLS',
    'DIGITAL IMPERSONATION',
    'SYNTHETIC DEEPFAKES',
    'ACCOUNT TAKEOVER'
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          <StaggerText divideBy="word" delay={0.1}>
            Catch the cyber threat before it becomes a breach.
          </StaggerText>
        </h1>

        <div className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
          One unified reasoning console for{' '}
          <span className="inline-block min-w-[240px] font-bold text-teal-600 dark:text-teal-400 border-b-2 border-teal-500/40 pb-0.5 transition-all">
            {rotatingWords[wordIndex]}
          </span>
          , scored, explained, and remediated with human approval.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <RadialGlowButton
            variant="glow"
            onClick={() => onNavigate('dashboard')}
            className="text-sm px-5 py-2.5"
          >
            <Activity className="h-4 w-4 text-teal-400" />
            <span>Open SOC Dashboard</span>
          </RadialGlowButton>

          <button
            onClick={() => onNavigate('analyze_identity')}
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>Deepfake & Impersonation Engine</span>
          </button>
        </div>
      </section>

      {/* CORE FEATURE: DEDICATED SPACE TO PASTE URLS AND CHECK FOR PHISHING */}
      <section className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              Live Threat Interceptor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste suspicious domains, credential harvesting URLs, or phishing lures for instant multi-engine analysis.
            </p>
          </div>
        </div>

        <UrlPhishingScanner
          onIncidentCreated={(id) => onNavigate('incident_detail', id)}
        />
      </section>

      {/* THREE CORE ENGINES SHOWCASE */}
      <section className="max-w-6xl mx-auto space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
            Three Specialized Detection Engines. One Coherent Reasoning Pipeline.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            CyberGuard unifies heuristic rule engines, trained ML models, and threat-intel feeds into explainable decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('analyze_url')}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm hover:border-teal-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-500 transition-colors">
              URL & Phishing Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              PhishMind Random Forest classifier evaluates lexical token entropy, punycode homoglyphs, and live URLhaus / VirusTotal feeds.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect URLs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('analyze_identity')}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm hover:border-purple-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-400 transition-colors">
              Deepfake & Impersonation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Detects neural voice clones, facial boundary artifacts, sender-auth SPF/DKIM spoofing, and executive wire-fraud stylometry.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect Deepfakes & BEC</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('analyze_behavior')}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm hover:border-orange-500/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-400 transition-colors">
              Behavior & ATO Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Isolation Forest model detects impossible travel geo-velocity, password spraying patterns, and unseen browser fingerprints.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-orange-500 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect Telemetry</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL GUARANTEES */}
      <section className="max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs uppercase tracking-wider">
              <Lock className="h-4 w-4" />
              <span>Human Gate</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No Blind Automation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every destructive remediation requires explicit SOC analyst review and sign-off.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs uppercase tracking-wider">
              <Cpu className="h-4 w-4" />
              <span>Offline Resilience</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Local Cache Fallback
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Functions even during network disconnection via pre-populated threat-intelligence snapshots.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs uppercase tracking-wider">
              <Terminal className="h-4 w-4" />
              <span>MITRE ATT&CK®</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Standardized Taxonomy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All findings mapped to T1566, T1656, T1583, and T1078 tactical matrices.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs uppercase tracking-wider">
              <Globe className="h-4 w-4" />
              <span>Risk vs Confidence</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Two-Score Rigor
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Separates severity-if-true from signal completeness and agreement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
