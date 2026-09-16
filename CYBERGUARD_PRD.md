# CYBERGUARD — Product Requirements Document

## 1. Document Control

| Field | Value |
|---|---|
| Project | CYBERGUARD — AI-Powered Cyber Threat, Phishing & Digital Impersonation Detection and Response System |
| Document | PRD.md |
| Version | 1.0 |
| Status | Draft — pending Phase 1 approval |
| Date | 2026-09-13 |
| Source documents | Problem_Statement_9.pdf (PS09, official) · CYBERGUARD_BLUEPRINT.md · CyberGuard_Execution_Plan.pdf · CyberGuard_Frontend_Readiness_Assessment_&_Implementation_Spec.pdf · ARCHITECTURE.md (legacy) · Phase 0 Tech Stack Recommendation + Reanalysis (approved) |
| Product owner | [OPEN DECISION — assign team member] |
| Technical owner | [OPEN DECISION — assign team member] |

**[CONFIRMED]** Phase 0 approved the following implementation stack, referenced throughout this document only where technology must be named: backend — FastAPI (Python); database — PostgreSQL; ML/detection — scikit-learn + existing PhishMind model, used as-is; deployment — Docker Compose. Frontend technology (React + TypeScript, per the Phase 0 reanalysis) is named in Section 27 (Dependencies) and in the architecture document, not baked into the functional frontend requirements in Section 18 — those are stated framework-agnostically per the agreed PRD/Architecture separation.

---

## 2. Executive Summary

**[CONFIRMED — PS09]** The official problem statement calls for an AI-powered system that detects, classifies, scores, explains, and recommends a response to cyber threats spanning phishing, digital impersonation/deepfake, and credential theft/account takeover, demonstrated across at least three threat scenarios.

**[CONFIRMED — Blueprint/Execution Plan]** CyberGuard's selected interpretation narrows this into one coherent reasoning pipeline — not three independent detectors — covering exactly three MVP scenarios (phishing URL/email, digital impersonation, account takeover/login-behavior anomaly), with deepfake detection demoted to a stretch capability.

**Differentiator [CONFIRMED — Blueprint §0, Execution Plan §7]:** the product's value is not any single detector but the fusion of ML, heuristic, threat-intelligence, and identity/behavior signals into one risk score, a separately-reported confidence score, structured evidence, a MITRE ATT&CK tag, and a human-approved recommended response — applied identically across all three scenarios via one shared alert contract.

**Hackathon relevance:** this directly targets PS09's stated minimum deliverables (three scenarios, risk scoring, explainable assessment, dashboard, recommended response, architecture documentation, accuracy/performance evaluation) rather than a broader interpretation of the "may" (optional) capabilities PS09 lists.

**Long-term product potential [CONFIRMED — PS09 "Desired Impact"]:** PS09 explicitly frames the desired evolution as an "AI Cyber Defence & Digital Trust Platform" deployable in academic, government, and enterprise contexts. This PRD treats that as directional framing for the Roadmap, not as a current product claim.

---

## 3. Problem Definition

**[CONFIRMED — PS09]** Digital adoption (cloud services, social media, digital payments, e-governance) has increased exposure to sophisticated, often AI-generated cyber threats: convincing phishing, cloned voices, deepfake video, fraudulent identities, and personalized social engineering, alongside technical threats such as credential theft, account takeover, and abnormal system behavior. PS09 states that traditional rule-based systems are often inadequate against these evolving, AI-generated threats.

**[CONFIRMED — Blueprint §2.1]** Additional context (industry trade-press estimates on AI-assisted phishing prevalence) is available but is explicitly labeled `LIKELY`/directional in the Blueprint, not a verified statistic — this PRD does not restate it as fact.

**Why detection alone is insufficient [CONFIRMED — Blueprint §0, §2.3, Execution Plan §1]:** a bare "malicious/not malicious" classification gives a SOC analyst no basis for action. PS09 itself requires threat classification, a risk/severity score, an explanation with evidence, and a recommended response — not a classification alone. CyberGuard's problem framing is therefore: isolated detectors exist and are common (Blueprint §2.2 — "phishing detector alone" rated *Saturated*); the market gap is a system that reasons across signals to produce an actionable, explainable, human-approved decision.

