import React, { useState } from 'react';
import { INITIAL_ALERTS } from '../mocks/mock-data';
import type { Alert, ThreatType } from '../types/alert';
import { RiskBadge } from '../components/shared/RiskBadge';
import { ConfidenceIndicator } from '../components/shared/ConfidenceIndicator';
import { Bell, Search, Zap, UserCheck, Activity, Sparkles } from 'lucide-react';

interface AlertsProps {
  onNavigate?: (route: string, param?: string) => void;
}

export const Alerts: React.FC<AlertsProps> = () => {
  const [alerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedThreat, setSelectedThreat] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.alert_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.details?.target || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.details?.sender || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = selectedTier === 'all' || alert.risk_tier === selectedTier;
    const matchesThreat = selectedThreat === 'all' || alert.threat_type === selectedThreat;

    return matchesSearch && matchesTier && matchesThreat;
  });

  const getThreatIcon = (type: ThreatType) => {
    switch (type) {
      case 'phishing_url':
      case 'phishing_email':
        return <Zap className="h-4 w-4 text-teal-500" />;
      case 'impersonation':
        return <UserCheck className="h-4 w-4 text-purple-400" />;
      case 'deepfake':
        return <Sparkles className="h-4 w-4 text-rose-400" />;
      case 'account_takeover':
        return <Activity className="h-4 w-4 text-orange-400" />;
    }
  };

  return (
    <div className="space-y-6 py-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Raw Detection Alerts Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time feed of multi-engine threat detections before and during incident correlation.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3.5 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by ID, target URL, sender, or target..."
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Safe">Safe</option>
          </select>

          {/* Threat Vector Filter */}
          <select
            value={selectedThreat}
            onChange={(e) => setSelectedThreat(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Threat Types</option>
            <option value="phishing_url">Phishing URL</option>
            <option value="impersonation">Impersonation</option>
            <option value="deepfake">Deepfake Media</option>
            <option value="account_takeover">Account Takeover</option>
          </select>
        </div>
      </div>

      {/* ALERTS TABLE */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-sm backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Threat Type</th>
                <th className="py-3 px-4">Target / Entity</th>
                <th className="py-3 px-4">Risk & Confidence</th>
                <th className="py-3 px-4">MITRE Mapping</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No detection alerts match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.alert_id}
                    onClick={() => setSelectedAlert(alert)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <RiskBadge tier={alert.risk_tier} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {alert.alert_id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 capitalize">
                        {getThreatIcon(alert.threat_type)}
                        <span>{alert.threat_type.replace('_', ' ')}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {alert.details?.target || alert.details?.sender || alert.source_entity_id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {Math.round(alert.risk_score * 100)}%
                        </span>
                        <div className="w-16">
                          <ConfidenceIndicator confidence={alert.confidence} showPercentage={false} />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {alert.mitre[0] ? (
                        <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                          {alert.mitre[0].technique_id}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400">
                      {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALERT QUICK VIEW MODAL */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <RiskBadge tier={selectedAlert.risk_tier} size="md" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Alert Inspection: {selectedAlert.alert_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-mono break-all">
                Entity: {selectedAlert.details?.target || selectedAlert.details?.sender || selectedAlert.source_entity_id}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-slate-400">Evidence</h4>
                <div className="space-y-2">
                  {selectedAlert.evidence.map((ev, i) => (
                    <div key={i} className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                      {ev.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
