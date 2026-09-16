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
import { Activity, ShieldAlert, Laptop, MapPin, CheckCircle2, FolderPlus } from 'lucide-react';

interface BehaviorScannerProps {
  onIncidentCreated?: (incidentId: string) => void;
}

export const BehaviorScanner: React.FC<BehaviorScannerProps> = ({ onIncidentCreated }) => {
  const [userId, setUserId] = useState('dev-admin@cyberguard.org');
  const [ipAddress, setIpAddress] = useState('103.253.42.19');
  const [location, setLocation] = useState('Singapore, SG');
  const [previousLocation, setPreviousLocation] = useState('London, UK');
  const [timeDeltaMinutes, setTimeDeltaMinutes] = useState(40);
  const [isNewDevice, setIsNewDevice] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<Alert | null>(null);
  const [incidentId, setIncidentId] = useState<string | null>(null);

  const presets = [
    {
      label: 'Impossible Geo-Travel (London → Singapore in 40m)',
      loc: 'Singapore, SG',
      prev: 'London, UK',
      mins: 40,
      ip: '103.253.42.19',
      isNew: true
    },
    {
      label: 'Brute Force from Anonymous Tor Exit Node',
      loc: 'Frankfurt, DE',
      prev: 'Frankfurt, DE',
      mins: 2,
      ip: '185.220.101.5',
      isNew: true
    },
    {
      label: 'Normal Daily Routine Sign-in',
      loc: 'London, UK',
      prev: 'London, UK',
      mins: 480,
      ip: '82.165.197.1',
      isNew: false
    }
  ];

  const handleScan = async (presetOverride?: typeof presets[0]) => {
    setIsScanning(true);
    setResult(null);
    setIncidentId(null);

    const l = presetOverride ? presetOverride.loc : location;
    const p = presetOverride ? presetOverride.prev : previousLocation;
    const m = presetOverride ? presetOverride.mins : timeDeltaMinutes;
    const ip = presetOverride ? presetOverride.ip : ipAddress;
    const n = presetOverride ? presetOverride.isNew : isNewDevice;

    await new Promise((r) => setTimeout(r, 1000));

    const scanResult = DetectionEngine.analyzeBehavior({
      userId,
      ipAddress: ip,
      location: l,
      previousLocation: p,
      timeDeltaMinutes: m,
      isNewDevice: n
    });

    setResult(scanResult);
    setIsScanning(false);
  };

  const handleCreateIncident = () => {
    if (!result) return;
    const inc = incidentService.createFromAlert(
      result,
      `Account Takeover Anomaly: ${userId} (${location})`
    );
    setIncidentId(inc.id);
    if (onIncidentCreated) onIncidentCreated(inc.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Account Takeover (ATO) & Login Behavior Anomaly Engine
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            RBA Rules + Isolation Forest
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              User Identity
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Current Geolocation
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 p-2.5 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Previous Session Geolocation
            </label>
            <input
              type="text"
              value={previousLocation}
              onChange={(e) => setPreviousLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 p-2.5 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Elapsed Time (Minutes)
            </label>
            <input
              type="number"
              value={timeDeltaMinutes}
              onChange={(e) => setTimeDeltaMinutes(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Client IP Address
            </label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isNewDevice}
                onChange={(e) => setIsNewDevice(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Unseen Device Fingerprint</span>
            </label>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">Presets:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setLocation(p.loc);
                  setPreviousLocation(p.prev);
                  setTimeDeltaMinutes(p.mins);
                  setIpAddress(p.ip);
                  setIsNewDevice(p.isNew);
                  handleScan(p);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10 cursor-pointer"
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleScan()}
            disabled={isScanning}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-orange-500 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Activity className="h-4 w-4" />
            <span>Score Anomaly</span>
          </button>
        </div>
      </div>

      {isScanning && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-6 backdrop-blur-md">
          <LoadingState
            message="Calculating Impossible Travel Velocity..."
            subtext="Running distance vector math, device entropy index, and IP reputation lookup"
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
                  Behavior Anomaly & ATO Risk Assessment
                </h3>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                User: {result.details?.target} • IP: {result.details?.ip_address}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-700/60">
              <div className="text-center px-2">
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  Anomaly Score
                </div>
                <div className="text-xl font-bold font-mono text-orange-500 dark:text-orange-400">
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
                Telemetry & Behavioral Evidence
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
                Remediation Playbook
              </h4>
              <RecommendationCard action={result.recommended_action} severity={result.risk_tier} />

              {incidentId ? (
                <div className="flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-500/30 p-3 text-xs text-teal-600 dark:text-teal-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    ATO Incident <strong>{incidentId}</strong> logged in SOC queue.
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleCreateIncident}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-2.5 text-xs font-semibold text-orange-600 dark:text-orange-300 hover:bg-orange-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Promote to Incident Case</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