This PRD does not exaggerate the novelty of any single detection technique (e.g., PhishMind's Random Forest core is explicitly framed in the Blueprint as a defensible, not novel, architecture choice — Blueprint §5.1).

---

## 4. Product Vision

CyberGuard **IS [CONFIRMED — Blueprint §0, §17, Execution Plan §1]:**
- A unified security reasoning pipeline: input → detection → threat-intel enrichment → risk fusion → confidence → explanation (XAI) → MITRE mapping → response recommendation → human approval → incident state.
- A multi-signal risk assessment system that separates *risk* (severity if true) from *confidence* (signal agreement/completeness).
- An analyst decision-support tool — it recommends, it does not act autonomously.

CyberGuard **IS NOT [CONFIRMED — Blueprint §0, §10.2, §17; Execution Plan §13, §24]:**
- A full enterprise SIEM.
- An autonomous cyber-defense platform (destructive actions always require human approval — Execution Plan §13, §24; Blueprint §10.2).
- A production-grade deepfake research system (deepfake is a stretch feature using a pretrained, not team-trained, model — Blueprint §5.3, §7.2 Flow 4).
- A replacement for a SOC analyst.
- Three unrelated AI models bolted together (Blueprint §0, §17 — the differentiator is explicitly the fusion/explanation/response layer, not the detectors individually).

---

## 5. Goals

### MVP Goals
- Demonstrate all three required scenarios (phishing, impersonation, ATO) reaching the full Detection → Classification → Risk → Confidence → Explanation → MITRE → Response → Human Approval → Incident chain.
- Reuse PhishMind as-is; do not retrain or re-platform it.
- Ship a working, offline-capable demo by the Oct 5–10, 2026 evaluation window (Blueprint §13, Execution Plan §28).

### Technical Goals
- One shared alert contract across all three detection engines (Section 12/Execution Plan §20).
- Threat-intel enrichment with mandatory local-cache fallback (Blueprint §5.6).
- A measured (not assumed) adversarial-robustness result for PhishMind (Blueprint §11, Execution Plan §23).
- A modular monolith backend — internal module boundaries, no microservices split (ARCHITECTURE.md, Execution Plan §16).

### User Goals
- An analyst can submit a URL/email, a sender/message, or a login event and receive a risk-tiered, evidence-backed, MITRE-tagged alert with a recommended action within one workflow pattern reused across all three inputs.
- An analyst can approve, dismiss, or escalate a recommended response and see the incident status update accordingly.

### Hackathon Demonstration Goals
- Live-disconnect network mid-demo to show threat-intel fallback continuing to function (Blueprint §17).
- Show a homoglyph-obfuscated URL detection before/after a documented preprocessing fix (Blueprint §11, §17).
- Present honestly labeled, actually-measured evaluation numbers — no placeholder statistics presented as final (Execution Plan §22–23).

---

## 6. Non-Goals

**[CONFIRMED — Blueprint §12 Future list; Execution Plan §25]**
- Autonomous destructive actions (auto-block, auto-quarantine, auto-revoke without human approval).
- A full deepfake detection platform (image/video/voice trained from scratch).
- Federated learning across organizational deployments.
- Enterprise-scale SIEM/EDR integration.
- Large-scale graph database (Neo4j-scale) attack analysis — NetworkX in-memory only, and only as stretch.
- SMS/social-media phishing ingestion adapters.
- India-specific UPI/banking phishing dataset construction (flagged as a real, unfilled research gap — Blueprint §4).
- QR-code phishing decoding as an MVP capability (stretch only).
- MISP threat-intel platform integration.

---

## 7. Target Users

**Primary [CONFIRMED — Blueprint §2.3, §7.2; Frontend Readiness Assessment §2]:** SOC/security analyst — the sole persona explicitly supported by the existing product design.

**Secondary [PROPOSED — not explicitly defined as a distinct persona in source documents, but implied by dashboard/incident-assignment fields]:**
- SOC lead/security administrator — implied by `assigned_to` field in the incidents schema (Blueprint §7.3) and by role-based access being *mentioned but not specified* (Blueprint §10.2, Q42; Frontend Readiness Assessment §3 "Cut: Settings").
- Evaluator/judge as demonstration observer — implied by the entire judge-readiness section (Blueprint §15) but not a system user role.
- Future enterprise security team — implied only by PS09's "Desired Impact" language, not by any current functional requirement.

These secondary roles are labeled proposed because the source documents do not define their permissions or distinct workflows in enough detail to treat them as confirmed system requirements (see Section 18/RBAC discussion in the forthcoming Architecture document).

---

## 8. User Personas

### Persona 1 — SOC Analyst (Primary) `[CONFIRMED]`
- **Role:** Front-line security analyst triaging alerts during a shift.
- **Goals:** Quickly assess whether a submitted artifact (URL, message, login event) is a real threat; understand *why* it's flagged; take a defensible action.
- **Problems today:** Isolated tools give a bare classification with no reasoning trail; low-context alerts erode trust and slow response.
- **Responsibilities:** Investigate submitted artifacts; review evidence and MITRE tags; approve, dismiss, or escalate the recommended response.
- **Pain points:** Alert fatigue from unexplained "malicious/not malicious" outputs; uncertainty about whether a tool's confidence is trustworthy.
- **CyberGuard needs:** Evidence-first presentation (not score-first — Blueprint §2.3); a clear risk/confidence separation; a single consistent reasoning pattern across all three scenarios so context-switching cost is low.
- **Success criteria:** Can reach a decision (approve/dismiss/escalate) from a single Incident Detail screen without needing external tools.

### Persona 2 — SOC Lead / Security Administrator (Secondary) `[PROPOSED]`
- **Role:** Oversees analyst queue, reviews escalations, may configure organizational domains/thresholds in a future iteration.
- **Goals:** Situational awareness across the whole incident queue; confidence that destructive actions are gated by approval.
- **Problems today:** No dashboard-level view of threat category/severity mix without per-alert drill-down.
- **Responsibilities:** Monitor the Overview dashboard; review incidents assigned to the team.
- **CyberGuard needs:** Dashboard summary tiles, severity breakdown, attack timeline (Blueprint §7.5, Execution Plan §14).
- **Success criteria:** Can answer "how bad is today" from the Dashboard screen alone. Role-based permission boundaries for this persona are **[OPEN DECISION]** — not sufficiently specified in source material to implement now (see Section 29).

### Persona 3 — Evaluator/Judge (Demonstration Observer) `[PROPOSED]`
- **Role:** Not a system user; observes a live or recorded demo.
- **Goals:** Assess technical credibility, scope discipline, and honesty of claims (Blueprint §15 — 50+ anticipated hard questions).
- **CyberGuard needs:** A rehearsed demo path through all three scenarios reaching full response recommendation; visible honest limitations (adversarial degradation numbers, synthetic dataset disclosure) rather than hidden weaknesses.
- **Success criteria:** Judge understands the differentiator is the reasoning pipeline, not any single detector.

---

## 9. User Journey

**[CONFIRMED — Execution Plan §3, Blueprint §7.2]** The canonical analyst journey, identical in structure across all three scenarios:

```
Input (URL/Email | Sender+Message | Login Event)
        ↓
Ingestion & Normalization
        ↓
Detection (PhishMind+heuristics | Domain/stylometry/sender-auth | Rules+Isolation Forest)
        ↓
Threat-Intelligence Enrichment (live API or local-cache fallback)
        ↓
Risk Fusion (weighted combination of signals)
        ↓
Risk Score + Confidence Score (reported separately)
        ↓
Explanation / Evidence (signal-tagged bullets)
        ↓
MITRE ATT&CK Mapping (technique ID + name + tactic)
        ↓
Recommended Response (primary + secondary actions)
        ↓
Human Approval (Approve / Dismiss / Escalate)
        ↓
Incident State Update
```

---

## 10. MVP Scope

| Capability | MVP | Stretch | Future | Reason |
|---|:---:|:---:|:---:|---|
| Phishing URL analysis (PhishMind + heuristics) | ✅ | | | PS09 minimum scenario 1; existing validated asset |
| Phishing email analysis (heuristic layer) | ✅ | | | PS09 explicit channel; low incremental cost over URL engine |
| SMS/social-media/QR phishing ingestion | | | ✅ | Same engine, different adapter — not built (Blueprint §12) |
| Digital impersonation (domain-lookalike + stylometry + sender-auth) | ✅ | | | PS09 minimum scenario 2 (impersonation/identity fraud) |
| Account takeover / login-anomaly (rules + Isolation Forest) | ✅ | | | PS09 minimum scenario 3 (technical/behavioral threat) |
| Deepfake detection (pretrained ONNX, image) | | ✅ | | Explicitly demoted per Blueprint §0/§5.3 — highest live-demo risk, lowest incremental score |
| Voice/video deepfake | | | ✅ | Out of scope entirely — training infeasible at 6GB VRAM/3–4 weeks |
| Threat-intelligence enrichment (VirusTotal, URLhaus, AbuseIPDB) | ✅ | | | Required for realistic risk fusion |
| Offline/local threat-intel fallback | ✅ | | | Non-negotiable per Blueprint §5.6 — demo must not depend on internet |
| Risk fusion engine (weighted formula) | ✅ | | | Core differentiator |
| Risk tier + confidence (separate) | ✅ | | | Core differentiator; PS09 explicit requirement |
| Explanation/evidence (XAI schema) | ✅ | | | PS09 explicit requirement |
| MITRE ATT&CK mapping (10–15 curated entries) | ✅ | | | PS09 innovation-opportunity item, adopted as low-effort MVP enrichment |
| Full MITRE ontology / embedding-based mapping | | | ✅ | Explicitly rejected as over-engineering (Blueprint §5.5) |
| Response recommendation (static playbook) | ✅ | | | PS09 explicit requirement |
| Human approval gate before destructive action | ✅ | | | Non-negotiable ethics/safety stance |
| Incident tracking (alert aggregation, status lifecycle) | ✅ | | | Required for dashboard and Incident Detail |
| SOC dashboard (Overview, Analyzers, Alerts, Incidents, Incident Detail) | ✅ | | | PS09 minimum deliverable |
| MITRE Map visual screen | | ✅ | | Blueprint §7.5 — stretch |
| Risk analytics/trend screen | | ✅ | | Blueprint §7.5 — stretch |
| Attack-chain graph (NetworkX) | | ✅ | | Blueprint §7.5/§10 — stretch |
| Adversarial robustness testing of PhishMind | ✅ | | | Blueprint §11 — primary judge-defense asset |
| Security controls (SSRF prevention, input validation, auth, rate limiting) | ✅ | | | Required — CyberGuard is itself a security-sensitive tool (Blueprint §10.1) |
| Federated learning | | | ✅ | Explicitly cut (Blueprint §3, feature #21) |
| Autonomous agent-driven response | | | ✅ | Conflicts with human-approval principle; explicitly cut (Blueprint §3, feature #22) |
| Custom transformer/LLM fine-tune replacing PhishMind | | | ✅ | Infeasible given hardware/timeline; explicitly cut (Blueprint §3, feature #23) |

---

## 11. Core Threat Scenarios

### Scenario 1 — Phishing URL / Email `[CONFIRMED — Blueprint §7.2 Flow 1]`
- **Input:** A URL (pasted) or `.eml` file upload.
- **Processing:** Normalize (resolve shorteners, decode punycode, follow redirect chain up to a capped hop limit).
- **Signals:** PhishMind ML score; heuristic rule hits (e.g., suspicious TLD, new domain registration); threat-intelligence score (VirusTotal/URLhaus match).
- **Detection:** PhishMind (BiLSTM+CNN+TF-IDF+heuristics→Random Forest, existing trained asset).
- **Risk:** Fused via `0.5×ML + 0.2×Heuristic + 0.3×ThreatIntel` (provisional formula — see Section 13).
- **Explanation:** Evidence bullets tagged by source signal (e.g., "Domain registered within the last 5 days").
- **MITRE:** e.g., T1566.002 (Spearphishing Link).
- **Response:** Primary "Block URL"; secondary "Notify affected user," "Add domain to organizational blocklist."
- **Human approval:** Required before block/quarantine is marked as taken.
- **Resulting incident state:** Open → (on approval) Contained.

### Scenario 2 — Digital Impersonation `[CONFIRMED — Blueprint §7.2 Flow 2]`
- **Input:** Sender address, message body, claimed organization (mock inbox entry).
- **Processing:** Compare sender domain against known-organization domain list; compute stylometric similarity against a known-contact corpus; evaluate sender-authenticity heuristics (SPF/DKIM-style mismatch simulation).
- **Signals:** Domain-similarity score; stylometric-mismatch score; sender-authenticity heuristic; identity-fusion score.
- **Detection:** Rule/similarity-based (Levenshtein/domain similarity, TF-IDF-style stylometry) — not a trained classifier.
- **Risk:** Fused via `0.2×ML + 0.2×Heuristic + 0.1×ThreatIntel + 0.5×Identity` (provisional — Section 13).
- **Explanation:** e.g., "Sender display name matches 'IT Support' but domain differs from verified organizational domain by 1 character."
- **MITRE:** e.g., T1078 (Valid Accounts) or an equivalent impersonation-mapped technique — exact mapping table is a Phase 2 (Architecture) artifact.
- **Response:** "Warn user, do not click links, verify via alternate channel."
- **Human approval:** Required.
- **Resulting incident state:** Open → (on review) Contained/Dismissed/Escalated.

### Scenario 3 — Account Takeover / Behavioral Anomaly `[CONFIRMED — Blueprint §7.2 Flow 3]`
- **Input:** A login event (device, IP/geo, timestamp, success/fail, RTT).
- **Processing:** Rule engine checks (impossible travel, password spraying, new device); Isolation Forest scores statistical anomaly on RBA-derived features.
- **Signals:** Rule-hit score; Isolation Forest anomaly score.
- **Detection:** Rule engine + `IsolationForest` (scikit-learn), trained/fit on the RBA dataset (Wiefling et al., Zenodo).
- **Risk:** Fused via `0.6×BehavioralML + 0.4×Rules` (provisional — Section 13).
- **Explanation:** e.g., "Login succeeded from a new device and a location 4,800km from the user's last known location within 40 minutes."
- **MITRE:** e.g., T1110.003 (Password Spraying) where applicable.
- **Response:** "Require additional authentication, notify user, flag session for review."
- **Human approval:** Required.
- **Resulting incident state:** Open → (on approval) Contained/Escalated.

### Scenario 4 — Deepfake `[STRETCH — explicitly not MVP, Blueprint §0/§5.3/§7.2 Flow 4]`
Only attempted using a pretrained (not team-trained) ONNX image-forensics model, and only after all three MVP flows are stable and rehearsed. Never presented as a trained-by-team capability.

---

## 12. Functional Requirements

Each requirement is testable via Given/When/Then acceptance criteria.

### Ingestion & Normalization

**FR-001 — URL Submission**
*Description:* The system shall allow an analyst to submit a URL for phishing analysis.
*Priority:* Must
*User story:* As an analyst, I want to submit a URL so that I can determine whether it is malicious.
*Acceptance criteria:*
```
Given an analyst has opened the URL Analyzer
When the analyst submits a syntactically valid URL
Then CyberGuard shall normalize the URL and execute the phishing analysis pipeline.
```

**FR-002 — URL Normalization**
*Description:* The system shall resolve URL shorteners, decode punycode/IDN encoding, and follow redirect chains up to a capped hop limit before scoring.
*Priority:* Must
*Acceptance criteria:*
```
Given a submitted URL that is shortened or redirect-chained
When normalization runs
Then the system shall score the final resolved destination, not the original shortened/intermediate URL, and shall stop following redirects after the configured hop cap.
```

**FR-003 — Email Submission**
*Description:* The system shall allow an analyst to submit an `.eml` file or email content for phishing/impersonation analysis.
*Priority:* Must
*Acceptance criteria:*
```
Given an analyst has opened the URL Analyzer in email mode
When the analyst uploads a valid .eml file within size/MIME restrictions
Then CyberGuard shall extract header and body content and execute the phishing/impersonation analysis pipeline.
```

**FR-004 — Identity/Impersonation Submission**
*Description:* The system shall allow an analyst to submit sender, message, and claimed-organization information for impersonation analysis.
*Priority:* Must
*Acceptance criteria:*
```
Given an analyst has opened the Identity Analyzer
When the analyst submits sender address, message body, and claimed organization
Then CyberGuard shall execute the impersonation analysis pipeline against known-organization domain data.
```

**FR-005 — Login Event Submission**
*Description:* The system shall allow an analyst (or an ingestion process) to submit a login event for ATO analysis.
*Priority:* Must
*Acceptance criteria:*
```
Given a login event with device, geo, timestamp, and success/failure fields
When the event is submitted
Then CyberGuard shall extract RBA-style features and execute the ATO analysis pipeline.
```

### Detection

**FR-006 — PhishMind Integration**
*Description:* The system shall score submitted URLs using the existing PhishMind model without retraining or re-platforming it.
*Priority:* Must
*Acceptance criteria:*
```
Given a normalized URL
When the phishing engine runs
Then it shall return a PhishMind ML score in [0,1] using the existing trained model artifact.
```

**FR-007 — Heuristic Layer**
*Description:* The system shall apply rule-based heuristics (domain age, suspicious TLD, urgency-keyword detection) to phishing and impersonation inputs.
*Priority:* Must
*Acceptance criteria:*
```
Given a submitted URL or email
When heuristic checks run
Then the system shall return a normalized heuristic score in [0,1] reflecting the number and weight of triggered rules.
```

**FR-008 — Impersonation Signal Computation**
*Description:* The system shall compute domain-similarity, stylometric-similarity, and sender-authenticity signals for impersonation inputs.
*Priority:* Must
*Acceptance criteria:*
```
Given a sender/message/organization submission
When the impersonation engine runs
Then it shall return a domain-similarity score, a stylometric-similarity score, and a sender-authenticity score, each in [0,1].
```

**FR-009 — ATO Rule Engine**
*Description:* The system shall evaluate login events against rules for impossible travel, password spraying, and new-device patterns.
*Priority:* Must
*Acceptance criteria:*
```
Given a login event
When the rule engine runs
Then it shall flag any matched rule and return a normalized rule-hit score in [0,1].
```

**FR-010 — Isolation Forest Anomaly Scoring**
*Description:* The system shall score login events for statistical anomaly using an Isolation Forest model fit on RBA-derived features.
*Priority:* Must
*Acceptance criteria:*
```
Given a login event with extracted behavioral features
When the anomaly model runs
Then it shall return an anomaly score in [0,1] independent of whether any explicit rule was triggered.
```

### Threat Intelligence

**FR-011 — Threat Intelligence Lookup**
*Description:* The system shall query external threat-intelligence sources (VirusTotal, URLhaus, AbuseIPDB) for URL/domain reputation.
*Priority:* Must
*Acceptance criteria:*
```
Given a resolved URL or domain
When threat-intelligence enrichment runs and network access is available
Then the system shall return a threat-intel score in [0,1] based on live API results.
```

**FR-012 — Threat Intelligence Fallback**
*Description:* The system shall fall back to a locally cached snapshot when a live threat-intelligence API is unavailable, rate-limited, or times out.
*Priority:* Must
*Acceptance criteria:*
```
Given a threat-intelligence API call that fails, times out, or is rate-limited
When enrichment is attempted
Then the system shall serve a threat-intel score from the local cache and mark the alert's data-completeness note as degraded.
```

### Risk Fusion & Confidence

**FR-013 — Risk Fusion**
*Description:* The system shall combine per-engine signals into a single fused risk score using threat-type-specific weights.
*Priority:* Must
*Acceptance criteria:*
```
Given all applicable signal scores for a given threat type
When the fusion engine runs
Then it shall compute a fused_risk_score in [0,1] using the documented per-scenario weight set (Section 13) and assign a risk tier from the five-tier scale.
```

**FR-014 — Confidence Scoring**
*Description:* The system shall compute a confidence score reflecting signal agreement and data completeness, separate from the risk score.
*Priority:* Must
*Acceptance criteria:*
```
Given a set of fused signal scores
When confidence is computed
Then the system shall report a confidence value distinct from fused_risk_score, and shall reduce confidence when any signal was degraded (e.g., threat-intel fallback was used) or incomplete.
```

### Explainability

**FR-015 — Evidence Generation**
*Description:* The system shall generate at least one evidence item per contributing signal for every alert.
*Priority:* Must
*Acceptance criteria:*
```
Given a completed risk fusion for an alert
When the explanation engine runs
Then it shall produce an evidence array where each item is tagged with its source signal (ml_model, heuristic, threat_intel, or identity) and a human-readable text description.
```

**FR-016 — MITRE Mapping**
*Description:* The system shall map each alert's threat type/pattern to one or more MITRE ATT&CK techniques using a curated lookup table.
*Priority:* Must
*Acceptance criteria:*
```
Given an alert with a determined threat_type and evidence pattern
When MITRE mapping runs
Then the system shall attach at least one technique_id, name, and tactic from the curated table, or explicitly indicate no mapping was found.
```

### Response & Approval

**FR-017 — Response Recommendation**
*Description:* The system shall generate a recommended action (primary + optional secondary actions) based on threat type and risk tier.
*Priority:* Must
*Acceptance criteria:*
```
Given a fused risk tier and threat_type
When the response engine runs
Then it shall return a primary recommended action from the defined action vocabulary (e.g., Block URL, Quarantine email, Require MFA, Revoke session, Warn user, Flag account, Escalate incident) and zero or more secondary actions.
```

**FR-018 — Human Approval Gate**
*Description:* The system shall require explicit analyst approval before any action flagged as destructive is marked as executed.
*Priority:* Must
*Acceptance criteria:*
```
Given a recommended action with requires_human_approval = true
When the action has not yet been approved
Then the system shall not mark the incident as Contained, and shall present Approve/Dismiss/Escalate controls to the analyst.
```

**FR-019 — Approval Recording**
*Description:* The system shall record who approved, dismissed, or escalated a recommendation, and when.
*Priority:* Must
*Acceptance criteria:*
```
Given an analyst selects Approve, Dismiss, or Escalate on a recommendation
When the action is submitted
Then the system shall persist the action, the acting analyst identifier, and a timestamp, and update the incident status accordingly.
```

### Incident Management

**FR-020 — Incident Creation**
*Description:* The system shall create or update an incident record when an alert is generated.
*Priority:* Must
*Acceptance criteria:*
```
Given a newly fused alert
When the alert is persisted
Then the system shall associate it with a new or existing incident and set an initial status.
```

**FR-021 — Incident Status Lifecycle**
*Description:* The system shall track incident status through the states defined in Section 17.
*Priority:* Must
*Acceptance criteria:*
```
Given an incident in any defined state
When an analyst takes an approval/dismissal/escalation action
Then the incident shall transition only to a state permitted by the defined lifecycle.
```

### Dashboard & Alerts

**FR-022 — Dashboard Summary**
*Description:* The system shall provide aggregate counts by severity, threat category, and a timeline view.
*Priority:* Must
*Acceptance criteria:*
```
Given one or more persisted alerts
When the analyst opens the Dashboard
Then the system shall display total event count, severity breakdown, per-scenario counts (phishing/impersonation/ATO), and an attack timeline.
```

**FR-023 — Alert Listing & Filtering**
*Description:* The system shall provide a paginated, filterable list of alerts.
*Priority:* Must
*Acceptance criteria:*
```
Given a set of persisted alerts
When the analyst opens the Alerts screen and applies a risk_tier, threat_type, or date filter
Then the system shall return only matching alerts, paginated.
```

**FR-024 — Incident Detail View**
*Description:* The system shall present a single incident's full reasoning trail: threat, risk+confidence, evidence, detection-signal breakdown, MITRE tags, recommended response, approval control, and status.
*Priority:* Must
*Acceptance criteria:*
```
Given an analyst selects an incident
When the Incident Detail screen loads
Then it shall display all fields defined in the standard alert contract (Section 12/Execution Plan §20) plus current incident status.
```

### Authentication & Audit

**FR-025 — Basic Authentication**
*Description:* The system shall require authentication before granting access to the dashboard or analyzers.
*Priority:* Must — `[CONFIRMED direction, PROPOSED implementation detail]` Source material establishes only "basic JWT is enough" (Blueprint §10.1) without flow detail.
*Acceptance criteria:*
```
Given an unauthenticated user
When they attempt to access any dashboard route
Then the system shall redirect to a login gate and deny access to protected data.
```

**FR-026 — Audit Logging**
*Description:* The system shall log security-relevant actions (analysis requests, approvals, dismissals, escalations) for audit purposes.
*Priority:* Should
*Acceptance criteria:*
```
Given any approval/dismissal/escalation action
When the action is processed
Then the system shall write an audit log entry containing actor, action, target incident/alert ID, and timestamp.
```

### Error Handling

**FR-027 — Graceful Degradation on Partial Input**
*Description:* The system shall complete analysis and report reduced confidence when input data is incomplete, rather than failing outright.
*Priority:* Must
*Acceptance criteria:*
```
Given a submission missing a non-required field (e.g., login event without RTT)
When analysis runs
Then the system shall complete the pipeline, omit the affected signal contribution, and reflect the gap in the confidence score and data_completeness_note.
```

**FR-028 — Invalid Input Rejection**
*Description:* The system shall reject syntactically invalid input with a clear error rather than attempting analysis.
*Priority:* Must
*Acceptance criteria:*
```
Given a malformed URL, unparseable .eml file, or incomplete login event missing a required field
When submitted
Then the system shall return a validation error and shall not create an alert record.
```

---

## 13. Risk & Confidence Requirements

**[CONFIRMED — Blueprint §8, Execution Plan §7–9]** Five-tier risk scale, applied uniformly:

| Score range | Tier |
|---|---|
| 0.00–0.20 | Safe |
| 0.21–0.40 | Low |
| 0.41–0.65 | Medium |
| 0.66–0.85 | High |
| 0.86–1.00 | Critical |

**Risk** answers "how dangerous does the event appear?" **Confidence** answers "how strongly do the available signals support that conclusion?" These are never merged into a single probability (Execution Plan §9, Blueprint §8).

**[CONFIRMED — Blueprint §8, Execution Plan §7]** Documented fusion formulas, labeled provisional:

```
Phishing URL/Email:  Risk = 0.5×ML + 0.2×Heuristic + 0.3×ThreatIntel
Impersonation:       Risk = 0.2×ML + 0.2×Heuristic + 0.1×ThreatIntel + 0.5×Identity
ATO:                 Risk = 0.6×BehavioralML + 0.4×Rules
```

**[CONFIRMED — Blueprint §8]** These weights are explicitly stated as "tunable per threat type — a design decision to defend, not a fixed universal constant." This PRD does not treat them as final production values; Section 15 (Judge-Readiness, source Blueprint) anticipates the question "how do you decide risk tier thresholds" and the honest answer is that they are fixed for interpretability now, not derived from a calibration study.

**Confidence computation [CONFIRMED — Blueprint §8]:** a function of signal agreement (e.g., `1 − stdev(normalized component scores)`) and data completeness, capped lower when threat-intel fallback was used or input was incomplete. The exact confidence formula is implementation detail deferred to the ML specification (not produced in this phase).

**Signal provenance:** every evidence item and every fused-signal component must retain a tag identifying its origin (`ml_model`, `heuristic`, `threat_intel`, `identity`) per the alert contract (Section 12).

---

## 14. Explainability Requirements

**[CONFIRMED — PS09 "Explainable AI," Blueprint §9, Execution Plan §10]** Every alert must answer:

| Question | Field |
|---|---|
| What happened? | `threat_type` + top-level summary |
| Why? | `evidence[]` |
| How severe? | `risk_tier` / `fused_risk_score` |
| How confident? | `confidence` |
| What evidence contributed? | `evidence[]` (signal-tagged) |
| Which MITRE technique? | `mitre[]` |
| What should the analyst do? | `recommended_action` |

**Evidence requirements:**
- Minimum of one evidence item per contributing signal type present in the fusion (FR-015).
- Each evidence item must be a short, source-tagged sentence (Blueprint §9 design choice) — not a raw score dump or SHAP output.
- Evidence must be phrased in risk/suspicion language, never accusatory language ("suspicious," "risk," never "confirmed phishing" or "this person is an attacker" — Blueprint §10.2).

---

## 15. Threat Intelligence Requirements

**[CONFIRMED — Blueprint §5.6, Execution Plan §12]**
- **External sources:** VirusTotal API v3 (4 req/min, 500/day free tier), URLhaus (no key required), AbuseIPDB (1,000 checks+reports/day free tier).
- **Caching:** a locally cached snapshot of known-bad/known-good indicators must be pre-populated and used as fallback.
- **Fallback trigger conditions:** API unreachable, rate-limited, or timed out.
- **Data completeness:** every alert carries a `data_completeness_note` indicating whether enrichment succeeded live or degraded to cache.
- **Contribution to risk:** threat-intel score is one weighted component of fusion (Section 13); it is never the sole determinant of risk tier.
- **No internet dependency for demonstration [CONFIRMED — non-negotiable per Blueprint §5.6, Execution Plan §12/§24]:** the system must remain fully functional, including for the demo's featured "network-disconnect" moment, when external APIs are unreachable.

---

## 16. Human Approval Requirements

**[CONFIRMED — Blueprint §10.2, §17; Execution Plan §13]**
- Every response recommendation flagged `requires_human_approval: true` must block automatic execution.
- Destructive actions (Block, Quarantine, Revoke session) are always `requires_human_approval: true`; this is enforced at the API level, not merely described in documentation (Blueprint §9 design note).
- **Approval states:** Approve, Dismiss, Escalate (Execution Plan §18, Frontend Readiness Assessment §5/§8).
- **Rejection/dismissal:** an analyst may dismiss a recommendation without taking the suggested action; this must be recorded, not silently discarded.
- **Auditability:** every approval/dismissal/escalation is logged with actor and timestamp (FR-019, FR-026).
- **Destructive-action restrictions:** no action executes destructive real-world effects in the MVP demo (no live email quarantine, no live session revocation against a real IdP) — these are simulated/recorded state transitions, since the system operates on synthetic demo data (Section 22).

---

## 17. Incident Lifecycle

**[CONFIRMED — Frontend Readiness Assessment §8 TypeScript contract, inferred from Blueprint §7.2/§7.3 examples]** The following states are directly supported by source material:

```
OPEN → CONTAINED
OPEN → DISMISSED
OPEN → ESCALATED
```

**[PROPOSED]** An explicit `REVIEWED` intermediate state (mentioned in the task's suggested lifecycle template) is **not** established in any source document — the Frontend Readiness Assessment's TypeScript `Incident.status` enum is `'Open' | 'Contained' | 'Dismissed' | 'Escalated'` and is itself flagged `[BACKEND CONTRACT REQUIRED]` (exact enum not confirmed by the Blueprint). This PRD does not add a `REVIEWED` state as if it were confirmed; if the team wants a distinct "analyst has looked at it but not yet decided" state, that is a **[PROPOSED]** addition requiring explicit approval, not an existing requirement.

---

## 18. Frontend Product Requirements

**Framework-agnostic per the Phase 0 agreement — no frontend technology is named in this section.** The confirmed frontend implementation technology (React + TypeScript) is recorded in Section 27 and will govern the forthcoming Architecture document.

### Dashboard
- **Purpose:** situational awareness at a glance for an analyst starting a shift.
- **User:** SOC analyst.
- **Inputs:** none (read-only view).
- **Outputs:** total event count, severity breakdown (5 tiers with color+icon+label — never color alone), per-scenario counts (Phishing/Impersonation/ATO), attack timeline chart, recent incidents list.
- **Actions:** click-through from a recent incident to Incident Detail.
- **API dependency:** dashboard summary endpoint (Section: API Contract Decisions, deferred to Architecture doc).
- **States:** loading (skeleton/spinner), error (API unreachable — must not crash the shell), empty (no incidents yet).

### URL Analyzer
- **Purpose:** run Scenario 1 (phishing URL/email).
- **User:** analyst investigating a URL or email.
- **Inputs:** URL string, or `.eml` upload.
- **Outputs:** full alert (risk, confidence, evidence, MITRE, recommendation).
- **Actions:** submit for analysis; view resulting alert.
- **API dependency:** URL/email analysis endpoint.
- **States:** loading (analysis in progress), error (invalid input, backend failure), empty (no prior submission).

### Identity Analyzer
- **Purpose:** run Scenario 2 (digital impersonation).
- **User:** analyst investigating a suspicious message/sender.
- **Inputs:** sender address, message body, claimed organization.
- **Outputs:** full alert (impersonation-specific evidence, e.g., domain similarity distance).
- **Actions:** submit for analysis; view resulting alert.
- **API dependency:** identity analysis endpoint.
- **States:** loading, error, empty.

### Behavior Analyzer
- **Purpose:** run Scenario 3 (account takeover/login anomaly).
- **User:** analyst investigating a login event.
- **Inputs:** login event fields (device, geo, timestamp, success/fail, RTT).
- **Outputs:** full alert (ATO-specific evidence, e.g., impossible-travel flag).
- **Actions:** submit for analysis; view resulting alert.
- **API dependency:** login-event analysis endpoint.
- **States:** loading, error, empty.

### Alerts
- **Purpose:** browse/filter all detections.
- **User:** analyst triaging a queue.
- **Inputs:** filter controls (risk tier, threat type, date range).
- **Outputs:** paginated alert list.
- **Actions:** filter, click-through to underlying incident.
- **API dependency:** alert listing endpoint.
- **States:** loading, error, empty (no alerts matching filter).

### Incidents
- **Purpose:** browse aggregated multi-alert cases.
- **User:** analyst/lead reviewing case load.
- **Inputs:** filter/sort controls (status, severity).
- **Outputs:** incident list with status badges.
- **Actions:** click-through to Incident Detail.
- **API dependency:** incident listing endpoint.
- **States:** loading, error, empty.

### Incident Detail (centerpiece)
- **Purpose:** full reasoning trail plus response action — the primary decision-making screen.
- **User:** analyst deciding on a response.
- **Inputs:** approval action selection (Approve/Dismiss/Escalate).
- **Outputs:** threat header, risk+confidence display, evidence list, detection-signal component breakdown, MITRE chips, recommended action card, approval control, status badge.
- **Actions:** Approve, Dismiss, Escalate.
- **API dependency:** incident detail endpoint (GET) + approval endpoint (POST) — exact canonical paths are an **[OPEN DECISION]** pending Architecture-phase API Contract resolution (Frontend Readiness Assessment §9 documents naming conflicts between `/incidents/{id}/approve` and `/alerts/{id}/respond`).
- **States:** loading, error (approval action failed — must not silently lose the analyst's decision), empty (should not normally occur; incident detail is only reached via a valid incident ID).

---

## 19. Information Architecture

**[CONFIRMED — Frontend Readiness Assessment §3, §7]**

```
App
├── Dashboard
├── URL Analyzer
├── Identity Analyzer
├── Behavior Analyzer
├── Alerts
├── Incidents
│   └── Incident Detail
```

No settings/configuration page is included — the Frontend Readiness Assessment explicitly cuts this ("nothing in the blueprint defines user preferences, roles, or config surfaces worth a page"). Role-based access is mentioned but not specified enough to build a settings surface around it (Section 7/29).

---

## 20. Non-Functional Requirements

### Performance
`[PROPOSED TARGET — no measured/official target exists in source documents]`
- End-to-end alert latency (ingestion → risk tier displayed): target < 3 seconds for URL/identity analysis, < 1 second for login-event analysis, under normal (non-fallback) conditions. **[PROPOSED TARGET]** — chosen as a reasonable interactive-demo threshold, not derived from a measurement.
- Dashboard load: target < 2 seconds on local demo hardware. **[PROPOSED TARGET]**
- Threat-intel live-call timeout: **[OPEN DECISION]** — exact timeout value not specified in source documents; must be short enough that fallback triggers within the performance target above.

### Availability
The MVP is a single-demo-environment system, not a multi-tenant production service. Availability requirement is scoped to "runs reliably for the duration of a live or recorded demo," not uptime SLAs. `[PROPOSED — no formal availability target exists in source material]`

### Reliability
The system must complete analysis and produce an alert even when a non-required signal is degraded or unavailable (FR-027) rather than failing the whole request.

### Security
See Section 21.

### Privacy
See Section 22.

### Scalability
`[CONFIRMED — Blueprint §16 Q28, Q45]` Current design is explicitly hackathon-scale. Production scaling (async task queues, horizontal API scaling, real message bus) is a Future item, not an MVP requirement. This PRD does not claim current scalability beyond demo load.

### Maintainability
Internal module boundaries within the modular monolith (Ingestion, Detection engines, Threat Intel, Fusion, XAI, MITRE, Response, Incident Management) must remain clearly separated even though deployed as one backend service (ARCHITECTURE.md; Blueprint §7.1).

### Observability
`[PROPOSED]` Structured logging and audit logs (FR-026) are required; broader observability (metrics dashboards, distributed tracing) is not required for MVP and is not addressed by source documents.

### Accessibility
`[PROPOSED]` Risk tier must always be conveyed via color + icon + text label together, never color alone (Frontend Readiness Assessment §6) — this is the only accessibility requirement directly established by source material. Broader WCAG conformance beyond this rule is not specified and is treated as best-effort, not a certified requirement.

### Offline Capability
**[CONFIRMED — non-negotiable]** The system must remain fully functional for demonstration purposes without live internet access, via the threat-intelligence local-cache fallback (Section 15) and a self-contained Docker Compose deployment (no cloud dependency required to run the demo).

---

## 21. Security Requirements

**[CONFIRMED — Blueprint §10.1, Execution Plan §24]**
- **Authentication:** basic JWT-gated access to the dashboard/API is required; an unauthenticated "security dashboard" is treated as an unacceptable, easily-flagged gap (Blueprint §10.1).
- **Authorization:** role model is **[PROPOSED/OPEN DECISION]** — see Section 29; only a single analyst role is confirmed as necessary for MVP.
- **JWT/session approach:** confirmed direction is "basic JWT is enough" (Blueprint §10.1); token expiry, refresh behavior, and storage mechanism are **[PROPOSED]**, to be defined in the Architecture document.
- **Rate limiting:** the system's own API must be rate-limited to prevent exhausting the threat-intel quota (4/min VirusTotal limit) via a misbehaving frontend loop (Blueprint §10.1).
- **Input validation:** all submitted URLs, emails, identity fields, and login events must be validated server-side (FR-028).
- **File restrictions:** `.eml` uploads (and any stretch image/audio uploads) must enforce server-side file-size limits and MIME-type validation (Blueprint §10.1).
- **Secret handling:** API keys (VirusTotal, AbuseIPDB) and JWT signing secrets must be stored in environment variables, never hardcoded or committed (Execution Plan §24).
- **Audit logs:** required for approval/dismissal/escalation actions (FR-026).
- **PII minimization:** no real employee/user PII in the demo; synthetic users, synthetic login events, synthetic message corpus only (Blueprint §10.2).
- **No arbitrary command execution:** the system must not execute attacker-controlled input as code or shell commands at any point in the URL/email ingestion pipeline.
- **Human approval:** see Section 16.
- **Demo data:** authorized/public/synthetic only — see Section 22.
- **SSRF consideration:** URL-resolution/redirect-following logic must not be able to reach internal network ranges (RFC1918 private IPs, `localhost`, cloud metadata endpoints) before making outbound requests on a user-submitted URL (Blueprint §10.1). This is a product requirement here; exact implementation belongs to the Architecture document.

---

## 22. Privacy & Data Handling

**[CONFIRMED — Blueprint §10.2, Execution Plan §24]**
- No real credentials are used, stored, or processed.
- No unauthorized private emails are used as analysis input or demo fixtures.
- No private login logs (beyond the public RBA research dataset, which is itself anonymized/aggregated per its publication terms) are used.
- No sensitive personal media is used, including for any stretch deepfake demonstration.
- All demo data is synthetic, public, or explicitly authorized (e.g., the RBA dataset, Nazario/CEAS/SpamAssassin/Enron-Spam public phishing corpora).
- Synthetic impersonation test data is self-constructed by the team and must be labeled as synthetic wherever displayed (Blueprint §4, §10.3).

---

## 23. Compliance Considerations

**[CONFIRMED — no regulatory compliance is claimed by source documents]**
- CyberGuard does **not** currently claim GDPR, HIPAA, or any other regulatory compliance. No source document establishes a regulatory requirement or a compliance audit.
- **Applicable recommended practices (not certified compliance):** data minimization, synthetic/authorized data only, audit logging, secret management — these are security best practices adopted voluntarily (Section 21–22), not evidence of formal compliance.
- If the product evolves toward the "enterprise/government" deployment context referenced in PS09's Desired Impact statement, formal compliance review would be a **Future**, out-of-scope-for-this-PRD activity.

---

## 24. Out of Scope

- Autonomous execution of any destructive action without human approval (Section 6, 16).
- Full deepfake detection (image/video/voice) trained by the team (Section 6).
- Federated learning (Section 6).
- Enterprise SIEM/EDR feature parity (Section 6).
- Large-scale graph database attack analysis (Neo4j-scale) — NetworkX in-memory only, stretch tier (Section 10).
- SMS/social-media/QR-code phishing ingestion in MVP (Section 10).
- India-specific UPI/banking phishing dataset construction (Section 6) — flagged as a real gap, not fabricated.
- Settings/configuration UI (Section 19).
- Multi-tenant production deployment, horizontal scaling infrastructure (Section 20 — Scalability).
- Any regulatory compliance certification (Section 23).

---

## 25. Success Metrics / KPIs

**No fabricated numbers appear anywhere in this section.** All actual figures are `[TBD — measured during evaluation]` until real experiments exist, per Execution Plan §22–23 and Blueprint §10.3/§11.

### Detection
| Metric | Status |
|---|---|
| PhishMind Accuracy, Precision, Recall, F1, AUC (re-reported, not assumed) | [TBD — measured during evaluation] |
| PhishMind adversarial-set accuracy (homoglyph/punycode/redirect/shortener variants) | [TBD — measured during evaluation] |
| ATO Isolation Forest Precision/Recall/F1/False Positive Rate | [TBD — measured during evaluation] |
| Impersonation module Precision/Recall on synthetic test set | [TBD — measured during evaluation] |

### System
| Metric | Status |
|---|---|
| End-to-end alert latency | [TBD — measured during evaluation] |
| Threat-intel fallback activation rate and fallback latency vs. live-call latency | [TBD — measured during evaluation] |

### XAI
| Metric | Status |
|---|---|
| % of alerts with ≥3 evidence items | [TBD — measured during evaluation] |
| % of alerts with a MITRE mapping | [TBD — measured during evaluation] |

### Threat Intelligence
| Metric | Status |
|---|---|
| Live lookup latency | [TBD — measured during evaluation] |
| Fallback activation count during rehearsal | [TBD — measured during evaluation] |

### Product
| Metric | Status |
|---|---|
| Scenario completion rate (all 3 flows reach recommended response) | [TBD — measured during rehearsal] |
| Analyst workflow completion (submit → approve/dismiss/escalate without external tools) | [TBD — measured during rehearsal] |

---

## 26. Acceptance / Definition of Done

**[CONFIRMED — Execution Plan §37, Blueprint §12]** The MVP is complete only when the identical downstream chain works for **all three** scenarios (Phishing, Impersonation, ATO), each reaching:

```
Detection → Classification → Risk → Confidence → Evidence/XAI → MITRE → Response → Human Approval → Incident
```

A scenario that stops short of Human Approval or Incident state update does not satisfy Definition of Done, even if detection and risk scoring work correctly in isolation.

---

## 27. Dependencies

| Dependency | Status |
|---|---|
| Existing PhishMind model (trained artifact) | **[CONFIRMED]** existing asset, used as-is (no retraining) |
| RBA Dataset (Wiefling et al., Zenodo, DOI 10.5281/zenodo.6782155) | **[CONFIRMED]** training-grade for ATO |
| Nazario / CEAS 2008 / SpamAssassin / Enron-Spam / Cambridge phishing corpora | **[CONFIRMED]** available, training-grade for email-text classification if pursued beyond heuristics |
| Synthetic impersonation corpus | **[UNVERIFIED/self-constructed]** — no existing public dataset for this exact scenario; team must build ~50–100 labeled synthetic examples |
| VirusTotal API v3, URLhaus, AbuseIPDB | **[CONFIRMED]** free-tier threat-intel sources |
| MITRE ATT&CK reference data (curated 10–15 mappings) | **[CONFIRMED direction]**, table itself to be built (not yet enumerated beyond the one worked example in Blueprint §9) |
| Backend: FastAPI (Python) | **[CONFIRMED — Phase 0]** |
| Database: PostgreSQL | **[CONFIRMED — Phase 0]** |
| Frontend: React + TypeScript | **[CONFIRMED — Phase 0 reanalysis]**; supersedes the original Angular assumption in the source documents — see Section 1 and the Decision Log below |
| Deployment: Docker Compose | **[CONFIRMED — Phase 0]** |
| ML/detection tooling: scikit-learn (`IsolationForest`), NetworkX (stretch only) | **[CONFIRMED — Phase 0]** |

---

## 28. Product Risks

**[CONFIRMED — Blueprint §16, adapted to product-level framing]**
- ML false positives, particularly on VPN-based logins (impossible-travel false trigger) or legitimately new benign domains.
- Dataset limitations: RBA dataset is from a non-representative (Norwegian SSO) context; synthetic impersonation test data is self-labeled, limiting independence of that metric.
- Threat-intelligence API availability during live demo (rate limits, venue connectivity) — mitigated by mandatory local-cache fallback (Section 15).
- PhishMind integration risk is low (native Python-to-Python), but adversarial robustness may reveal an uncomfortably large accuracy drop — the product stance is to report this honestly rather than hide it (Blueprint §11).
- Scope creep toward full multimodal fusion (the rejected Architecture E) — mitigated by the MVP/Stretch/Future boundary in Section 10.
- Demo reliability: inconsistent data contracts between frontend and backend were identified as a real, current gap (Frontend Readiness Assessment §9) — the Architecture phase must resolve these before integration, not during it.
- Overclaiming deepfake capability — explicitly prohibited; any deepfake demo must be labeled "pretrained, not trained by us" (Section 10, Section 6).
- **Team unfamiliarity with the newly confirmed frontend stack:** the source documents' Frontend Readiness Assessment was authored against Angular conventions; the team has now moved to React + TypeScript (Phase 0 reanalysis). This introduces a re-translation cost for the existing component/data-contract specification that did not exist under the original Angular assumption. This risk is newly introduced by the Phase 0 stack decision and should be tracked explicitly, not treated as a preexisting Blueprint risk.

---

## 29. Open Decisions

The following are explicitly unresolved and require a decision before or during Architecture-phase work:

1. **RBAC/role model beyond a single Analyst role** — Blueprint §10.2 mentions role-based access but does not specify roles or permissions in enough detail to implement. `[OPEN DECISION]`
2. **Canonical API endpoint paths/shapes** — the Frontend Readiness Assessment (§9) identified real naming mismatches (`/analyze/login` vs. `/analyze/login-event`; `/incidents/{id}/approve` vs. `/alerts/{id}/respond`; no confirmed bare `/incidents/{id}` path). This PRD does not resolve these; resolution is deferred to the Architecture document's "API Contract Decisions" section, per the task's explicit instruction. `[OPEN DECISION]`
3. **Exact MITRE technique lookup table (beyond the single confirmed example, T1566.002)** — not enumerated in any source document. `[OPEN DECISION — BACKEND CONTRACT REQUIRED]`
4. **Exact request/response JSON payload shapes for analysis endpoints** — only inferred from the alert schema, not explicitly defined in the Blueprint. `[OPEN DECISION — BACKEND CONTRACT REQUIRED]`
5. **Threat-intel live-call timeout value** — not specified in source documents. `[OPEN DECISION]`
6. **JWT token expiry/refresh mechanics** — "basic JWT is enough" is confirmed direction; specific expiry windows and refresh flow are not defined. `[OPEN DECISION]`
7. **Whether a `REVIEWED` intermediate incident state is added** — not currently supported by source material (Section 17). `[OPEN DECISION]`
8. **Product owner / technical owner assignment** — placeholders only (Section 1). `[OPEN DECISION]`
9. **Exact auxiliary React library choices** (Tailwind vs. plain CSS, TanStack Query vs. custom fetch hooks, state management approach) — flagged in the Phase 0 reanalysis as deferred to Architecture, not Phase 0/1. `[OPEN DECISION]`
10. **ORM/migration tooling for PostgreSQL** — not addressed at PRD level; belongs to Architecture/Contributing phase. `[OPEN DECISION]`

---

## PRD Consistency Audit

| Check | Result |
|---|---|
| Does every PS09 minimum requirement have a corresponding product requirement? | Yes — threat classification (FR-006–010), risk/severity score (Section 13), explanation with evidence (Section 14), recommended response (FR-017), dashboard (Section 18/19), three-scenario minimum (Section 11), architecture documentation (deferred to Phase 2), accuracy/performance evaluation (Section 25) are all represented. |
| Are the three MVP scenarios represented? | Yes — Section 11, Scenarios 1–3, each with full input→response mapping. |
| Does every scenario reach response recommendation? | Yes — Section 11 explicitly carries each scenario through to "Response" and "Human approval." |
| Is human approval represented? | Yes — Section 16, FR-018/FR-019, non-negotiable per Section 6 (Non-Goals: no autonomous destructive action). |
| Are risk and confidence separate? | Yes — Section 13 explicitly states they are never merged; FR-013/FR-014 are separate requirements. |
| Is XAI represented? | Yes — Section 14, FR-015. |
| Is MITRE represented? | Yes — Section 14, FR-016, Section 29 item 3 flags the incomplete lookup table honestly. |
| Is threat-intelligence fallback represented? | Yes — Section 15, FR-012, Section 20 (Offline Capability). |
| Is the dashboard represented? | Yes — Section 18 (Dashboard), Section 19 (Information Architecture). |
| Are Stretch/Future capabilities excluded from MVP? | Yes — Section 10 table explicitly separates MVP/Stretch/Future columns; Section 6 restates Non-Goals; deepfake is never listed as MVP anywhere in this document. |
| Are unsupported claims avoided? | Yes — no fabricated metrics anywhere (Section 25 uses `[TBD — measured during evaluation]` throughout); all Blueprint confidence-labels (`CONFIRMED`/`LIKELY`/`INFERRED`/`UNVERIFIED`) are preserved or re-applied where relevant. |
| Does the PRD consistently reflect the Phase 0-confirmed stack rather than the documents' original stack assumption? | Yes, with the deviation made explicit rather than silent: Section 1 and Section 27 both state that React + TypeScript supersedes the source documents' original Angular assumption, and Section 28 tracks the resulting risk. Frontend functional requirements (Section 18) remain framework-agnostic per the agreed PRD/Architecture separation. |

---

## PRD Decision Log

| # | Decision | Interpretation required | Basis |
|---|---|---|---|
| 1 | Frontend requirements written framework-agnostically; React + TypeScript named only in Dependencies/Architecture-forward sections | The task's PRD template describes frontend screens without prescribing this separation; the Phase 0 reanalysis explicitly requested "PRD describes what the product needs, architecture describes how" | Approved Phase 0 reanalysis message |
| 2 | Secondary personas (SOC Lead, Evaluator/Judge) included but labeled `[PROPOSED]`, not `[CONFIRMED]` | Source documents imply these roles exist (assigned_to field, judge Q&A section) but never formally define them as system personas with permissions | Blueprint §10.2 Q42, §15; Frontend Readiness Assessment §3 |
| 3 | Incident lifecycle limited to Open/Contained/Dismissed/Escalated; no `REVIEWED` state added | The task template suggested a possible `REVIEWED` state, but no source document supports it; adding it would be scope invention | Frontend Readiness Assessment §8 TypeScript enum (itself flagged as inferred) |
| 4 | All NFR performance numbers marked `[PROPOSED TARGET]`, none presented as agreed | No source document states a latency/performance target anywhere | Task's explicit no-fake-metrics rule |
| 5 | RBAC beyond single Analyst role left as `[OPEN DECISION]`, not designed | Blueprint mentions role-based access as a mitigation for a hypothetical judge question, not as a specified feature | Blueprint §10.2 Q42 |
| 6 | Canonical API paths not resolved in this PRD | Explicit task instruction: API Contract Decisions belong in the Architecture document, not the PRD | Task instructions §"API Direction" |
| 7 | Compliance section explicitly disclaims any regulatory certification | No source document mentions GDPR/HIPAA/any compliance framework at all | Absence of evidence in all five source documents |
| 8 | New product risk added: team re-translation cost from Angular-oriented spec to React | This risk did not exist in the original Blueprint's risk register because Angular was the original assumption; it is a direct, honest consequence of the Phase 0 stack change | Phase 0 reanalysis conversation |

---

# PHASE 1 COMPLETE

**Deliverable:** PRD.md (above)

## Major decisions made
1. Frontend requirements (Section 18/19) written technology-agnostically; React + TypeScript recorded only as the confirmed implementation dependency (Section 27), per the Phase 0 reanalysis's requested PRD/Architecture separation.
2. All fusion-formula weights (Section 13) carried forward as explicitly provisional/tunable, not final.
3. Secondary personas and RBAC were included but explicitly downgraded to `[PROPOSED]`/`[OPEN DECISION]` rather than treated as specified requirements, since source material only implies them.
4. No performance, accuracy, or evaluation numbers were invented anywhere — every such field is `[TBD — measured during evaluation]` or `[PROPOSED TARGET]`.
5. API endpoint path/shape conflicts identified in the Frontend Readiness Assessment were deliberately **not** resolved here — flagged as Open Decisions for the Architecture phase, per task instructions.
6. The Angular→React stack deviation is surfaced explicitly in three places (Document Control, Dependencies, Product Risks) rather than silently absorbed.

## Open Decision items (full list in Section 29)
1. RBAC/role model beyond single Analyst role
2. Canonical API endpoint paths/shapes (naming conflicts unresolved by design)
3. Full MITRE technique lookup table
4. Exact request/response JSON payload shapes
5. Threat-intel live-call timeout value
6. JWT expiry/refresh mechanics
7. Whether a `REVIEWED` incident state is added
8. Product/technical owner assignment
9. Exact auxiliary React library choices
10. ORM/migration tooling for PostgreSQL

## Consistency audit result
**Pass** — see the full "PRD Consistency Audit" table above. Every PS09 minimum requirement, all three MVP scenarios, the risk/confidence separation, XAI, MITRE, threat-intel fallback, dashboard, human approval, and Stretch/Future exclusions are all represented and traceable to source material. No unsupported claims or fabricated metrics were introduced. The Phase 0 stack change is reflected consistently and visibly rather than silently.
