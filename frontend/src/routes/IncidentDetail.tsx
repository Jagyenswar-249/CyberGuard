import React, { useState, useEffect } from 'react';
import { incidentService } from '../services/incidentService';
import type { Incident, MitreTechnique } from '../types/alert';
import { ThreatHeader } from '../components/incidents/ThreatHeader';
import { DetectionSignalsBreakdown } from '../components/incidents/DetectionSignalsBreakdown';
import { EvidenceList } from '../components/shared/EvidenceList';
import { MitreBadge } from '../components/shared/MitreBadge';
import { RecommendationCard } from '../components/shared/RecommendationCard';
import { ApprovalControl } from '../components/shared/ApprovalControl';
import { Code } from 'lucide-react';

interface IncidentDetailProps {
  incidentId: string;
  onBack: () => void;
}

export const IncidentDetail: React.FC<IncidentDetailProps> = ({ incidentId, onBack }) => {
  const [incident, setIncident] = useState<Incident | undefined>(() =>
    incidentService.getById(incidentId)
  );
  const [showRawJson, setShowRawJson] = useState(false);

  useEffect(() => {
    const unsubscribe = incidentService.subscribe(() => {
      setIncident(incidentService.getById(incidentId));
    });
    return unsubscribe;
  }, [incidentId]);

  if (!incident) {
    return (
      <div className="py-16 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Incident Case Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The requested incident ({incidentId}) could not be located in the active SOC database.
        </p>
        <button
          onClick={onBack}
          className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500 cursor-pointer"
        >
          Return to Incident Queue
        </button>
      </div>
    );
  }

  const primaryAlert = incident.alerts[0];

  const handleApprove = (notes: string) => {
    incidentService.approve(incident.id, notes);
  };

  const handleDismiss = (notes: string) => {
    incidentService.dismiss(incident.id, notes);
  };

  const handleEscalate = (notes: string) => {
    incidentService.escalate(incident.id, notes);
  };

  return (
    <div className="space-y-6 py-6 pb-20 max-w-7xl mx-auto">
      
      {/* 1. THREAT HEADER */}
      <ThreatHeader incident={incident} onBack={onBack} />

      {/* 2. MAIN TWO-COLUMN INVESTIGATION WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: WHAT HAPPENED & EVIDENCE (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Multi-Signal Breakdown */}
          {primaryAlert && <DetectionSignalsBreakdown alert={primaryAlert} />}

          {/* Explainable Evidence List */}
          {primaryAlert && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Forensic Evidence & Artifact Chain
                </h4>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
                  {primaryAlert.evidence.length} Indicators
                </span>
              </div>
              <EvidenceList evidence={primaryAlert.evidence} />
            </div>
          )}

          {/* MITRE ATT&CK Techniques */}
          {primaryAlert && primaryAlert.mitre && primaryAlert.mitre.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Adversary MITRE ATT&CK® TTP Mapping
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {primaryAlert.mitre.map((m: MitreTechnique, idx: number) => (
                  <MitreBadge key={idx} technique={m} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PLAYBOOK & APPROVAL GATE (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Action Recommendation */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prescribed Response Playbook
            </h3>
            <RecommendationCard
              action={incident.recommended_action}
              severity={incident.severity}
            />
          </div>

          {/* Human-in-the-loop Approval Control */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Analyst Approval Gate
            </h3>
            <ApprovalControl
              incidentId={incident.id}
              currentStatus={incident.status}
              onApprove={handleApprove}
              onDismiss={handleDismiss}
              onEscalate={handleEscalate}
            />
          </div>

          {/* Notes and Context */}
          {incident.notes && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Analyst Log Notes:
              </span>
              <p className="text-slate-500 dark:text-slate-400">{incident.notes}</p>
            </div>
          )}

          {/* Raw JSON Debug View */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Security Audit JSON</span>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Code className="h-3.5 w-3.5" />
                <span>{showRawJson ? 'Hide JSON' : 'Inspect Raw Contract'}</span>
              </button>
            </div>

            {showRawJson && (
              <pre className="max-h-60 overflow-auto rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-teal-300 border border-slate-800">
                {JSON.stringify(incident, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
