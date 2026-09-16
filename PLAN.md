# CYBERGUARD — Execution Plan

## 1. Document Control

| Field | Value |
|---|---|
| Project | CYBERGUARD — AI-Powered Cyber Threat, Phishing & Digital Impersonation Detection and Response System |
| Document | PLAN.md |
| Version | 1.1 |
| Status | [CONFIRMED] Execution Ready |
| Last updated | 2026-09-13 |
| Source documents | PRD.md v1.0, ARCHITECTURE.md v1.0, CYBERGUARD_BLUEPRINT.md, CyberGuard Execution Plan.pdf, CyberGuard Frontend Readiness Assessment & Implementation Spec.pdf, Problem_Statement_9.pdf, 2026-09-11-tech-stack-meta.md |
| Planning horizon | 3–4 weeks (Sep 13 – Oct 3 build, Oct 5–10 evaluation) |
| Target evaluation window | Oct 5–10, 2026 |
| Product Owner | [OPEN DECISION] — assign to Team Member A |
| Technical Owner | [OPEN DECISION] — assign to Team Member B |

**Changelog (v1.0 → v1.1):** Fixed inverted MVP/Stretch/Future scope table (§4); repaired tables that had collapsed into unreadable text throughout (§4, §6, §9, §16, §30, §32, §38, §40, §42); rebaselined all dates against the actual project start of Sun, Sep 13, 2026 — several v1.0 deadlines had already lapsed on day one; resolved `TASK-00x` placeholders into real task IDs (§11, §40); added missing task cards for Impersonation, ATO, TI Orchestrator detail, MITRE Mapper, Dashboard, and Auth (§11); added a Day-1 Open Decision Triage checklist (§0) since §42 lists nine decisions due "Sep 12," which is now in the past.

---

## 0. Day-1 Priority: Open Decision Triage

**[CONFIRMED]** Because this plan's source documents fixed several decision deadlines at "Sep 12" — one day before the actual project start — every open decision in §42 is now due **today (Sep 13)** or the critical path slips before it starts. Resolve these first, before writing implementation code:

1. Canonical API endpoint paths (`/analyze/login` vs `/analyze/login-event`, approval verb path)
2. Exact JSON payload shapes for all `/analyze/*` requests
3. `incident_alerts` / `alert_mitre_map` as explicit join tables (confirmed — see §15)
4. Alembic as the migration tool (confirmed — see §15)
5. TI timeout value (confirmed — see §20)
6. JWT expiry mechanics
7. `REVIEWED` incident state — include or drop (confirmed — see §13a)
8. React auxiliary libraries: Vite, Tailwind, TanStack Query (confirmed by tech-stack-meta — see §22)
9. Product/Technical Owner assignment

Items 3, 4, 5, 8 are resolved directly in this revision (see cross-references). Items 1, 2, 6, 7, 9 require a live team decision — do not proceed past Phase 1 (Foundation) without closing them.

---

## 2. Mission

Build, integrate, evaluate, and demonstrate the CyberGuard MVP across all three threat scenarios before the Oct 5–10 evaluation deadline. The goal is a working, integrated system pipeline that converts heterogeneous cyber-threat signals into an explainable, risk-prioritized, and human-approved response — not maximum feature count or disparate AI projects.

---

## 3. Definition of the MVP

**Product**
- Phishing URL/email analysis
- Digital impersonation analysis
- Account takeover/login anomaly analysis
- Unified alert model
- Risk scoring
- Confidence scoring
- Evidence/XAI
- MITRE mapping
- Response recommendation
- Human approval
- Incident handling
- SOC dashboard

**Technical**
- React + TypeScript frontend
- FastAPI backend (Python)
- PostgreSQL database
- PhishMind integration (existing asset, no retraining)
- Behavioral anomaly engine (Isolation Forest + rules)
- Impersonation engine (lookalike + stylometry + sender-auth)
- Threat intelligence (VirusTotal, URLhaus, AbuseIPDB)
- TI fallback/cache
- Risk fusion
- XAI
- MITRE
- Authentication (Basic JWT)
- Auditability (audit log)
- Docker Compose deployment

**Evaluation**
- Model evaluation (Accuracy, Precision, Recall, F1, AUC)
- Adversarial testing (homoglyph, punycode, redirect, shortener)
- System testing (E2E flows)
- Integration testing
- Latency measurement
- Fallback testing (offline cache activation)

**Demonstration**
- All three scenarios must be demonstrated through: Detection → Classification → Risk → Confidence → Explanation → MITRE → Response → Human Approval → Incident.

---

## 4. Scope Boundary

**[CONFIRMED]** Corrected from v1.0, which incorrectly marked every capability — including Deepfake, QR phishing, and Federated learning — as `[CONFIRMED]`. That draft error contradicted §34's Scope-Cut Ladder and the rest of this plan. The table below is the authoritative version.

| Capability | MVP | Stretch | Future |
|---|---|---|---|
| Phishing URL/Email | [CONFIRMED] | | |
| Digital Impersonation | [CONFIRMED] | | |
| Account Takeover | [CONFIRMED] | | |
| Unified Risk/Evidence/Response | [CONFIRMED] | | |
| Offline Threat Intel Fallback | [CONFIRMED] | | |
| Attack-chain graph (NetworkX) | | [CONFIRMED] | |
| MITRE visualization / Risk analytics screen | | [CONFIRMED] | |
| QR phishing | | [CONFIRMED] | |
| Deepfake (image/audio, pretrained ONNX) | | [CONFIRMED] | |
| Voice/video deepfake | | | [CONFIRMED] |
| SMS/social adapters | | | [CONFIRMED] |
| Large-scale graph infrastructure | | | [CONFIRMED] |
| Federated learning | | | [CONFIRMED] |
| Autonomous response | | | [CONFIRMED] |
| MISP integration | | | [CONFIRMED] |
| Enterprise integrations | | | [CONFIRMED] |

**Scope Freeze Rule**

