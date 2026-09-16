import React from 'react';
import { Incident } from '../../types/alert';
import { RiskBadge } from '../shared/RiskBadge';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { ArrowLeft, Clock, User, ShieldCheck, Tag } from 'lucide-react';

interface ThreatHeaderProps {
  incident: Incident;
  onBack: () => void;
}

export const ThreatHeader: React.FC<ThreatHeaderProps> = ({ incident, onBack }) => {
  const primaryAlert = incident.alerts[0];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Incident Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400">Case ID: {incident.id}</span>
          <StatusBadge status={incident.status} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <RiskBadge tier={incident.severity} size="lg" />
            <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {incident.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {incident.summary}
          </p>
        </div>

        {/* Confidence & Risk metric box */}
        {primaryAlert && (
          <div className="flex items-center gap-4 rounded-lg bg-slate-50 dark:bg-slate-800/70 p-3.5 border border-slate-200 dark:border-slate-700/60 shrink-0">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-semibold text-slate-400">
                Threat Risk
              </div>
              <div
                className={`text-xl font-bold font-mono ${
                  primaryAlert.risk_score >= 0.8
                    ? 'text-red-500 dark:text-red-400'
                    : primaryAlert.risk_score >= 0.5
                    ? 'text-orange-500 dark:text-orange-400'
                    : 'text-teal-500'
                }`}
              >
                {Math.round(primaryAlert.risk_score * 100)}%
              </div>
            </div>

            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />

            <div className="min-w-[130px]">
              <ConfidenceIndicator confidence={primaryAlert.confidence} />
            </div>
          </div>
        )}
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Opened: {new Date(incident.opened_at).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span>Lead Analyst: {incident.assigned_to || 'Unassigned'}</span>
        </div>
        {incident.closed_at && (
          <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Contained at: {new Date(incident.closed_at).toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
