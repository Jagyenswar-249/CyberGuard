export type ThreatType = 
  | 'phishing_url' 
  | 'phishing_email' 
  | 'impersonation' 
  | 'account_takeover' 
  | 'deepfake';

export type RiskTier = 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Open' | 'Contained' | 'Dismissed' | 'Escalated';

export interface Evidence {
  signal: 'ml_model' | 'heuristic' | 'threat_intel' | 'identity' | 'behavior' | 'synthetic_ai';
  text: string;
  confidence?: number;
}

export interface MitreTechnique {
  technique_id: string;
  name: string;
  tactic: string;
  description?: string;
}

export interface RecommendedAction {
  primary: string;
  secondary?: string[];
  requires_human_approval: boolean;
}

export interface Alert {
  alert_id: string;
  threat_type: ThreatType;
  risk_tier: RiskTier;
  risk_score: number; // 0.0 - 1.0
  confidence: number; // 0.0 - 1.0
  evidence: Evidence[];
  mitre: MitreTechnique[];
  recommended_action: RecommendedAction;
  data_completeness_note: string;
  source_entity_id: string;
  source_entity_type: 'url' | 'email' | 'login_event' | 'media';
  created_at: string;
  ml_score?: number;
  heuristic_score?: number;
  threat_intel_score?: number;
  identity_score?: number;
  behavior_score?: number;
  synthetic_score?: number;
  details?: {
    target?: string;
    sender?: string;
    organization?: string;
    ip_address?: string;
    location?: string;
    homoglyph_detected?: boolean;
    dns_valid?: boolean;
    ssl_valid?: boolean;
    virustotal_positives?: number;
    urlhaus_status?: string;
    face_artifact_score?: number;
    voice_spectral_jitter?: number;
  };
}

export interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  severity: RiskTier;
  assigned_to?: string | null;
  opened_at: string;
  closed_at?: string | null;
  notes?: string;
  alerts: Alert[];
  recommended_action: RecommendedAction;
  summary?: string;
}

export interface DashboardSummary {
  total_events: number;
  by_severity: Record<RiskTier, number>;
  by_threat_type: Record<string, number>;
  timeline: {
    date: string;
    count: number;
    critical: number;
    high: number;
  }[];
  recent_incidents: Incident[];
  attention_band?: {
    incident_id: string;
    title: string;
    severity: RiskTier;
    time: string;
    summary: string;
  } | null;
}
