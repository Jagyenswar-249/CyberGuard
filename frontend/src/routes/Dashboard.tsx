import React, { useState, useEffect } from 'react';
import { incidentService } from '../services/incidentService';
import type { DashboardSummary, RiskTier } from '../types/alert';
import { AttentionBand } from '../components/dashboard/AttentionBand';
import { SeverityTiles } from '../components/dashboard/SeverityTiles';
import { ScenarioCounters } from '../components/dashboard/ScenarioCounters';
import { TimelineChart } from '../components/dashboard/TimelineChart';
import { RecentIncidentsList } from '../components/dashboard/RecentIncidentsList';
import { Activity, Zap, Sparkles, RefreshCw } from 'lucide-react';

interface DashboardProps {
  onNavigate: (route: string, param?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<DashboardSummary>(() =>
    incidentService.getDashboardSummary()
  );

  useEffect(() => {
    const unsubscribe = incidentService.subscribe(() => {
      setSummary(incidentService.getDashboardSummary());
    });
    return unsubscribe;
  }, []);

  const handleRefresh = () => {
    setSummary(incidentService.getDashboardSummary());
  };

  return (
    <div className="space-y-6 py-6 pb-20 max-w-7xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Security Operations Command (SOC) Overview
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time threat telemetry, multi-signal scoring, and active containment triage queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Scan URL / Threat</span>
          </button>

          <button
            onClick={() => onNavigate('analyze_identity')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-300 transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>Deepfake Inspector</span>
          </button>

          <button
            onClick={handleRefresh}
            title="Refresh SOC Telemetry"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-teal-500 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 1. ATTENTION BAND */}
      <AttentionBand
        item={summary.attention_band}
        onSelectIncident={(id: string) => onNavigate('incident_detail', id)}
      />

      {/* 2. SEVERITY TILES */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Alert Severity Distribution
        </h2>
        <SeverityTiles
          counts={summary.by_severity}
          onFilterSeverity={(tier: RiskTier) => onNavigate('incidents', tier)}
        />
      </div>

      {/* 3. SCENARIO COUNTERS */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Threat Vectors & Analyzers
        </h2>
        <ScenarioCounters
          counts={summary.by_threat_type}
          onSelectScenario={(scenario: string) => {
            if (scenario === 'phishing_url') onNavigate('analyze_url');
            else if (scenario === 'impersonation' || scenario === 'deepfake') onNavigate('analyze_identity');
            else onNavigate('analyze_behavior');
          }}
        />
      </div>

      {/* 4. ATTACK TIMELINE CHART & RECENT INCIDENTS QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-2">
          <TimelineChart timeline={summary.timeline} />
        </div>

        <div className="lg:col-span-6 space-y-2">
          <RecentIncidentsList
            incidents={summary.recent_incidents}
            onSelectIncident={(id: string) => onNavigate('incident_detail', id)}
            onViewAll={() => onNavigate('incidents')}
          />
        </div>
      </div>
    </div>
  );
};
