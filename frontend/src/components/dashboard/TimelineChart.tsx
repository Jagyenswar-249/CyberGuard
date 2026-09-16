import React, { useState } from 'react';
import { TrendingUp, Clock, Filter } from 'lucide-react';

interface TimelineDataPoint {
  date: string;
  count: number;
  critical: number;
  high: number;
}

interface TimelineChartProps {
  timeline: TimelineDataPoint[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ timeline }) => {
  const [range, setRange] = useState<'24h' | '7d'>('24h');
  const maxCount = Math.max(...timeline.map((d) => d.count), 60);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 shadow-sm backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Threat Velocity & Attack Progression Timeline
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setRange('24h')}
            className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
              range === '24h'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setRange('7d')}
            className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
              range === '7d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      {/* SVG / Bar Chart Representation */}
      <div className="pt-4 pb-2">
        <div className="flex items-end justify-between gap-2 h-44 px-2">
          {timeline.map((point, idx) => {
            const heightPercent = (point.count / maxCount) * 100;
            const criticalHeight = (point.critical / point.count) * 100;
            const highHeight = (point.high / point.count) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-slate-800 text-white px-1.5 py-0.5 rounded shadow pointer-events-none mb-1">
                  {point.count} alerts ({point.critical} crit)
                </div>

                <div className="w-full max-w-[48px] rounded-t-md overflow-hidden bg-slate-200 dark:bg-slate-800 flex flex-col justify-end transition-all duration-300 group-hover:brightness-110" style={{ height: `${heightPercent}%` }}>
                  {/* Critical slice */}
                  <div
                    className="w-full bg-red-500/80 transition-all"
                    style={{ height: `${criticalHeight}%` }}
                    title={`Critical: ${point.critical}`}
                  />
                  {/* High slice */}
                  <div
                    className="w-full bg-orange-500/80 transition-all"
                    style={{ height: `${highHeight}%` }}
                    title={`High: ${point.high}`}
                  />
                  {/* Regular slice */}
                  <div
                    className="w-full bg-teal-500/70 flex-1 transition-all"
                    title={`Standard/Low: ${point.count - point.critical - point.high}`}
                  />
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  {point.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
          <span>Critical Severity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-orange-500" />
          <span>High Severity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" />
          <span>Standard & Low Severity</span>
        </div>
      </div>
    </div>
  );
};
