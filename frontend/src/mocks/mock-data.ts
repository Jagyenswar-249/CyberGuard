import type { Incident, Alert, DashboardSummary } from '../types/alert';

export const INITIAL_ALERTS: Alert[] = [
  {
    alert_id: 'alt-url-8891',
    threat_type: 'phishing_url',
    risk_tier: 'Critical',
    risk_score: 0.94,
    confidence: 0.92,
    source_entity_id: 'url-entity-01',
    source_entity_type: 'url',
    created_at: '2026-09-16T09:14:22Z',
    ml_score: 0.96,
    heuristic_score: 0.92,
    threat_intel_score: 0.95,
    data_completeness_note: 'VirusTotal & URLhaus live correlation complete. 18 engine hits detected.',
    details: {
      target: 'https://secure-login-paypa1-update.com/account/auth?ref=urgent_notice',
      homoglyph_detected: true,
      dns_valid: true,
      ssl_valid: true,
      virustotal_positives: 18,
      urlhaus_status: 'Active Phishing Campaign (Hostinger/Cloudflare proxy)'
    },
    evidence: [
      {
        signal: 'ml_model',
        text: 'PhishMind Random Forest classifier scored URL lexical structure at 0.96 (high token entropy, deceptive brand keyword insertion).',
        confidence: 0.96
      },
      {
        signal: 'heuristic',
        text: 'Homoglyph spoof detected: Latin lowercase "1" substituted for "l" in claimed brand name "paypa1".',
        confidence: 0.98
      },
      {
        signal: 'threat_intel',
        text: 'Domain registered 48 hours ago via Privacy Protect Registrar. Correlated with active URLhaus credential harvesting campaign #49102.',
        confidence: 0.94
      }
    ],
    mitre: [
      {
        technique_id: 'T1566.002',
        name: 'Spearphishing Link',
        tactic: 'Initial Access',
        description: 'Adversaries send spearphishing messages with a malicious link designed to lure target users to malicious websites.'
      },
      {
        technique_id: 'T1585.002',
        name: 'Establish Accounts: Email Accounts',
        tactic: 'Resource Development',
        description: 'Adversaries create email accounts that can be used during targeting to send phishing emails.'
      }
    ],
    recommended_action: {
      primary: 'Block Domain & Revoke Session Tokens',
      secondary: [
        'Push domain IOC to border firewall & DNS sinkhole',
        'Notify 4 employees who clicked link within 15 minutes',
        'Trigger automated credential reset for affected identity'
      ],
      requires_human_approval: true
    }
  },
  {
    alert_id: 'alt-id-7721',
    threat_type: 'impersonation',
    risk_tier: 'High',
    risk_score: 0.86,
    confidence: 0.89,
    source_entity_id: 'email-entity-02',
    source_entity_type: 'email',
    created_at: '2026-09-16T08:42:10Z',
    ml_score: 0.84,
    heuristic_score: 0.88,
    identity_score: 0.91,
    data_completeness_note: 'DKIM validation failed. Sender domain stylometry deviation > 82%.',
    details: {
      sender: 'cfo-sarah.jenkins@corp-global-finance-desk.com',
      organization: 'Global Enterprise Treasury',
      homoglyph_detected: true
    },
    evidence: [
      {
        signal: 'identity',
        text: 'Lookalike domain registered using hyphenated pattern matching executive board naming convention.',
        confidence: 0.91
      },
      {
        signal: 'heuristic',
        text: 'High urgency stylometry score (urgency lexicon density: 34%, request for wire transaction without standard PO).',
        confidence: 0.88
      },
      {
        signal: 'threat_intel',
        text: 'SPF softfail and DKIM signature alignment mismatch for purported sender origin.',
        confidence: 0.87
      }
    ],
    mitre: [
      {
        technique_id: 'T1656',
        name: 'Impersonation',
        tactic: 'Defense Evasion',
        description: 'Adversaries impersonate a trusted entity or person to manipulate victims into executing unauthorized actions.'
      },
      {
        technique_id: 'T1566.001',
        name: 'Spearphishing Attachment',
        tactic: 'Initial Access',
        description: 'Adversaries send spearphishing messages with a malicious attachment to execute code.'
      }
    ],
    recommended_action: {
      primary: 'Quarantine Email & Flag Sender Domain',
      secondary: [
        'Issue CEO/CFO Fraud Alert to Finance Department',
        'Blacklist sender domain across Microsoft 365 Exchange'
      ],
      requires_human_approval: true
    }
  },
  {
    alert_id: 'alt-df-9012',
    threat_type: 'deepfake',
    risk_tier: 'Critical',
    risk_score: 0.91,
    confidence: 0.88,
    source_entity_id: 'media-entity-03',
    source_entity_type: 'media',
    created_at: '2026-09-16T08:15:00Z',
    synthetic_score: 0.94,
    data_completeness_note: 'Spectral frequency analysis & facial landmark boundary scan completed.',
    details: {
      face_artifact_score: 0.92,
      voice_spectral_jitter: 0.89,
      target: 'Executive Video Call Recording / Voicemail Sample'
    },
    evidence: [
      {
        signal: 'synthetic_ai',
        text: 'Facial boundary inconsistent with optical flow vectors; lip-sync phoneme discrepancy exceeds 140ms.',
        confidence: 0.93
      },
      {
        signal: 'synthetic_ai',
        text: 'Synthetic voice harmonics show abnormal phase coherence typical of neural vocoder generation (ElevenLabs v2 footprint).',
        confidence: 0.89
      },
      {
        signal: 'heuristic',
        text: 'Metadata indicates video file re-encoded 3 times with altered timestamp headers.',
        confidence: 0.82
      }
    ],
    mitre: [
      {
        technique_id: 'T1583.008',
        name: 'Acquire Infrastructure: Malicious Personas',
        tactic: 'Resource Development',
        description: 'Adversaries create deepfake audiovisual assets to support social engineering and verification bypass.'
      }
    ],
    recommended_action: {
      primary: 'Block Voice/Video Channel & Require Out-of-Band Verification',
      secondary: [
        'Lock pending financial authorization request',
        'Initiate cryptographic identity reverification with executive'
      ],
      requires_human_approval: true
    }
  },
  {
    alert_id: 'alt-ato-4419',
    threat_type: 'account_takeover',
    risk_tier: 'High',
    risk_score: 0.83,
    confidence: 0.87,
    source_entity_id: 'login-entity-04',
    source_entity_type: 'login_event',
    created_at: '2026-09-16T07:22:45Z',
    behavior_score: 0.88,
    data_completeness_note: 'Impossible travel detected between London (06:40 UTC) and Singapore (07:20 UTC).',
    details: {
      ip_address: '103.253.42.19',
      location: 'Singapore, SG (Previous: London, UK)',
      target: 'User: dev-admin@cyberguard.org'
    },
    evidence: [
      {
        signal: 'behavior',
        text: 'Geo-velocity impossible travel: 10,800 km distance elapsed in 40 minutes (velocity > 16,000 km/h).',
        confidence: 0.99
      },
      {
        signal: 'behavior',
        text: 'New unseen device fingerprint hash with headless Chrome browser user-agent.',
        confidence: 0.84
      },
      {
        signal: 'threat_intel',
        text: 'Origin IP 103.253.42.19 is flagged on AbuseIPDB with 84% confidence of being a commercial proxy node.',
        confidence: 0.86
      }
    ],
    mitre: [
      {
        technique_id: 'T1078.004',
        name: 'Valid Accounts: Cloud Accounts',
        tactic: 'Defense Evasion / Initial Access',
        description: 'Adversaries steal credentials to authenticate to cloud services as legitimate users.'
      },
      {
        technique_id: 'T1110.001',
        name: 'Brute Force: Password Guessing',
        tactic: 'Credential Access',
        description: 'Adversaries attempt combinations of passwords against known accounts.'
      }
    ],
    recommended_action: {
      primary: 'Terminate Active Sessions & Enforce Hardware MFA',
      secondary: [
        'Invalidate OAuth refresh tokens',
        'Temporarily restrict privileged IAM roles pending analyst sign-off'
      ],
      requires_human_approval: true
    }
  },
  {
    alert_id: 'alt-url-3310',
    threat_type: 'phishing_url',
    risk_tier: 'Medium',
    risk_score: 0.58,
    confidence: 0.76,
    source_entity_id: 'url-entity-05',
    source_entity_type: 'url',
    created_at: '2026-09-16T06:10:00Z',
    ml_score: 0.54,
    heuristic_score: 0.62,
    threat_intel_score: 0.60,
    data_completeness_note: 'Heuristic keyword match on newly registered TLD (.xyz).',
    details: {
      target: 'https://internal-docs-sharepoint-sync.xyz/download',
      homoglyph_detected: false,
      dns_valid: true
    },
    evidence: [
      {
        signal: 'heuristic',
        text: 'Domain uses brand keyword "sharepoint" under suspicious low-reputation top-level domain (.xyz).',
        confidence: 0.72
      },
      {
        signal: 'threat_intel',
        text: 'No prior history on major reputation feeds, registered 12 days ago.',
        confidence: 0.78
      }
    ],
    mitre: [
      {
        technique_id: 'T1566.002',
        name: 'Spearphishing Link',
        tactic: 'Initial Access'
      }
    ],
    recommended_action: {
      primary: 'Flag URL for Threat Analyst Inspection',
      secondary: ['Warn recipient user', 'Monitor DNS query frequency'],
      requires_human_approval: false
    }
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-9081',
    title: 'Deceptive Banking Spearphishing Campaign (PayPa1 Homoglyph)',
    status: 'Open',
    severity: 'Critical',
    assigned_to: 'Alex Vance (SOC Analyst)',
    opened_at: '2026-09-16T09:15:00Z',
    summary: 'Mass targeted credential harvesting wave utilizing homoglyph lookalike domains and multi-hop Cloudflare proxies targeting enterprise treasury accounts.',
    alerts: [INITIAL_ALERTS[0]],
    recommended_action: INITIAL_ALERTS[0].recommended_action,
    notes: 'Awaiting SOC Lead approval for automated perimeter DNS sinkhole rollout.'
  },
  {
    id: 'inc-9079',
    title: 'Synthetic Executive Voice & Video Deepfake Fraud Attempt',
    status: 'Open',
    severity: 'Critical',
    opened_at: '2026-09-16T08:20:00Z',
    assigned_to: 'Alex Vance (SOC Analyst)',
    summary: 'High-fidelity AI audio/video deepfake masquerading as Chief Financial Officer attempting urgent wire transfer rerouting.',
    alerts: [INITIAL_ALERTS[2]],
    recommended_action: INITIAL_ALERTS[2].recommended_action,
    notes: 'Out-of-band verification confirmed actual CFO was traveling without making requests.'
  },
  {
    id: 'inc-9074',
    title: 'Executive C-Suite Impersonation & BEC Wire Transfer Scheme',
    status: 'Contained',
    severity: 'High',
    opened_at: '2026-09-16T08:45:00Z',
    closed_at: '2026-09-16T09:05:00Z',
    assigned_to: 'Elena Rostova (SOC Lead)',
    summary: 'Targeted spearphishing campaign imitating corporate treasury using DKIM-spoofed lookalike domain.',
    alerts: [INITIAL_ALERTS[1]],
    recommended_action: INITIAL_ALERTS[1].recommended_action,
    notes: 'Sender quarantined domain-wide. Microsoft 365 transport rule updated.'
  },
  {
    id: 'inc-9068',
    title: 'Anomalous Cloud Account Takeover via Impossible Travel',
    status: 'Contained',
    severity: 'High',
    opened_at: '2026-09-16T07:25:00Z',
    closed_at: '2026-09-16T07:50:00Z',
    assigned_to: 'Alex Vance (SOC Analyst)',
    summary: 'Authentication attempt from headless automated client located across 8 timezone boundaries within 40 minutes of legitimate session.',
    alerts: [INITIAL_ALERTS[3]],
    recommended_action: INITIAL_ALERTS[3].recommended_action,
    notes: 'User credentials rotated, hardware FIDO2 key re-enrolled.'
  },
  {
    id: 'inc-9055',
    title: 'Suspicious Cloud Storage Phishing Sharepoint Clone',
    status: 'Dismissed',
    severity: 'Medium',
    opened_at: '2026-09-16T06:15:00Z',
    closed_at: '2026-09-16T06:40:00Z',
    assigned_to: 'Alex Vance (SOC Analyst)',
    summary: 'Internal test phishing simulation email submitted by end-user via report button.',
    alerts: [INITIAL_ALERTS[4]],
    recommended_action: INITIAL_ALERTS[4].recommended_action,
    notes: 'Verified as authorized red-team security awareness training campaign.'
  }
];

export const INITIAL_DASHBOARD_SUMMARY: DashboardSummary = {
  total_events: 184,
  by_severity: {
    Safe: 48,
    Low: 52,
    Medium: 42,
    High: 28,
    Critical: 14
  },
  by_threat_type: {
    phishing_url: 82,
    phishing_email: 36,
    impersonation: 29,
    account_takeover: 23,
    deepfake: 14
  },
  timeline: [
    { date: '00:00', count: 12, critical: 1, high: 2 },
    { date: '04:00', count: 8, critical: 0, high: 1 },
    { date: '08:00', count: 34, critical: 4, high: 6 },
    { date: '12:00', count: 52, critical: 5, high: 9 },
    { date: '16:00', count: 46, critical: 3, high: 7 },
    { date: '20:00', count: 32, critical: 1, high: 3 }
  ],
  recent_incidents: INITIAL_INCIDENTS,
  attention_band: {
    incident_id: 'inc-9081',
    title: 'Active High-Velocity Phishing Wave (PayPa1 Homoglyph)',
    severity: 'Critical',
    time: '8m ago',
    summary: '18 threat intel detections across enterprise endpoints. Requires immediate SOC response authorization.'
  }
};
