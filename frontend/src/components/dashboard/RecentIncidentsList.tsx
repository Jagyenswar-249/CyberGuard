import React from 'react';
import { Incident, RiskTier } from '../../types/alert';
import { RiskBadge } from '../shared/RiskBadge';
import { StatusBadge } from '../shared/StatusBadge';
import { ArrowUpRight, ShieldAlert, Clock, ChevronRight } from 'lucide-react';

interface RecentIncidentsListProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onViewAll?: () => void;
}

export const RecentIncidentsList: React.FC<RecentIncidentsListProps> = ({
  incidents,
  onSelectIncident,
  onViewAll
}) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-sm backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Active SOC Incident Triage Queue
          </h3>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Incidents</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {incidents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No incidents currently in queue.
          </div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => onSelectIncident(incident.id)}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <RiskBadge tier={incident.severity} size="sm" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {incident.id}
                    </span>
                    <StatusBadge status={incident.status} size="sm" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-500 transition-colors">
                    {incident.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
                    {incident.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {incident.assigned_to || 'Unassigned'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(incident.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="h-7 w-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-teal-500 group-hover:bg-teal-500/10 transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
