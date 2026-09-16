import React, { useState } from 'react';
import { DetectionEngine } from '../../services/detectionEngine';
import { incidentService } from '../../services/incidentService';
import { Alert } from '../../types/alert';
import { RiskBadge } from '../shared/RiskBadge';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { EvidenceList } from '../shared/EvidenceList';
import { MitreBadge } from '../shared/MitreBadge';
import { RecommendationCard } from '../shared/RecommendationCard';
import { LoadingState } from '../shared/LoadingState';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Globe,
  CornerDownLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Copy,
  AlertTriangle,
  FolderPlus
} from 'lucide-react';

interface UrlPhishingScannerProps {
  onIncidentCreated?: (incidentId: string) => void;
  initialUrl?: string;
}

export const UrlPhishingScanner: React.FC<UrlPhishingScannerProps> = ({
  onIncidentCreated,
  initialUrl = ''
}) => {
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [result, setResult] = useState<Alert | null>(null);
  const [incidentCreatedId, setIncidentCreatedId] = useState<string | null>(null);

  const sampleUrls = [
    {
      label: 'PayPal Spoof (Homoglyph)',
      url: 'https://paypa1-security-verification.com/account/login?urgent_action=1',
      tag: 'Critical Threat'
    },
    {
      label: 'Microsoft 365 Credential Harvester',
      url: 'https://login-m1crosoft-office365-verify.xyz/auth/sso',
      tag: 'High Risk'
    },
    {
      label: 'DocuSign Urgent Invoice Lure',
      url: 'https://docus1gn-document-portal.online/sign/view-invoice-982.pdf',
      tag: 'Phishing URL'
    },
    {
      label: 'Legitimate Site (GitHub)',
      url: 'https://github.com/security-operations/cyberguard',
      tag: 'Safe'
    }
  ];

  const handleScan = async (targetUrl?: string) => {
    const url = targetUrl || urlInput;
    if (!url.trim()) return;

    setIsScanning(true);
    setResult(null);
    setIncidentCreatedId(null);

    // Realistic scanning stages simulation
    setScanStage('Normalizing URL & punycode decoding...');
    await new Promise((r) => setTimeout(r, 450));

    setScanStage('Evaluating lexical entropy & homoglyph character matching...');
    await new Promise((r) => setTimeout(r, 550));

    setScanStage('Executing PhishMind ML neural classifier inference...');
    await new Promise((r) => setTimeout(r, 500));

    setScanStage('Querying URLhaus & VirusTotal threat intel feeds...');
    await new Promise((r) => setTimeout(r, 400));

    const scanResult = DetectionEngine.analyzeUrl({ url });
    setResult(scanResult);
    setIsScanning(false);
  };

  const handleCreateIncident = () => {
    if (!result) return;
    const inc = incidentService.createFromAlert(result);
    setIncidentCreatedId(inc.id);
    if (onIncidentCreated) {
      onIncidentCreated(inc.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* URL INPUT SECTION - Prominent space to paste and inspect URLs */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live URL Phishing & Malicious Domain Inspector
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            PhishMind ML Core v2
          </span>
        </div>

        {/* Input box */}
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Globe className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Paste suspicious URL here (e.g., https://paypa1-verify-account.com/login)..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 py-3 pl-10 pr-24 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            {urlInput && (
              <button
                onClick={() => setUrlInput('')}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => handleScan()}
            disabled={isScanning || !urlInput.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-teal-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Analyze Threat</span>
            <CornerDownLeft className="h-3 w-3 opacity-60 hidden sm:inline" />
          </button>
        </div>

        {/* PRESET QUICK-LOAD CHIPS */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400">
            Test Payloads:
          </span>
          {sampleUrls.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(sample.url);
                handleScan(sample.url);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all cursor-pointer"
            >
              <span>{sample.label}</span>
              <span
                className={`text-[9px] px-1 rounded ${
                  sample.tag.includes('Critical')
                    ? 'bg-red-500/20 text-red-500 dark:text-red-400'
                    : sample.tag.includes('High')
                    ? 'bg-orange-500/20 text-orange-500 dark:text-orange-400'
                    : sample.tag.includes('Safe')
                    ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400'
                    : 'bg-teal-500/20 text-teal-600 dark:text-teal-400'
                }`}
              >
                {sample.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SCANNING IN PROGRESS ANIMATION */}
      {isScanning && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 backdrop-blur-md">
          <LoadingState
            message="Running CyberGuard Threat Reasoner..."
            subtext={scanStage}
          />
        </div>
      )}

      {/* RESULT PANEL */}
      {result && !isScanning && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-6">
          
          {/* Top Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <RiskBadge tier={result.risk_tier} size="lg" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  {result.risk_tier === 'Safe'
                    ? 'Legitimate & Verified Target'
                    : `${result.risk_tier.toUpperCase()} Risk Phishing Threat Detected`}
                </h3>
              </div>
              <div className="font-mono text-xs text-slate-500 dark:text-slate-400 break-all">
                {result.details?.target}
              </div>
            </div>

            {/* Risk and Confidence Gauges */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-700/60">
              <div className="text-center px-2">
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  Risk Score
                </div>
                <div
                  className={`text-xl font-bold font-mono ${
                    result.risk_score >= 0.8
                      ? 'text-red-500 dark:text-red-400'
                      : result.risk_score >= 0.5
                      ? 'text-orange-500 dark:text-orange-400'
                      : result.risk_score >= 0.2
                      ? 'text-yellow-500 dark:text-yellow-400'
                      : 'text-emerald-500 dark:text-emerald-400'
                  }`}
                >
                  {Math.round(result.risk_score * 100)}/100
                </div>
              </div>

              <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />

              <div className="min-w-[120px]">
                <ConfidenceIndicator confidence={result.confidence} />
              </div>
            </div>
          </div>

          {/* Two-Column Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Transparent XAI Evidence Chain */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Explainable Evidence Chain (XAI)
                </h4>
                <span className="text-[11px] text-teal-600 dark:text-teal-400">
                  {result.evidence.length} signals correlated
                </span>
              </div>

              <EvidenceList evidence={result.evidence} />

              {/* MITRE ATT&CK Mapping */}
              {result.mitre && result.mitre.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    MITRE ATT&CK® Mapping
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.mitre.map((m, idx) => (
                      <MitreBadge key={idx} technique={m} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Response Playbook & SOC Action */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recommended SOC Playbook
              </h4>

              <RecommendationCard
                action={result.recommended_action}
                severity={result.risk_tier}
              />

              {/* Data Completeness Footnote */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/40 p-3 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Enrichment Note:{' '}
                </span>
                {result.data_completeness_note}
              </div>

              {/* Convert to Incident Button */}
              {result.risk_tier !== 'Safe' && (
                <div className="pt-2">
                  {incidentCreatedId ? (
                    <div className="flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-500/30 p-3 text-xs text-teal-600 dark:text-teal-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        Incident <strong>{incidentCreatedId}</strong> created in active SOC queue.
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleCreateIncident}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-teal-500/40 bg-teal-500/10 px-4 py-2.5 text-xs font-semibold text-teal-600 dark:text-teal-300 hover:bg-teal-500/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <FolderPlus className="h-4 w-4" />
                      <span>Promote Finding to SOC Incident Case</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