**[CONFIRMED]** Once MVP implementation begins (target Sep 23 milestone), new features cannot enter MVP without an explicit team decision. Uncontrolled scope expansion — particularly toward deepfake capabilities — directly risks live-demo failure and distracts from the core fusion and reasoning pipeline differentiator.

---

## 5. Team Structure

**Role A — Technical Lead / Backend (Team Member A)**
Architecture adherence, PostgreSQL database, schemas, API endpoints, authentication, audit events, code review, release coordination.

**Role B — ML / Detection Engineer (Team Member B)**
PhishMind integration, phishing engine, impersonation engine (similarity/stylometry), ATO/behavior engine (Isolation Forest + rules), evaluation metrics, adversarial testing.

**Role C — Backend / Integration / DevOps (Team Member C)**
Cross-module integration, API contracts, risk fusion, threat intelligence (live adapters + fallback), XAI, MITRE, response/incident backend, Docker Compose, CI, testing.

**Role D — Frontend Engineer (Team Member D)**
React application, Vite build, TanStack Query setup, Dashboard, analyzers, alerts, incidents, Incident Detail, API integration, loading/error/empty frontend states.

**Role E — QA / Evaluation / Demo Data (Team Member E, or merged with C)**
Integration testing, E2E testing, test datasets (RBA, synthetic impersonation), demo fixtures, performance measurements, PPT evidence collection, security checks.

---

## 6. Responsibility Matrix

| Workstream | Lead | Secondary | Reviewer | Dependency |
|---|---|---|---|---|
| Product requirements | A | C | All | None |
| Architecture | A | C | All | PRD |
| API contracts | A | D | C | Architecture |
| Database | A | C | B | API Contracts |
| PhishMind / Phishing | B | C | A | API Contracts |
| Impersonation | B | C | A | API Contracts |
| ATO | B | C | A | API Contracts |
| Threat Intelligence | C | B | A | External APIs |
| Risk Fusion | C | B | A | ML Engines |
| XAI / MITRE | C | B | A | Risk Fusion |
| Response / Backend | A | C | B | Database |
| Frontend | D | A | C | API Contracts |
| Docker / Infra | C | A | D | Repository Setup |
| Testing | E | C | A | Integration |
| Evaluation / Demo | B | E | All | E2E MVP |

---

## 7. Work Breakdown Structure

1. **Project Foundation**
   - 0.1 Architecture and PRD approval
   - 0.2 Data contract finalization
2. **Repository & Development Environment**
   - 1.1 Repository setup & Git strategy
   - 1.2 Environment variables (VT API, JWT, DB)
   - 1.3 Docker baseline (Compose with Postgres, FastAPI, React/Vite)
   - 1.4 CI baseline (linting, unit tests)
3. **API & Data Contracts**
   - 2.1 Common Alert schema
   - 2.2 Analysis request schemas
   - 2.3 Incident & Response schemas
   - 2.4 API endpoint definitions
4. **Database**
   - 3.1 PostgreSQL setup & Alembic migrations
   - 3.2 Tables: users, devices, domains, urls, emails, login_events
   - 3.3 Tables: alerts, mitre_techniques, alert_mitre_map
   - 3.4 Tables: incidents, incident_alerts, evidence, response_actions
   - 3.5 Tables: threat_intelligence (cache), audit_log
5. **Detection**
   - 4.1 PhishMind adapter
   - 4.2 URL/email normalizer & heuristics
   - 4.3 Impersonation (domain similarity, stylometry, sender-auth)
   - 4.4 ATO features & rules
   - 4.5 Isolation Forest wrapper
6. **Threat Intelligence**
   - 5.1 VT, URLhaus, AbuseIPDB adapters
   - 5.2 TI Orchestrator & normalization
   - 5.3 Local cache fallback adapter
7. **Reasoning**
   - 6.1 Risk fusion engine (weights per threat)
   - 6.2 Confidence calculation
   - 6.3 XAI evidence builder
   - 6.4 MITRE technique mapper
   - 6.5 Response playbook
8. **Incident System**
   - 7.1 Alert-incident aggregation
   - 7.2 Human approval endpoints
9. **Frontend**
   - 8.1 API client & TanStack hooks
   - 8.2 Shared primitives (RiskBadge, EvidenceList, etc.)
   - 8.3 Analyzer routes (URL, Identity, Behavior)
   - 8.4 Alert & Incident tables
   - 8.5 Incident Detail view
   - 8.6 Dashboard view
10. **Integration & Testing**
    - 9.1 Unit & contract tests
    - 9.2 E2E scenario flow
    - 9.3 Adversarial testing suite
    - 9.4 TI fallback testing
11. **Demo & Final Release**
    - 10.1 Deterministic demo fixtures
    - 10.2 Evidence collection for PPT
    - 10.3 Final documentation freeze

---

## 8. Dependency Graph

**Blocking dependencies:**

```
Repository Setup
  ↓
API Contracts & Data Schemas (Common Alert, JSON payloads)
  ↓
Database (PostgreSQL tables)
  ↓
Backend foundations (FastAPI structure, Auth, DB Session)
  ↓
Detection adapters (PhishMind, Impersonation, ATO)
  ↓
Threat Intelligence Orchestrator (Live + Cache)
  ↓
Risk Fusion
  ↓
XAI / MITRE
  ↓
Response / Incident / Approval
  ↓
Backend Integration (End-to-End API routes)
```

**Parallel work:**

```
Database & Contracts ───────────────┐
ML Engines & Fallback Data ─────────┼──→ Backend Integration
Frontend Shell & Mock Data ─────────┘
```

Frontend development (React screens, states, mock wiring) can proceed in parallel once API contracts are frozen, using `mock-data.ts`.

---

## 9. Critical Path

