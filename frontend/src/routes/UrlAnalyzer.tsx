import React from 'react';
import { UrlPhishingScanner } from '../components/analyzer/UrlPhishingScanner';
import { Zap } from 'lucide-react';

interface UrlAnalyzerProps {
  onNavigate: (route: string, param?: string) => void;
}

export const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 py-6 pb-20 max-w-5xl mx-auto">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            URL & Phishing Threat Analyzer
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Evaluates URL lexical patterns, homoglyphs, brand spoofing, and checks live URLhaus/VirusTotal threat intelligence feeds.
        </p>
      </div>

      <UrlPhishingScanner
        onIncidentCreated={(id) => onNavigate('incident_detail', id)}
      />
    </div>
  );
};
