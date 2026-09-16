import React, { useState, useEffect } from 'react';
import { incidentService } from '../services/incidentService';
import type { Incident } from '../types/alert';
import { RiskBadge } from '../components/shared/RiskBadge';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Layers, Search, ArrowUpRight, PlusCircle } from 'lucide-react';

interface IncidentsProps {
  onNavigate: (route: string, param?: string) => void;
  initialFilter?: string;
}

export const Incidents: React.FC<IncidentsProps> = ({ onNavigate, initialFilter }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => incidentService.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>(initialFilter || 'all');

  useEffect(() => {
    const unsubscribe = incidentService.subscribe(() => {
      setIncidents(incidentService.getAll());
    });
    return unsubscribe;
  }, []);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.summary || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || inc.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || inc.severity === selectedSeverity;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-6 py-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              SOC Incident Management Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Correlated multi-alert incident cases requiring analyst investigation and human approval.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Ingest New Threat</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3.5 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search incident title, case ID, or summary..."
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Lifecycle States</option>
            <option value="Open">Open (Pending)</option>
            <option value="Contained">Contained (Approved)</option>
            <option value="Dismissed">Dismissed</option>
            <option value="Escalated">Escalated</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* INCIDENTS TABLE */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-sm backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Title & Context</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Analyst</th>
                <th className="py-3 px-4">Opened</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No incidents match your current filter.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => onNavigate('incident_detail', incident.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <RiskBadge tier={incident.severity} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {incident.id}
                    </td>

                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-500 transition-colors">
                        {incident.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {incident.summary}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={incident.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {incident.assigned_to || 'Unassigned'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(incident.opened_at).toLocaleDateString()} {new Date(incident.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:underline">
                        <span>Investigate</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