| Task | Why Critical | Blocking | Owner |
|---|---|---|---|
| API Contracts | Mismatch prevents parallel frontend/backend work | Yes | A |
| PhishMind Integration | Core of Scenario 1; pipeline relies on its output | Yes | B |
| Risk Fusion Logic | Core differentiator; feeds XAI and Response | Yes | C |
| Incident Detail Screen | Primary demo/response surface; high complexity | No | D |
| E2E Scenario Flow | Defines "Done"; required for metrics/evaluation | Yes | C |
| TI Fallback/Cache | Must demo offline resilience; required for hackathon | No | C |

---

## 10. Development Phases

**Phase 0 — Project Freeze**
Outputs: Approved PRD, Architecture, PLAN.md, team ownership, scope freeze.

**Phase 1 — Foundation**
Build: GitHub repository, backend skeleton (FastAPI), frontend skeleton (React/Vite), PostgreSQL, Docker Compose, CI, API contract baseline.

**Phase 2 — Core Data & Contracts**
Build: database schema (Alembic migrations), common alert schema, incident schema, evidence schema, response schema, mock fixtures.

**Phase 3 — Detection Engines**
Implement: Phishing (URL/Email) → Impersonation → ATO. Each must produce the common internal signal format.

**Phase 4 — Intelligence & Reasoning**
Implement: TI adapters, TI cache fallback, risk fusion, confidence calculation, XAI generation, MITRE lookup, response recommendation playbook.

**Phase 5 — Incident & Backend**
Implement: alert persistence, incident aggregation, human approval routing, audit events, dashboard summary endpoint, JWT authentication.

**Phase 6 — Frontend**
Implement in order: 1. API client/hooks, 2. shared components, 3. URL Analyzer, 4. Identity Analyzer, 5. Behavior Analyzer, 6. Incident Detail, 7. Dashboard, 8. Alerts/Incidents lists.

**Phase 7 — Integration**
Run all three scenarios end-to-end via FastAPI and React UI.

**Phase 8 — Testing & Evaluation**
Run: unit tests, adversarial tests (homoglyph/punycode), fallback tests, performance latency measurements, ML evaluation (AUC/Precision/Recall).

**Phase 9 — Demo Hardening**
Prepare: deterministic mock fixtures, offline mode check, demo reset scripts, known-good scenarios, PPT metrics extraction, architecture diagrams.

**Phase 10 — Final Release**
Freeze: code, documentation, evaluation results, PPT, demo script.

---

## 11. Detailed Task Cards

### TASK-001 — Common Alert Contract & API Schemas
- **Owner:** A | **Secondary:** D | **Reviewer:** C
- **Purpose:** Freeze the JSON shapes for requests and alerts so frontend and backend can work in parallel.
- **Inputs:** Architecture §16, Frontend Readiness §8.
- **Implementation:** Create Pydantic models in FastAPI and TypeScript interfaces in React for `Alert`, `Incident`, `Evidence`, `MitreTechnique`.
- **Dependencies:** None.
- **Output:** Frozen models in repository.
- **Acceptance Criteria:** Frontend `mock-data.ts` and backend mock endpoints use the exact same schema.

### TASK-002 — Phishing Engine Integration
- **Owner:** B | **Secondary:** C | **Reviewer:** A
- **Purpose:** Wrap the existing PhishMind asset into FastAPI.
- **Implementation:** Load model artifact in memory. Normalize URL. Extract features. Add TLD/urgency heuristics.
- **Files:** `backend/app/detection/phishing/`.
- **Dependencies:** TASK-001.
- **Acceptance Criteria:** Endpoint returns `ml_score` and `heuristic_score` between 0 and 1.
- **Testing:** Pass 10 known malicious and 10 known benign URLs.
- **Risk:** Model load failure. **Contingency:** Return an explicit "unavailable" signal; rely on heuristics + TI.

### TASK-003 — Impersonation Engine Integration
- **Owner:** B | **Secondary:** C | **Reviewer:** A
- **Purpose:** Score sender/message/domain signals for impersonation risk.
- **Implementation:** Levenshtein/lookalike domain check against known-org list → `domain_similarity_score`. TF-IDF stylometric comparison against known-contact corpus → `stylometry_score`. Simulated SPF/DKIM sender-authenticity check → `sender_auth_score`. Aggregate into `identity_score`.
- **Files:** `backend/app/detection/impersonation/`.
- **Dependencies:** TASK-001.
- **Acceptance Criteria:** Endpoint returns `identity_score` and its three component scores, each between 0 and 1.
- **Testing:** Pass the §7.2 Flow 2 worked example plus at least 5 synthetic benign sender/message pairs.
- **Risk:** No standard dataset exists for this scenario. **Contingency:** Use a clearly labelled synthetic corpus; never present it as real-world data (per PRD §21/§28).

### TASK-004 — ATO / Behavioral Engine Integration
- **Owner:** B | **Secondary:** C | **Reviewer:** A
- **Purpose:** Score login events for account-takeover risk.
- **Implementation:** Extract RBA features (device, geo, timestamp, RTT, success flag). Evaluate static rules (impossible travel, password spraying, new device) → `rule_hit_score`. Fit/run scikit-learn `IsolationForest` on an RBA subset → `anomaly_score`.
- **Files:** `backend/app/detection/behavior/`.
- **Dependencies:** TASK-001.
- **Acceptance Criteria:** Endpoint returns `rule_hit_score` and `anomaly_score`, each between 0 and 1, given a valid login-event payload.
- **Testing:** Pass the §7.2 Flow 3 impossible-travel example plus at least 5 benign login sequences.
- **Risk:** Isolation Forest requires a fitted baseline; cold-start with too little data may misfire. **Contingency:** Ship a pre-fit model artifact trained on the RBA holdout rather than fitting live.

### TASK-005 — Threat Intelligence Orchestrator & Fallback
- **Owner:** C | **Secondary:** A | **Reviewer:** B
- **Purpose:** Query VT/URLhaus/AbuseIPDB and fail over to cache without breaking the pipeline.
- **Implementation:** Build async HTTP calls with 2s timeouts (see §20 for the confirmed threshold). If timeout/429, query local JSON cache.
- **Dependencies:** Backend foundation.
- **Acceptance Criteria:** Unplugging the network triggers cache fallback and sets `data_completeness_note`.

