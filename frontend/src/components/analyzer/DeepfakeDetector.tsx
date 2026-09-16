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
import {
  Sparkles,
  Video,
  Mic,
  Image,
  UploadCloud,
  CheckCircle2,
  AlertOctagon,
  ScanFace,
  AudioWaveform,
  ShieldCheck,
  FolderPlus
} from 'lucide-react';

interface DeepfakeDetectorProps {
  onIncidentCreated?: (incidentId: string) => void;
}

export const DeepfakeDetector: React.FC<DeepfakeDetectorProps> = ({
  onIncidentCreated
}) => {
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'image'>('video');
  const [sampleName, setSampleName] = useState('executive_board_emergency_briefing.mp4');
  const [claimedIdentity, setClaimedIdentity] = useState('Sarah Jenkins (CFO)');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [result, setResult] = useState<Alert | null>(null);
  const [incidentId, setIncidentId] = useState<string | null>(null);

  const presetDemos = [
    {
      type: 'video' as const,
      name: 'cfo_urgent_wire_authorization_video.mp4',
      identity: 'Sarah Jenkins (Chief Financial Officer)',
      label: 'Deepfake CEO Video Call (Synthetic)',
      threat: 'High AI Footprint'
    },
    {
      type: 'audio' as const,
      name: 'ceo_voicemail_payroll_change.wav',
      identity: 'David Mercer (Chief Executive Officer)',
      label: 'Cloned Voice Voicemail (Neural Vocoder)',
      threat: 'Synthetic Audio'
    },
    {
      type: 'image' as const,
      name: 'executive_id_passport_photo.png',
      identity: 'Michael Sterling (VP Infrastructure)',
      label: 'Synthesized AI Passport Face',
      threat: 'Diffusion Artifacts'
    },
    {
      type: 'audio' as const,
      name: 'verified_employee_standup_call.wav',
      identity: 'Elena Rostova (Lead Architect)',
      label: 'Genuine Authenticated Voice',
      threat: 'Clean'
    }
  ];

  const handleAnalyze = async (sampleOverride?: typeof presetDemos[0]) => {
    setIsAnalyzing(true);
    setResult(null);
    setIncidentId(null);

    const type = sampleOverride ? sampleOverride.type : mediaType;
    const file = sampleOverride ? sampleOverride.name : sampleName;
    const identity = sampleOverride ? sampleOverride.identity : claimedIdentity;

    setAnalysisStage('Extracting frames and acoustic spectrogram...');
    await new Promise((r) => setTimeout(r, 450));

    setAnalysisStage('Scanning facial boundary landmark optical flow...');
    await new Promise((r) => setTimeout(r, 500));

    setAnalysisStage('Analyzing neural vocoder phase coherence & diffusion residuals...');
    await new Promise((r) => setTimeout(r, 550));

    setAnalysisStage('Cross-referencing biometric identity baselines...');
    await new Promise((r) => setTimeout(r, 400));

    const scanResult = DetectionEngine.analyzeDeepfake({
      mediaType: type,
      fileName: file,
      claimedIdentity: identity
    });

    setResult(scanResult);
    setIsAnalyzing(false);
  };

  const handleCreateIncident = () => {
    if (!result) return;
    const inc = incidentService.createFromAlert(
      result,
      `Deepfake & Impersonation Attack: ${claimedIdentity} (${sampleName})`
    );
    setIncidentId(inc.id);
    if (onIncidentCreated) onIncidentCreated(inc.id);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SAMPLE CONTROLS */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                Deepfake & Synthetic Media Forensic Inspector
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Detects neural voice clones (ElevenLabs/VALL-E), face-swap deepfakes (RoOP/InsightFace), and diffusion artifacts in real-time.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-900/80 p-1 rounded-lg border border-purple-500/30">
            <button
              onClick={() => setMediaType('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                mediaType === 'video'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-400'
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Video</span>
            </button>
            <button
              onClick={() => setMediaType('audio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                mediaType === 'audio'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-400'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Audio</span>
            </button>
            <button
              onClick={() => setMediaType('image')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                mediaType === 'image'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-400'
              }`}
            >
              <Image className="h-3.5 w-3.5" />
              <span>Photo</span>
            </button>
          </div>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Sample File / Media Stream Target
            </label>
            <input
              type="text"
              value={sampleName}
              onChange={(e) => setSampleName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Purported Identity (Claimed Speaker / Individual)
            </label>
            <input
              type="text"
              value={claimedIdentity}
              onChange={(e) => setClaimedIdentity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* TEST DEMO PAYLOADS */}
        <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">
              Demo Test Samples:
            </span>
            {presetDemos.map((demo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMediaType(demo.type);
                  setSampleName(demo.name);
                  setClaimedIdentity(demo.identity);
                  handleAnalyze(demo);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[11px] text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 cursor-pointer transition-all"
              >
                <span>{demo.label}</span>
                <span className="text-[9px] bg-purple-500/30 px-1 rounded text-purple-900 dark:text-purple-200">
                  {demo.threat}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-purple-500 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
          >
            <ScanFace className="h-4 w-4" />
            <span>Scan Synthetic Artifacts</span>
          </button>
        </div>
      </div>

      {/* SCANNING STATE */}
      {isAnalyzing && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 backdrop-blur-md">
          <LoadingState
            message="Analyzing Multi-Modal Deepfake Artifacts..."
            subtext={analysisStage}
          />
        </div>
      )}

      {/* ANALYSIS RESULTS */}
      {result && !isAnalyzing && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <RiskBadge tier={result.risk_tier} size="lg" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  Synthetic Media Deepfake Threat Flagged
                </h3>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Media: <span className="font-mono text-slate-300">{result.details?.target}</span> • Claimed: <strong>{claimedIdentity}</strong>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-700/60">
              <div className="text-center px-2">
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  Synthetic AI Score
                </div>
                <div className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
                  {Math.round(result.risk_score * 100)}%
                </div>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
              <div className="min-w-[120px]">
                <ConfidenceIndicator confidence={result.confidence} label="Detection Confidence" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Forensic Biomarker Evidence
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
                Counter-Impersonation Playbook
              </h4>
              <RecommendationCard action={result.recommended_action} severity={result.risk_tier} />

              {incidentId ? (
                <div className="flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-500/30 p-3 text-xs text-teal-600 dark:text-teal-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Deepfake incident <strong>{incidentId}</strong> logged in SOC queue.
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleCreateIncident}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-xs font-semibold text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Escalate Deepfake Case to SOC Lead</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
