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
import { UserCheck, ShieldAlert, Mail, Building, CheckCircle2, FolderPlus, Sparkles } from 'lucide-react';

interface ImpersonationScannerProps {
  onIncidentCreated?: (incidentId: string) => void;
}

export const ImpersonationScanner: React.FC<ImpersonationScannerProps> = ({
  onIncidentCreated
}) => {
  const [sender, setSender] = useState('cfo-sarah.jenkins@corp-global-finance-desk.com');
  const [claimedOrg, setClaimedOrg] = useState('Global Enterprise Treasury');
  const [message, setMessage] = useState(
    'Urgent fee payment required for vendor acquisition. Please wire $48,500 immediately before 5 PM to avoid penalty. Do not call regular desk phone as I am in confidential closing meetings.'
  );
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<Alert | null>(null);
  const [incidentId, setIncidentId] = useState<string | null>(null);

  const samplePresets = [
    {
      label: 'CFO Wire Request (Spoof)',
      sender: 'cfo-sarah.jenkins@corp-global-finance-desk.com',
      org: 'Global Enterprise Treasury',
      msg: 'Urgent wire authorization needed today for closing NDA deal.',
      tag: 'Critical BEC'
    },
    {
      label: 'HR W-2 Tax Fraud',
      sender: 'hr-payroll-department@internal-tax-audit.org',
      org: 'CyberGuard HR & People Ops',
      msg: 'All employees must submit updated bank account numbers and tax forms within 24 hours.',
      tag: 'High Risk'
    },
    {
      label: 'Legitimate Vendor Notice',
      sender: 'billing@aws.amazon.com',
      org: 'Amazon Web Services',
      msg: 'Your monthly cloud services invoice for September 2026 is ready for review.',
      tag: 'Safe'
    }
  ];

  const handleScan = async (preset?: typeof samplePresets[0]) => {
    setIsScanning(true);
    setResult(null);
    setIncidentId(null);

    const s = preset ? preset.sender : sender;
    const o = preset ? preset.org : claimedOrg;
    const m = preset ? preset.msg : message;

    await new Promise((r) => setTimeout(r, 1200));

    const scanResult = DetectionEngine.analyzeImpersonation({
      sender: s,
      claimed_organization: o,
      message: m
    });

    setResult(scanResult);
    setIsScanning(false);
  };

  const handleCreateIncident = () => {
    if (!result) return;
    const inc = incidentService.createFromAlert(
      result,
      `Executive Impersonation Attempt (${claimedOrg})`
    );
    setIncidentId(inc.id);
    if (onIncidentCreated) onIncidentCreated(inc.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Digital Impersonation & BEC Defense Engine
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            SPF/DKIM + Stylometry ML
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Sender Email Address
            </label>
            <div className="relative">
              <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 py-2.5 pl-9 pr-3 text-xs font-mono text-slate-900 dark:text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Claimed Organization / Entity
            </label>
            <div className="relative">
              <Building className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={claimedOrg}
                onChange={(e) => setClaimedOrg(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Message Content / Email Body
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 p-3 text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">Presets:</span>
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSender(preset.sender);
                  setClaimedOrg(preset.org);
                  setMessage(preset.msg);
                  handleScan(preset);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer"
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleScan()}
            disabled={isScanning}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-purple-500 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            <span>Verify Impersonation</span>
          </button>
        </div>
      </div>

      {isScanning && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 backdrop-blur-md">
          <LoadingState
            message="Evaluating Domain Similarity & Stylometry Urgency..."
            subtext="Running Levenshtein distance, DMARC alignment, and psychological pressure token checks"
          />
        </div>
      )}

      {result && !isScanning && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <RiskBadge tier={result.risk_tier} size="lg" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  {result.risk_tier === 'Critical' || result.risk_tier === 'High'
                    ? 'Executive Brand & Persona Spoofing Detected'
                    : 'Sender Identity Validation Result'}
                </h3>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Sender: {result.details?.sender} • Org: {result.details?.organization}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-700/60">
              <div className="text-center px-2">
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  Risk Score
                </div>
                <div className="text-xl font-bold font-mono text-purple-500 dark:text-purple-400">
                  {Math.round(result.risk_score * 100)}%
                </div>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
              <div className="min-w-[120px]">
                <ConfidenceIndicator confidence={result.confidence} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Identity Evidence Chain
              </h4>
              <EvidenceList evidence={result.evidence} />

              {result.mitre && (
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

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recommended Response
              </h4>
              <RecommendationCard action={result.recommended_action} severity={result.risk_tier} />

              {incidentId ? (
                <div className="flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-500/30 p-3 text-xs text-teal-600 dark:text-teal-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Impersonation incident <strong>{incidentId}</strong> registered.
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleCreateIncident}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-xs font-semibold text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Log BEC Incident in SOC Triage</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