### TASK-006 — Risk Fusion & XAI Engine
- **Owner:** C | **Secondary:** B | **Reviewer:** A
- **Purpose:** Convert raw ML/TI signals into Risk, Confidence, and structured Evidence.
- **Implementation:** Apply the documented per-threat weights (Blueprint §7/Execution Plan §7). Map hit rules to evidence text. Look up MITRE tags.
- **Dependencies:** TASK-002, TASK-003, TASK-004 (all detection engines).
- **Acceptance Criteria:** Produces the final canonical Alert object.

### TASK-007 — MITRE Technique Mapper
- **Owner:** C | **Secondary:** B | **Reviewer:** A
- **Purpose:** Attach ATT&CK technique IDs to each alert as enrichment, not a separate AI system.
- **Implementation:** Static threat-type → technique lookup table (10–15 entries per Architecture §11); no dynamic inference.
- **Dependencies:** TASK-006.
- **Acceptance Criteria:** Every alert produced by TASK-006 carries at least one MITRE technique with `technique_id`, `name`, and `tactic`.
- **Open item:** Full 10–15 entry table is not yet enumerated (see §42, item 3) — placeholder entries plus the one confirmed example (T1566.002) ship until the table is finalized.

### TASK-008 — Incident Detail Screen
- **Owner:** D | **Secondary:** A | **Reviewer:** C
- **Purpose:** The primary SOC analyst decision interface.
- **Implementation:** React component displaying Threat Header, RiskBadge, ConfidenceIndicator, EvidenceList, MITREBadge, RecommendationCard, ApprovalControl.
- **Dependencies:** Frontend API client, shared components.
- **Acceptance Criteria:** Clicking "Approve" triggers `POST /api/v1/incidents/{id}/approve` and updates status to `Contained`.

### TASK-009 — Dashboard Summary View
- **Owner:** D | **Secondary:** A | **Reviewer:** C
- **Purpose:** Give the analyst situational awareness at shift start.
- **Implementation:** AttentionBand (Critical+High count), SeverityTiles, ScenarioCounters (Phishing/Impersonation/ATO), TimelineChart, RecentIncidentsList — reading from `GET /api/v1/dashboard/summary`.
- **Dependencies:** TASK-001, backend dashboard endpoint.
- **Acceptance Criteria:** Dashboard renders all five components from a single API call and matches the `DashboardSummary` TypeScript interface with no invented fields.

### TASK-010 — Authentication & Audit Trail
- **Owner:** A | **Secondary:** C | **Reviewer:** B
- **Purpose:** Gate the API behind Basic JWT auth and record every approval-path action.
- **Implementation:** JWT issuance on `POST /api/v1/auth/login`; append-only audit log on Approve/Dismiss/Escalate actions; API physically rejects `status = Contained` without an approval payload.
- **Dependencies:** Database (users, audit_log tables).
- **Acceptance Criteria:** Unauthenticated requests to protected routes return 401; every incident state change produces one audit_log row.
- **Open item:** Exact JWT expiry value is [OPEN DECISION] (§42, item 6).

---

## 12. Detection Engine Execution Plans

**Phishing**
1. Load existing PhishMind model artifact in FastAPI memory.
2. Define adapter interface accepting normalized URL/email.
3. Normalize URL (resolve shorteners, decode punycode, cap redirect hops).
4. Extract features (lexical, structural).
5. Run PhishMind → `ml_score`.
6. Run heuristics (domain age, TLD reputation) → `heuristic_score`.
7. Query TI Orchestrator.
8. Handle TI failure via fallback cache.
9. Produce normalized signals for fusion.

**Impersonation**
1. Ingest sender string, message body, claimed organization.
2. Execute Levenshtein/lookalike check against known-org domain list → `domain_similarity_score`.
3. Execute stylometric TF-IDF comparison against known-contact corpus → `stylometry_score`.
4. Execute sender authenticity (SPF/DKIM mismatch simulation) → `sender_auth_score`.
5. Aggregate into `identity_score`.
6. Pass to fusion.

**ATO**
1. Ingest login event schema (device, geo, timestamp, RTT, success flag).
2. Extract RBA features.
3. Evaluate static rules (impossible travel, password spraying, new device) → `rule_hit_score`.
4. Evaluate `IsolationForest` (scikit-learn, fit on RBA subset) → `anomaly_score`.
5. Pass to fusion.

---

## 13. Common Alert Contract

**[CONFIRMED]** Every detection engine MUST output the same conceptual structure to the fusion layer, culminating in the canonical Alert sent to the frontend:

```
Input → Detection Signal → Evidence → Risk (0-1) → Confidence (0-1) → MITRE → Recommendation → Alert
```

Frontend developers strictly consume the normalized Alert contract; they do not write custom logic for engine-specific responses.

### 13a. Incident Lifecycle States [OPEN DECISION — resolve Day 1]

Source documents disagree on whether a `REVIEWED` state exists between `OPEN` and a terminal state. Until resolved, use the four-state model the frontend spec and mock fixtures already assume:

```
OPEN → CONTAINED
     → DISMISSED
     → ESCALATED
```

If the team confirms `REVIEWED` is needed (e.g., to represent "analyst opened it but hasn't acted yet"), it inserts between `OPEN` and the three terminal states and must be added to `Incident.status` in TASK-001's schema before Phase 2 closes — a late addition here breaks both the DB migration and the frontend `StatusBadge` component.

---

## 14. API Implementation Order

**[PROPOSED]** Exact order for implementing endpoints:

1. `GET /api/v1/health`
2. `POST /api/v1/auth/login` (auth setup)
3. `POST /api/v1/analyze/url`
4. `POST /api/v1/analyze/email`
5. `POST /api/v1/analyze/identity`
6. `POST /api/v1/analyze/login-event` (resolves naming conflict from the Frontend Readiness Assessment)
7. `GET /api/v1/alerts`
8. `GET /api/v1/alerts/{id}`
9. `GET /api/v1/incidents`
10. `GET /api/v1/incidents/{id}`
11. `POST /api/v1/incidents/{id}/approve` (resolves naming conflict from the Frontend Readiness Assessment)
12. `POST /api/v1/incidents/{id}/dismiss`
13. `POST /api/v1/incidents/{id}/escalate`
14. `GET /api/v1/dashboard/summary`
15. `GET /api/v1/mitre/techniques`

**Note on naming:** [OPEN DECISION] The exact canonical paths for approval verbs (`/incidents/{id}/approve` vs `/alerts/{id}/respond`) are marked open in the PRD, but Architecture §15 establishes the `/incidents` path as canonical. The team must follow Architecture §15 for API endpoints; this list already reflects that resolution.

---

## 15. Database Implementation Order

1. PostgreSQL instance in Docker.
2. **[CONFIRMED]** Alembic migration system — resolves the §42 open item; Alembic is the standard migration tool for SQLAlchemy/FastAPI stacks and requires no additional dependency beyond what the backend already needs.
3. Core tables: `users`, `devices`, `domains`, `urls`, `emails`, `login_events`.
4. Core tables: `alerts`, `incidents`, `evidence`, `mitre_techniques`, `response_actions`.
5. Join tables: `alert_mitre_map`, `incident_alerts`. **[CONFIRMED]** Explicit join tables over JSON columns — resolves the §42 open item; this matches Architecture §13's stated preference for explicit join tables over vague JSON wherever a many-to-many relationship exists, and both `alert↔mitre` and `incident↔alert` are exactly that.
6. Operational tables: `threat_intelligence`, `audit_log`.
7. Seed data & test fixtures.

---

## 16. Frontend Execution Plan

| Screen | Components | API Dependency | Integration Milestone |
|---|---|---|---|
| Incident Detail | ThreatHeader, RiskBadge, EvidenceList, MITREBadge, RecommendationCard, ApprovalControl | `GET /incidents/{id}`, `POST /incidents/{id}/*` | Priority 1 — core reasoning/response UX |
| URL Analyzer | AnalyzerForm, AnalyzerResult + shared primitives | `POST /analyze/url` | Priority 2 — phishing demo |
| Identity Analyzer | AnalyzerForm, AnalyzerResult + shared primitives | `POST /analyze/identity` | Priority 3 — impersonation demo |
| Behavior Analyzer | AnalyzerForm, AnalyzerResult + shared primitives | `POST /analyze/login-event` | Priority 4 — ATO demo |
| Dashboard | AttentionBand, SeverityTiles, ScenarioCounters, TimelineChart | `GET /dashboard/summary` | Priority 5 — SOC overview |
| Alerts / Incidents | Filters, tables | `GET /alerts`, `GET /incidents` | Priority 6 — navigation |

---

## 17. Testing Strategy

**Unit Tests**
- URL normalization (punycode, shorteners)
- Risk fusion weight logic & risk tier mapping
- Confidence calculation
- ATO rule thresholds
- Impersonation similarity logic

**Integration Tests**
- Detection engine → Fusion Engine → XAI output
- Response recommendation → Incident database persistence
- TI fallback behavior (mock network outage)

**E2E**
- Run full Scenario 1 (Phishing), Scenario 2 (Impersonation), Scenario 3 (ATO) from frontend submission → DB persistence → incident approval.

---

## 18. ML Evaluation Plan

**[CONFIRMED]** Do not fabricate results; measure and report honestly.

- **PhishMind:** 1.14M URL corpus (check for train/test domain leakage).
- **Metrics:** Accuracy, Precision, Recall, F1, ROC-AUC (PhishMind).
- **ATO Isolation Forest:** Precision, Recall, False Positive Rate, inference latency on RBA dataset holdout.
- **Impersonation:** Precision/Recall on synthetic corpus.
- **System:** end-to-end latency.

---

## 19. Adversarial Testing Plan

**[CONFIRMED]** The primary judge-defense asset is demonstrating where the model fails and how preprocessing fixes it.

| Attack Variation | Expected Behavior | Test Status | Result |
|---|---|---|---|
| Homoglyph domain | Flagged via punycode-decode preprocessing | [TBD] | [TBD] |
| Punycode-encoded IDN | Decoded, underlying string analyzed | [TBD] | [TBD] |
| Redirect chain | Final hop resolved and scored (up to 5 hops) | [TBD] | [TBD] |
| URL shortener | Resolved before scoring | [TBD] | [TBD] |
| Subdomain manipulation | Flagged via lexical n-grams | [TBD] | [TBD] |

---

## 20. Threat Intelligence Failure Plan

Must be explicitly tested to validate the offline-first resilience requirement.

- **Test cases:** internet available; API timeout (2s — **[CONFIRMED]**, resolves the §42 open item and matches TASK-005's implementation); API rate limited (429); network fully disconnected.
- **Expected behavior:** CyberGuard must continue operating using the fallback local JSON cache.
- **Evidence:** record fallback activation, `data_completeness_note` in UI, and overall latency.

---

## 21. Security Implementation Checklist

- **Authentication:** Basic JWT implemented before UI integration.
- **Input Validation:** Pydantic validation on all `/analyze` endpoints.
- **SSRF Protection:** URL normalizer resolves DNS and rejects RFC1918/loopback/metadata IPs before outbound HTTP fetch.
- **Rate Limiting:** FastAPI `slowapi` limits on `/analyze` routes to protect VT quota.
- **Secrets:** `.env` variables for VT, AbuseIPDB, JWT secret.
- **Audit Trail:** append-only logging of Approve/Dismiss/Escalate actions.
- **Approval Gate:** API physically rejects `status = Contained` without an approval payload.

---

## 22. DevOps Plan

**Local Development**
- Python 3.11 environment (FastAPI, requirements.txt)
- Node/Vite environment for React
- Docker Compose for integrated running

**[CONFIRMED — resolves §42 item 8]** React auxiliary libraries: **Vite** (build tool), **TanStack Query** (data fetching/caching), and **Tailwind CSS** (styling) — all three are already named in this plan (§5 Role D, §9, §11 TASK-001/008/009) and in the source tech-stack-meta document; formalizing them here removes the last ambiguity blocking frontend scaffolding.

**CI**
- Commit → Lint (ruff/black, eslint/prettier) → Unit Test (pytest, vitest) → Build → Container Validation (health-check).

**Deployment**
- Development → Demo/Production (single Docker Compose instance running offline/locally for judges). Do not over-engineer cloud CI/CD.

---

## 23. Git Strategy

- `main`: production-ready, demoable code.
- `feature/*`: new modules (e.g., `feature/ato-engine`).
- `fix/*`: bug fixes.
- **Review:** PRs require approval before merge.
- **Integration:** rebase frequently against `main` to avoid merge hell in week 3.

---

## 24. Daily Development Workflow

1. Pull latest `main`.
2. Review assigned task card.
3. Check dependencies (contracts, mock data).
4. Implement code.
5. Run local tests (pytest/vitest).
6. Commit using standard convention.
7. Push branch.
8. Open PR.
9. Code review.
10. Merge to `main`.
11. Update tracker status.

---

## 25. Team Coordination

**Daily Standup**
Done, Today, Blockers. Keep strictly to 10 minutes.

**Integration Checkpoints**
- End of Week 1 (Sep 19): all 3 ML/detection modules producing raw scores. *(Rebaselined from "Sep 16" — see §26 note.)*
- Sep 22: fusion + explanation functional E2E for the Phishing flow. *(Rebaselined from "Sep 20.")*
- Sep 26: MVP feature complete — all 3 flows work. *(Rebaselined from "Sep 23"; see §26 note for why the buffer was added.)*
- Demo freeze: Oct 3 (unchanged — still the last safe day before the Oct 5 evaluation window opens).

---

## 26. Milestones

**Note on date rebaselining:** v1.0 of this plan set several milestones and open-decision deadlines to "Sep 12" and "Sep 16," both of which fall before or on this plan's own "Last updated" date of Sep 13. Practically, that means the plan was already behind schedule the moment it was approved. This revision shifts the affected near-term milestones forward by 2–3 days to give Day-1 decision triage (§0) room to happen without immediately blowing the schedule; it does **not** move the fixed external deadline (Oct 5–10 evaluation window) or the scope-freeze philosophy in §4/§34.

| Milestone | Target | Note |
|---|---|---|
| M0 — Documentation Freeze | Sep 13 | PRD, Architecture, PLAN approved |
| M1 — Repository + Infrastructure | Sep 15 | FastAPI, React, Postgres running in Compose |
| M2 — Common Contracts | Sep 16 | API schemas and database DDL locked |
| M3 — First Detection Pipeline | Sep 18 | URL phishing scores generated |
| M4 — All Detection Engines | Sep 19 | ATO and impersonation scoring |
| M5 — Full Reasoning Pipeline | Sep 22 | Risk, XAI, MITRE, response logic done |
| M6 — Frontend Integration | Sep 24 | Analyzers and Incident Detail wired to backend |
| M7 — End-to-End MVP | Sep 26 | Feature freeze |
| M8 — Evaluation Complete | Sep 29 | Adversarial tests and metrics recorded |
| M9 — Demo Ready | Oct 2 | Fixtures stable, offline mode verified |
| M10 — Final Submission Ready | Oct 3 | Code and PPT locked |

---

## 27. Definition of Done

**Task-level DoD**
Code implemented, tests passing, UI matches schema, PR approved, merged.

**Project-level DoD**
- All three scenarios (Phishing, Impersonation, ATO) work end-to-end.
- Unified alert contract is produced.
- Risk/Confidence are calculated separately.
- XAI evidence and MITRE mappings render correctly.
- Human approval successfully updates incident state.
- Dashboard renders aggregate data.
- TI offline fallback functions flawlessly.
- Evaluation metrics are documented without fabrication.
- Docker setup spins up reliably.

---

## 28. Demo Engineering Plan

**Demo 1 — Phishing**
Submit a known malicious URL. Show Detection → Risk → Confidence → Evidence → MITRE → Recommendation → Human Approval → Incident state change.

**Demo 2 — Impersonation**
Submit a crafted sender/message payload. Show Identity Analysis → Evidence → Risk → Verify Action → Approval.

**Demo 3 — ATO**
Submit a suspicious login event (impossible travel + new device). Show Rule + Anomaly Evidence → Risk → Revoke Session Action → Approval.

**Demo 4 — Resilience**
Disconnect internet. Submit a URL. Show TI API timeout → fallback cache activation → analysis continues with `data_completeness_note` updated.

**Demo 5 — Adversarial Robustness**
Submit a homoglyph URL. Show the preprocessing step fixing it and catching the threat.

---

## 29. Demo Data Strategy

1. **Demo Fixtures:** deterministic, resetting SQL seed files ensuring the dashboard is populated with realistic safe, medium, high, and critical incidents.
2. **Evaluation Datasets:** PhishMind (1.14M URLs), RBA (33M logins), Synthetic Impersonation Corpus (~50–100 examples).
3. **Real/Production Data:** never use real PII, credentials, or unauthorized private emails during the demo.

---

## 30. Evidence Collection Plan

| Capability | Evidence | Owner | Status |
|---|---|---|---|
| Phishing | Model result, Risk, XAI, MITRE, Response | B | [TBD] |
| ATO | Rule trigger, anomaly score, XAI, Response | B | [TBD] |
| TI | Online lookup logs, offline fallback logs | C | [TBD] |
| Evaluation | Metrics, latency, adversarial comparison | B | [TBD] |
| Architecture | System diagram, DB schema | A | [TBD] |
| Frontend | Dashboard UI, Incident Detail UI | D | [TBD] |

---

## 31. PPT / Presentation Dependency Plan

- **System Architecture Slide:** requires Architecture.md + final diagram.
- **Model Evaluation Slide:** requires ML evaluation metrics (Accuracy, F1, Latency).
- **Adversarial Robustness Slide:** requires before/after normalization tests.
- **XAI & MITRE Slide:** requires Incident Detail UI screenshots.
- **Offline Resilience Slide:** requires TI fallback log/demo capability.
- **Three Scenarios Slide:** requires working E2E code for Phishing, Impersonation, ATO.

---

## 32. Risk Register

| Risk | Probability | Impact | Owner | Trigger | Mitigation | Contingency |
|---|---|---|---|---|---|---|
| Scope Creep (Deepfake) | High | High | A | Touching deepfake before MVP | Strict scope freeze | Cut feature |
| PhishMind Integration | Low | High | B | Python incompatibilities | Early test integration | Demo mock responses |
| API Contract Mismatch | Med | High | A | Frontend errors on backend data | Freeze JSON schemas first | Revert to mocked UI layer |
| TI API Failure | High | Med | C | Rate limit / venue Wi-Fi | Build offline cache | Demo fully offline |
| Adversarial Collapse | Med | Med | B | Model fails on homoglyphs | Test early | Report honestly as a limitation |
| Schedule slip from date rebaselining | Med | Med | A | Day-1 open decisions not closed by Sep 13 EOD | Time-box §0 triage to a single kickoff meeting | Escalate unresolved items to Product/Technical Owner for a unilateral call |

---

## 33. Contingency Plans

- **If PhishMind fails:** do not replace it. Return an explicit "unavailable" signal; allow heuristics and TI to determine the risk score.
- **If TI fails:** automatic failover to local JSON cache.
- **If frontend integration is delayed:** backend can still demo the pipeline via REST API calls. Frontend uses stable mock contracts (`mock-data.ts`).
- **If an evaluation metric is weak:** report honestly, analyze why, explain the mitigation (e.g., punycode fixing). Do not fabricate results.

---

## 34. Scope-Cut Ladder

**[CONFIRMED]**

- **Cut Level 1:** Attack-chain graph, MITRE Map UI, Risk Analytics screen.
- **Cut Level 2:** Deepfake image detection (pretrained ONNX), QR phishing.
- **Never Cut:** 3 core scenarios (Phishing, Impersonation, ATO), Risk/Confidence separation, XAI evidence, MITRE tags, response recommendation, human approval gate, TI fallback, basic auth/security.

---

## 35. Final 72-Hour Plan

- **T-72h:** code freeze. Final E2E testing of all 3 scenarios.
- **T-48h:** demo rehearsal 1. Capture screenshots for PPT. Extract evaluation metrics.
- **T-24h:** fix critical bugs. Test offline mode (network disconnect).
- **T-12h:** reset database with clean deterministic fixtures.
- **T-6h:** final PPT review against engineering evidence.
- **T-3h:** backup local containers on all team laptops.
- **T-1h:** final dry-run.

---

## 36. Final Release Checklist

**Product**
- [ ] Three scenarios work
- [ ] Dashboard works
- [ ] Alerts work
- [ ] Incidents & Incident Detail work

**Reasoning**
- [ ] Risk
- [ ] Confidence
- [ ] Evidence
- [ ] MITRE
- [ ] Recommendation
- [ ] Human approval

**Backend**
- [ ] APIs
- [ ] DB
- [ ] Authentication
- [ ] Error handling
- [ ] Audit

**ML**
- [ ] PhishMind
- [ ] Impersonation
- [ ] ATO
- [ ] Evaluation
- [ ] Adversarial testing

**Reliability**
- [ ] TI fallback
- [ ] Offline demo
- [ ] Docker
- [ ] Reset procedure

**Security**
- [ ] Secrets removed
- [ ] Input validation
- [ ] SSRF protections
- [ ] Authorization
- [ ] Audit trail

**Documentation**
- [ ] PRD
- [ ] Architecture
- [ ] Contributing
- [ ] PLAN
- [ ] Evaluation results

**Demo**
- [ ] Phishing demo
- [ ] Impersonation demo
- [ ] ATO demo
- [ ] Offline fallback demo
- [ ] Adversarial demo
- [ ] Backup demo path

---

## 37. Repository Mapping

| Workstream | Directory | Owner |
|---|---|---|
| Backend | `backend/app/` | A |
| Frontend | `frontend/src/` | D |
| ML Engines | `backend/app/detection/` | B |
| TI & Reasoning | `backend/app/threat_intel/`, `risk/`, `xai/` | C |
| Tests | `tests/unit/`, `tests/integration/` | E |
| Demo Data | `frontend/src/mocks/` | D |
| Evaluation | `evaluation/` | B |
| Documentation | `docs/` | A |

---

## 38. Progress Tracking

| ID | Task | Owner | Status | Dependency | Target | Evidence |
|---|---|---|---|---|---|---|
| 01 | API Contracts | A | NOT STARTED | None | Sep 14 | OpenAPI Spec |
| 02 | DB Setup | A | NOT STARTED | 01 | Sep 15 | Postgres DB |
| 03 | PhishMind Int. | B | NOT STARTED | 01 | Sep 16 | Model returns score |
| 04 | TI Fallback | C | NOT STARTED | 02 | Sep 17 | Cache activates |
| 05 | React Shell | D | NOT STARTED | 01 | Sep 16 | UI loads |

*Note: target dates rebaselined against the actual Sep 13 project start (see §26); v1.0's targets of Sep 12–15 for these same rows had already lapsed or fell same-day.*

---

## 39. Weekly / Phase Review Questions

1. Does the implementation still match the PRD?
2. Does it still match Architecture.md?
3. Are API contracts synchronized?
4. Are all three scenarios progressing?
5. Are we accumulating technical debt?
6. Are any MVP features at risk?
7. What can be cut?
8. What must happen next?
9. Are evaluation artifacts being collected?
10. Is the demo path still executable?

---

## 40. Traceability Matrix

| PRD Requirement | Implementation Task | Owner | Component | Test | Evidence | Status |
|---|---|---|---|---|---|---|
| URL Phishing | TASK-002 | B | `detection/phishing/` | Unit/E2E | Alert JSON | NOT STARTED |
| Impersonation | TASK-003 | B | `detection/impersonation/` | Unit/E2E | Alert JSON | NOT STARTED |
| ATO | TASK-004 | B | `detection/behavior/` | Unit/E2E | Alert JSON | NOT STARTED |
| Threat Intelligence Fallback | TASK-005 | C | `threat_intel/` | Integration | Fallback log | NOT STARTED |
| Risk Fusion | TASK-006 | C | `risk/fusion.py` | Unit | Risk Tier | NOT STARTED |
| Explainability | TASK-006 | C | `xai/` | Unit | Evidence[] | NOT STARTED |
| MITRE Mapping | TASK-007 | C | `mitre/` | Unit | MITRE chips | NOT STARTED |
| Incident Detail | TASK-008 | D | `IncidentDetail.tsx` | E2E | UI Screen | NOT STARTED |
| Dashboard | TASK-009 | D | `Dashboard.tsx` | E2E | UI Screen | NOT STARTED |
| Authentication & Audit | TASK-010 | A | `auth/`, `audit/` | Unit/Integration | 401 responses, audit rows | NOT STARTED |

*Resolves the `TASK-00x` placeholders left unassigned in v1.0 for Impersonation and ATO, and adds rows for TASK-006 through TASK-010, which v1.0's task cards (§11) did not yet cover.*

---

## 41. Final Readiness Scorecard

*(RED = Not started/Blocked, YELLOW = In progress/Pending decisions, GREEN = Done)*

- **Product readiness:** RED — requires all 3 scenarios E2E
- **Architecture readiness:** YELLOW — API paths pending resolution
- **Backend readiness:** RED
- **Frontend readiness:** RED
- **ML readiness:** RED
- **Database readiness:** RED
- **Security readiness:** RED
- **Testing readiness:** RED
- **Evaluation readiness:** RED
- **Demo readiness:** RED
- **Documentation readiness:** YELLOW — PRD, Architecture, PLAN in progress

---

## 42. Open Decisions

| Decision | Why Needed | Owner | Deadline | Impact if Unresolved |
|---|---|---|---|---|
| RBAC roles beyond Analyst | Clarify dashboard visibility | A | Sep 13 | Scope creep or security gap |
| Canonical API endpoint paths | `/analyze/login` vs `/analyze/login-event`; approval verb path | A | Sep 13 | Frontend/backend break |
| Full MITRE table entries | 10–15 exact mappings required | C | Sep 14 | Blank UI chips |
| Exact JSON payload shapes | Needed for Pydantic/TypeScript | A | Sep 13 | Integration failure |
| ~~TI timeout value~~ | ~~Offline fallback threshold~~ | ~~C~~ | ~~Resolved~~ | **[CONFIRMED] 2s — see §20** |
| JWT expiry mechanics | Security requirement | A | Sep 14 | Demo session drops |
| `REVIEWED` incident state | UI state mismatch | D | Sep 14 | UI/DB state drift — see §13a for interim resolution |
| Product/Technical Owners | Accountability | All | Sep 13 | Leadership gap |
| ~~React auxiliary libraries~~ | ~~Vite, Tailwind, Query choice~~ | ~~D~~ | ~~Resolved~~ | **[CONFIRMED] Vite + TanStack Query + Tailwind — see §22** |
| ~~Alembic migration tool~~ | ~~DB version control~~ | ~~A~~ | ~~Resolved~~ | **[CONFIRMED] Alembic — see §15** |
| ~~`incident_alerts` join table~~ | ~~Confirm over JSON~~ | ~~A~~ | ~~Resolved~~ | **[CONFIRMED] Explicit join tables — see §15** |
| TI & Audit DDL | Missing from initial schema | A | Sep 14 | App crash on write |

*Deadlines rebaselined from v1.0's uniform "Sep 12"/"Sep 13" (already past or same-day at plan approval) to Sep 13–14, giving the team one working day past kickoff to close each item — see §0 for the Day-1 triage order.*

---

## 43. Execution Principles

1. Build the pipeline, not isolated features.
2. Freeze contracts before parallel implementation.
3. Prefer integration over feature count.
4. Do not replace working assets unnecessarily (PhishMind).
5. Never fabricate evaluation results.
6. Keep Stretch features out of the critical path.
7. Test failure modes deliberately (TI fallback).
8. Make the demo reproducible.
9. Human approval remains mandatory.
10. Every major claim must have engineering evidence.

---

## Planning Assumptions

- Development window spans roughly 3 weeks (Sep 13 to Oct 3) with delivery for the Oct 5–10 evaluation.
- The tech stack is React + TypeScript and FastAPI + Python, per the confirmed tech-stack decision — explicitly deviating from the earlier Angular assumption in the original blueprint documents.
- The system will be evaluated in a local/offline setting requiring Docker Compose.

## Source Traceability

All requirements, phases, tables, and workflows within this execution plan have been directly extracted and reconciled from `PRD.md`, `ARCHITECTURE.md`, `CYBERGUARD_BLUEPRINT.md`, `CyberGuard Execution Plan.pdf`, `CyberGuard Frontend Readiness Assessment`, `Problem_Statement_9.pdf`, and `2026-09-11-tech-stack-meta.md`.

## Final Readiness Checklist

This plan is designed to be executable immediately upon team approval. Open decisions must be triaged on Day 1 (Sep 13) per §0 to unlock the critical path. Ensure all team members explicitly acknowledge the Scope Freeze rule (§4) before proceeding to implementation.
