# CYBERGUARD — Strategic & Technical Blueprint (PS09)
**AI-Powered Cyber Threat, Phishing & Digital Impersonation Detection and Response System**
Prepared for: BPUT Hackathon evaluation, Oct 5–10, 2026 | Team asset: PhishMind (BiLSTM+CNN+TF-IDF+heuristics → RF, ~98.5% acc / 0.998 AUC, 1.14M URLs)

**Labeling key used throughout:** `CONFIRMED` = verified via search/citation this session · `LIKELY` = well-supported by literature but not independently re-verified here · `INFERRED` = reasonable engineering judgment, not a literature claim · `UNVERIFIED` = stated by you or prior docs, not independently checked.

---

## 0. Executive Verdict

**Build this, not the obvious thing:** a single coherent pipeline — **URL/email phishing (PhishMind core) → identity/impersonation-by-metadata → login-behavior anomaly (RBA-style) → fused risk scoring → MITRE-tagged explanation → response recommendation → one SOC dashboard** — with deepfake media detection demoted to a **narrow, honestly-labeled stretch module**, not a core pillar.

This is a deliberate deviation from "phishing + deepfake + everything," because:

1. Your own prior research (Consensus review, in project files) already flags full multimodal fusion (phishing + impersonation + ATO + deepfake) as **medium feasibility with the highest scope/robustness risk** in 3–4 weeks, while narrow, well-integrated pipelines score higher on realistic delivery. `UNVERIFIED` (your prior doc, not independently re-run, but internally consistent with fresh literature below).
2. Fresh search confirms real hackathon/student repos routinely combine **phishing + MITRE mapping + threat-intel enrichment (VirusTotal/AbuseIPDB)** — that pairing is `LIKELY common`. Repos combining **phishing + impersonation + behavioral/login anomaly + XAI + MITRE + response recommendation in one coherent, evaluated pipeline** did not surface in this search — that specific combination is `genuinely uncommon, needs validation` (absence of evidence isn't proof of absence, but nothing matching it appeared across GitHub Topics for `cybersecurity-projects`, `security-dashboard`, `phishing`, `hackathon2026`).
3. Deepfake image/video detection trained "for real" needs labeled data (FaceForensics++/DFDC/Celeb-DF) and non-trivial GPU time even for lightweight backbones; convincingly faking it live in front of judges is a known failure mode ("is your deepfake detector actually trained, or just wired in?" — a question your own prompt anticipates). The **lower-risk substitute — sender/identity/stylometric/metadata-based impersonation detection — satisfies the PS09 rubric line for "impersonation/identity fraud" without requiring a trained vision model**, and is explicitly supported as the safer 6GB-VRAM choice by the speech-deepfake survey literature (`LIKELY`, Li et al. 2024, ACM Computing Surveys — "real-time [deepfake] detection is still an emerging challenge").

**What you actually ship:** three end-to-end demo scenarios (phishing URL/email, impersonation-by-metadata, login-anomaly/account-takeover), one fusion risk engine, one MITRE-tagged explanation schema, one Angular SOC dashboard, one FastAPI backend — all offline-capable, all measurable, all defensible under judge questioning. Deepfake audio/image becomes a **stretch demo** using an off-the-shelf pretrained ONNX detector run *as-is* (not trained by you), labeled honestly as "pretrained, not fine-tuned by us" on the slide.

**One-sentence differentiator:** *"Most hackathon phishing tools stop at 'malicious/not malicious' — CyberGuard fuses phishing, identity-impersonation, and login-behavior signals into one MITRE-mapped, evidence-cited risk score with a recommended response, the way a real SOC analyst reasons, not the way a spam filter does."*

---

## 1. PS09 Requirement Mapping

| PS09 requirement (verbatim from official doc) | CyberGuard component | MVP or Stretch |
|---|---|---|
| AI-Powered Phishing Detection (email/SMS/social/QR/website/URL) | PhishMind URL engine (existing) + lightweight email header/body heuristic layer | **MVP**: URL + email. SMS/social/QR = **Future** (same underlying engine, just different ingestion adapter — mention in roadmap, don't build) |
| Deepfake Detection (image/video/voice) | Off-the-shelf pretrained ONNX image/audio forensics check | **Stretch**, honestly labeled |
| Digital Impersonation Detection (identity, comms style, metadata, behavior) | Sender-authenticity + stylometric similarity + domain-lookalike module | **MVP** |
| Credential Theft & Account Takeover (impossible travel, spraying, new device/session anomalies) | RBA-style feature engine + Isolation Forest / rule hybrid | **MVP** |
| Technical threats (malware indicators, exfiltration, API abuse, insider activity) | Log-based rule engine (rate limits, anomalous endpoint access) — minimal, rule-only | **MVP** (thin slice only, satisfies "technical/behavioral threat" scenario requirement) |
| Classification, risk/severity score, explanation with evidence, recommended response — **per threat** | Fusion Risk Engine + Explanation Schema (Section 8–9) | **MVP**, applies uniformly across all modules |
| Sender-authenticity analysis | Impersonation module (SPF/DKIM-style heuristic + domain similarity) | **MVP** |
| Explainable AI | Structured evidence-bullet schema (not just SHAP dump) | **MVP** |
| MITRE ATT&CK mapping | Keyword/rule-based technique lookup table | **MVP** (deliberately low-effort — see Section 5.4) |
| Graph-based attack analysis | NetworkX in-memory graph, rendered as attack-chain view | **Stretch** |
| Threat intelligence feeds | VirusTotal + URLhaus + AbuseIPDB with local/mock fallback | **MVP** (fallback mandatory — offline demo requirement) |
| Privacy-preserving design | Data minimization, no real user PII, risk language not accusation language | **MVP** (policy, not a "feature" — cheap and expected) |
| 3 threat scenarios, Detection→Classification→Risk→Explanation→Alert→Response | Scenario 1: phishing URL/email · Scenario 2: impersonation · Scenario 3: login-anomaly/ATO | **MVP**, this is the graded minimum |
| Cybersecurity Command Dashboard (events, threats, category, risk, timeline, targeted users, actions, incident status) | Angular SOC dashboard — subset in Section 7.4 | **MVP** subset + **Stretch** extras |

**Reading of the rubric:** every "may" in the official doc (deepfake, graph analytics, federated learning, autonomous agents) is explicitly optional — PS09 says "the solution **may** additionally detect..." and "participants **may** use..." The only hard requirements are the three-scenario minimum and the six deliverable outputs (classification/risk/explanation/evidence/response) applied to whatever scenarios you pick. This directly supports the scope-discipline decision above. `CONFIRMED` from the PDF text itself.

---

## 2. Threat Landscape & Competitor Analysis

### 2.1 Why this matters in 2026 (context, not padding)
Real-world grounding for judges: FBI-documented case of AI-generated voice/text impersonating senior officials in 2025, and industry estimates that a majority of phishing emails now involve some AI-assisted generation. `LIKELY` (DeepStrike blog, July 2026 — trade-press source, treat the "80%+" figure as directional, not a hard statistic to cite as if peer-reviewed).

### 2.2 Competitor & prior-art findings (GitHub/Devfolio-style projects, 2023–2026)

| Pattern observed | Saturation | Evidence |
|---|---|---|
| Phishing URL/email detector alone (ML or rule-based) | **Saturated** | Dozens of repos under `phishing` GitHub topic |
| Phishing detector + MITRE ATT&CK mapping + threat-intel enrichment (VirusTotal/AbuseIPDB) | **Common** | `security-dashboard`, `cybersecurity-projects` topics show multiple examples combining exactly these three |
| SOC training/investigation lab (header analysis, IOC extraction, MITRE mapping) as an educational tool | **Common** | "SOC Level-1 phishing investigation lab" repo found directly |
| Scam-detection + honeypot + LLM-persona engagement + risk scoring dashboard | **Genuinely uncommon** (found one: Node/React/MongoDB/OpenRouter stack) | Interesting adjacent idea, not a direct competitor to your scope |
| Full fusion: phishing + impersonation + login/behavioral anomaly + XAI + MITRE + response-recommendation in **one evaluated pipeline** with real metrics | **Not found in this search — needs validation** | No repo matched this combination across 4 targeted GitHub Topic searches |
| Deepfake detection trained from scratch as a hackathon side-feature (not the core project) | **Common but usually shallow** — most repos import FaceForensics++/DFDC and report benchmark numbers without addressing live-demo latency or adversarial robustness | `awesome-deepfake-generation-and-detection` survey repo |

**Takeaway:** your differentiation is not any single module — it's the **fusion + explanation + response layer sitting on top of 3 well-executed narrow modules**. This is consistent with the "few, deeply-integrated, well-evaluated components" instruction in your own prompt.

### 2.3 Commercial SOC tool UX patterns (to calibrate mental model, not to copy)

`LIKELY` (patterns are well-established in commercial security-product marketing/docs; not independently re-fetched line-by-line this session, treat as directional):

- **Alert structure**: severity tier (not raw probability) + confidence separate from severity + a short natural-language "why" sentence + a list of contributing evidence + a recommended next action. This is the structure the PS09 example explanation ("High Risk: the sender domain closely resembles...") already mirrors — **the problem statement itself is telling you the target UX**.
- **Evidence-first, not score-first**: analysts scan evidence bullets before they trust a number. Your explanation schema (Section 9) should put evidence above the raw ML score, not below it.
- **Action verbs are constrained and specific**: "Block," "Quarantine," "Require MFA," "Revoke session," "Flag for review" — never vague text like "investigate further" as the *only* recommendation.
- **MITRE tags as metadata chips, not paragraphs**: technique ID + short name, clickable/expandable, not embedded in prose.

---

## 3. 20+ Feature Candidates + Scoring

Scored 1–10 on: **Nov**(elty) · **Feas**(ibility) · **Judge** value · **Depth**(technical) · **Demo** impact · **Cost**(hardware/time, 10=cheapest). Ranked by weighted composite matching the architecture-selection weights (Section 6).

| # | Feature | Problem solved | Approach | Data/model | Competitor saturation | Nov | Feas | Judge | Depth | Demo | Cost | **Rank** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Multi-signal fusion risk engine | Raw ML score ≠ actionable risk | Weighted fusion formula (Sec 8) | None — pure logic | Genuinely uncommon | 8 | 9 | 9 | 7 | 8 | 9 | **1** |
| 2 | Structured explanation schema (evidence→score→MITRE→action) | "Phishing detected" isn't useful | Template engine, no ML | None | Uncommon as *structured/reusable* | 7 | 9 | 9 | 6 | 9 | 10 | **2** |
| 3 | PhishMind URL engine (existing) | Malicious URL detection | BiLSTM+CNN+TF-IDF+heuristics→RF | Your 1.14M URL dataset | Common (RF/lexical), your specific fusion less so | 6 | 10 | 7 | 8 | 7 | 9 | **3** |
| 4 | MITRE ATT&CK keyword/rule mapping | Alerts lack standard taxonomy | Static lookup table, alert-description → technique ID | Small curated mapping table you build | Common as concept, cheap to add | 5 | 10 | 8 | 5 | 7 | 10 | **4** |
| 5 | Sender/domain lookalike detection (impersonation) | Detect spoofed sender identity | Levenshtein/visual-similarity on domain + display-name mismatch | Rule-based, no model needed | Common technique, uncommon as dedicated module w/ own risk tier | 6 | 9 | 8 | 5 | 8 | 10 | **5** |
| 6 | Login-anomaly / ATO detection | Credential-theft rubric line | Isolation Forest / z-score on RBA-style features | RBA dataset (Zenodo) | Common technique, less common *combined* with phishing+impersonation | 6 | 8 | 8 | 6 | 7 | 8 | **6** |
| 7 | Threat-intel enrichment (VT/URLhaus/AbuseIPDB) w/ offline fallback | Judges ask "what if API is down" | REST calls + local cached snapshot fallback | Free-tier APIs (Sec 5.4) | Common | 4 | 9 | 7 | 4 | 6 | 8 | **7** |
| 8 | Confidence vs. risk separation | Judges probe "why trust 98.5%?" | Two separate numbers on every alert | None | Uncommon in student projects | 7 | 10 | 8 | 6 | 6 | 10 | **8** |
| 9 | Adversarial test suite for PhishMind (homoglyph/punycode/redirect) | Stress-tests your existing claim | Scripted attack generator + eval harness | Your existing model | Rare — most projects don't show this | 8 | 8 | 9 | 8 | 6 | 8 | **9** |
| 10 | Attack-chain graph view (NetworkX) | Visualizes multi-step incidents | In-memory graph, simple force-layout render | networkx + d3/vis.js | Uncommon at this scope | 7 | 6 | 8 | 6 | 9 | 6 | **10** |
| 11 | Impersonation stylometric similarity (writing-style match to known contact) | "Analyze identity, communication style" rubric line | TF-IDF/embedding similarity between message and known-sender corpus | Small synthetic corpus you build | Uncommon | 7 | 6 | 7 | 6 | 6 | 7 | 11 |
| 12 | QR-code phishing detection | Explicit PS09 mention | Decode QR → feed URL into PhishMind | pyzbar/opencv, no new model | Rare in student projects | 6 | 8 | 6 | 3 | 7 | 9 | 12 |
| 13 | Deepfake image detection (pretrained ONNX, not trained) | Impersonation/deepfake rubric line | Off-the-shelf model, inference only | e.g. MiniFAS-style ONNX anti-spoof (600KB–1.8MB) | Common as wired-in demo, risky if judges probe training | 4 | 7 | 6 | 3 | 7 | 8 | 13 |
| 14 | Voice deepfake detection (pretrained) | Same rubric line, audio | Lightweight feature+XGBoost detector (~2MB, ~37ms) | Public voice-spoofing model | Rare in student hackathons, real risk of shallow wiring | 5 | 5 | 6 | 4 | 7 | 7 | 14 |
| 15 | Impossible-travel detection | ATO rubric line explicit | Geo-velocity check on login IP/time deltas | Rule, uses RBA data's geo fields | Common technique | 4 | 9 | 6 | 3 | 5 | 9 | 15 |
| 16 | Password-spraying detection | ATO rubric line explicit | Rate/pattern rule across accounts | Rule only | Common | 3 | 9 | 5 | 3 | 4 | 10 | 16 |
| 17 | API-abuse / rate-anomaly detection | "Technical threat" scenario requirement | Simple request-rate rule engine on mock API logs | Synthetic logs | Common, cheap, satisfies minimum scenario 3 | 3 | 9 | 5 | 3 | 5 | 10 | 17 |
| 18 | Human-in-the-loop approval gate before "destructive" actions | Privacy/ethics rubric line | UI confirmation step before block/revoke actions | None | Uncommon as an explicit, demoed feature | 6 | 9 | 7 | 3 | 6 | 10 | 18 |
| 19 | Automated incident-response playbook templates | "Innovation opportunities" explicit mention | Static JSON playbook keyed by threat type + severity | None | Common concept, easy to implement well | 4 | 9 | 6 | 3 | 6 | 9 | 19 |
| 20 | Risk analytics/trend dashboard (attack timeline, top targeted users) | Explicit dashboard rubric requirement | Aggregation queries + chart.js/recharts | Your own incident DB | Expected baseline, not differentiating alone | 2 | 9 | 6 | 2 | 6 | 9 | 20 |
| 21 | Federated learning for phishing model | "Innovation opportunities" mention | N/A at hackathon scale | — | Rare because it's usually infeasible to demo meaningfully | 5 | 1 | 3 | 2 | 1 | 1 | **cut** |
| 22 | Autonomous cyber-defense agent (LLM-driven auto-response) | "Innovation opportunities" mention | LLM agent taking actions without approval | — | Directly conflicts with your own privacy/ethics stance (human approval before destructive action) | 4 | 3 | 4 | 3 | 5 | 3 | **cut** |
| 23 | Custom transformer/LLM fine-tune for phishing (replacing PhishMind) | "Is RF still defensible?" preemption | Fine-tune DistilBERT-class model | Needs GPU time you don't have spare | Common in papers, infeasible to do *well* here | 3 | 3 | 5 | 5 | 3 | 2 | **cut** |

**Cut features 21–23 explicitly**: each fails the "would this materially increase our score" test — 21 and 22 are infeasible/unsafe to demo credibly at this scale, and 23 duplicates an existing validated asset with strictly worse feasibility.

---

## 4. Dataset Findings

| Domain | Dataset | Size / labels | Training-grade or demo-only | Status |
|---|---|---|---|---|
| Phishing URLs | Your existing 1.14M-URL corpus (PhishMind) | 1.14M, labeled | Training-grade (already trained) | `UNVERIFIED` (your own asset, not independently re-verified) |
| Phishing emails | Nazario Phishing Corpus | ~4,555–4,818 phishing emails, public since 2005 | Training-grade for email text classifier | `CONFIRMED` (multiple independent papers cite it identically) |
| Phishing emails | CEAS 2008, SpamAssassin, Enron-Spam | Enron ~11–33K benign; SpamAssassin ~6K; CEAS_08 challenge corpus | Training-grade, commonly merged with Nazario | `CONFIRMED` |
| Phishing emails | Cambridge Phishing Dataset (Cambridge Cybercrime Centre) | Continuously updated, 2,000+/month recent | Training-grade, most current | `CONFIRMED` |
| Login anomaly / ATO | **RBA Dataset — "Login Data Set for Risk-Based Authentication"** (Wiefling et al., Zenodo, DOI 10.5281/zenodo.6782155) | >33M login attempts, >3.3M users, includes explicit `Is Account Takeover` boolean label, device/browser/OS/RTT/geo fields | **Training-grade**, purpose-built for exactly your ATO use case | `CONFIRMED` — this is a strong, directly relevant find |
| Impersonation / stylometry | No single standard public dataset found for "impersonate known contact" scenario specifically | — | You will need to construct a small synthetic corpus (known-contact writing samples + crafted impersonation attempts) | `UNVERIFIED` — flagging honestly rather than inventing one |
| Voice deepfake | ASVspoof-family datasets (referenced indirectly via survey) | Standard academic benchmark | Training-grade, but training your own model is out of scope — use pretrained detector instead | `LIKELY` (survey-cited, not independently re-fetched) |
| Image deepfake | FaceForensics++, Celeb-DF, DFDC (referenced in multiple detection repos) | Standard academic benchmarks | Training-grade, but same reasoning — use pretrained ONNX detector | `LIKELY` |

**India-specific phishing/UPI-banking data:** no India-specific or UPI-style phishing dataset surfaced in this research. **Flagging this rather than inventing one**, per your instruction. If you want an India angle for judge appeal, the honest move is to *construct* a small set of realistic UPI/banking-style phishing URL and message examples yourselves (clearly labeled as synthetic/illustrative in the demo), not to claim a dataset that doesn't exist.

---

## 5. Model Comparison & Component Decisions

### 5.1 Is RF-on-fused-features still defensible for PhishMind in 2026?

**Yes, conditionally.** `LIKELY`, based on convergent findings across four independent 2024–2026 papers already in your prior research corpus:
- Lightweight lexical/fused-feature ensembles remain competitive with transformer approaches on clean benchmarks; the gap is narrow enough that RF-on-fused-features stays credible, especially given deployment simplicity (Jalil et al. 2022; Chaudhuri & B 2026; Kaur & Jain 2025).
- The real weakness is **adversarial robustness, not baseline accuracy**: both lexical and fine-tuned transformer models can collapse from >98% clean accuracy to roughly 64% under adversarial phishing (Ahmed & Pourmoafil 2026).

**What this means for you:** don't defend the 98.5% number as the achievement. Defend the **architecture choice** (fusion of lexical + heuristic + sequence features is a legitimate, literature-supported design), and **proactively show the adversarial degradation** rather than waiting for a judge to find it. Section 12 (adversarial test suite) turns this known weakness into a demonstrated strength ("we know where it breaks and we measured it").

**Does 98.5%/0.998 AUC "hide" something?** You cannot know without re-running the eval, so state this honestly to the team: `INFERRED` risk factors to check before the pitch —
1. **Train/test leakage via near-duplicate URLs** (same domain, different paths) — check if your split is domain-aware, not just row-random.
2. **Class imbalance masking** — 1.14M URLs: confirm the phishing:benign ratio and whether accuracy or AUC could look inflated by a majority class. AUC is more robust to this than raw accuracy, which is reassuring but not sufficient alone.
3. **Source contamination** — if benign URLs came from a different distribution/era than phishing URLs (common failure mode), the model may be learning "source fingerprint" rather than "phishing-ness."

You don't need to fix all of this in 3 weeks — you need to **run one leakage/imbalance sanity check and report the result honestly**, even if it's "we checked for domain overlap between train/test and found none" or "we found some contamination and it's a documented limitation." That single sentence is worth more to a judge than the 98.5% figure alone.

### 5.2 Adversarial obfuscation handling (homoglyphs, punycode, IDN, redirects, shorteners, subdomain manipulation)

`INFERRED` from model architecture, not independently tested here — **this is exactly why Section 12's adversarial suite is mandatory, not optional**:
- **Homoglyphs/IDN/punycode**: char-level TF-IDF n-grams *may* partially catch visual look-alikes if punycode is decoded before feature extraction — but if your pipeline extracts n-grams from the raw Unicode/punycode string without normalization, this is a **likely blind spot**. Test this explicitly.
- **URL shorteners**: if PhishMind scores the *shortened* URL rather than resolving it first, it is almost certainly blind to the true destination — shortener resolution should happen in a preprocessing step, not be left to the model.
- **Redirect chains**: same issue — if you only score the first URL, multi-hop redirect attacks bypass you structurally, not because the model is weak.
- **Subdomain manipulation** (e.g., `paypal.com.evil-domain.ru`): lexical features *may* catch this if trained on similar patterns; TF-IDF char n-grams are plausibly somewhat robust here, but confirm with a test case rather than assuming.

### 5.3 Impersonation/deepfake module — comparison

| Approach | VRAM/compute cost | Training required | Live-demo risk | PS09 rubric satisfaction |
|---|---|---|---|---|
| True deepfake detection (pretrained ONNX image forensics, e.g. MiniFAS-class anti-spoof model, ~0.6–1.8MB, CPU-only, `CONFIRMED` exists and runs on CPU) | Low if inference-only | **No** (use as-is) | Medium — judges may ask "did you train this?" Answer honestly: "no, we use a pretrained forensic classifier and are transparent about that" | Satisfies literal "deepfake" rubric line |
| Sender/metadata/stylometric impersonation | Near-zero | No (rule/similarity based) | **Low** — nothing to "catch you" on, fully explainable | Satisfies "impersonation/identity fraud" rubric line, which is broader than deepfake alone |

**Decision: build metadata/stylometric impersonation as MVP core; add pretrained ONNX deepfake image check as a labeled stretch demo only if time remains after MVP is stable.** This directly answers your own question — metadata approach is safer for a live demo, confirmed by the speech-deepfake survey's explicit statement that real-time detection remains an emerging challenge (`LIKELY`, Li et al. 2024).

### 5.4 Account takeover — rule engine vs. lightweight anomaly method

**Both, layered — not either/or.** `INFERRED`, standard SOC design pattern: rules catch known-bad patterns cheaply (password spraying = N failed logins across M accounts in T minutes; impossible travel = geo-distance/time-delta threshold). Isolation Forest or z-score on the RBA-style feature set (device, RTT, geo, timestamp) catches anomalies that don't match a pre-written rule — genuinely adds value at this scale because a pure rule engine will miss "this login is technically successful and passes every rule but doesn't look like this user's normal behavior." Isolation Forest is the safer choice over z-score alone because your ATO features are multivariate and not necessarily Gaussian; Isolation Forest requires no distributional assumption and trains in seconds on the RBA dataset subset. `INFERRED`, standard unsupervised-anomaly-detection reasoning — not a claim about a specific paper.

### 5.5 MITRE ATT&CK — lowest-effort integration that still looks meaningful

**Static/keyword lookup table, not embedding-based.** `LIKELY`, confirmed as an established real approach: automated CTI-to-ATT&CK mapping research uses TF-IDF, Word2Vec, BERT-TextCNN, or hybrid search+SciBERT/BiLSTM approaches (Zhang et al. 2026; Mohammed et al. 2026) — meaning **even the "lightweight" end of published research uses TF-IDF-level matching**, which validates that a curated keyword/rule table mapping your alert types to specific technique IDs (e.g., credential-request phishing → T1566.002, look-alike domain → T1583.001, password spraying → T1110.003) is not "cheating" — it's a legitimate simplification of a real technique, appropriately scoped for hackathon time. Don't over-engineer this with embeddings; you'd be spending model-training budget on the single lowest-payoff research direction PS09 mentions.

### 5.6 Threat intelligence feeds — free, rate-limit-friendly, offline-fallback-capable

| Feed | Free tier | Auth | Offline fallback needed? |
|---|---|---|---|
| VirusTotal API v3 | **4 requests/minute, 500/day** `CONFIRMED` | API key (free signup) | **Yes, mandatory** — 4/min will not survive a live demo burst; cache a local snapshot of known-bad/known-good indicators |
| AbuseIPDB | **1,000 checks+reports/day** `CONFIRMED` | API key (free signup) | Recommended but less urgent than VT |
| URLhaus (abuse.ch) | **No API key required** for basic lookups `CONFIRMED` | None | Lower priority — already resilient |
| ThreatFox / MalwareBazaar (abuse.ch) | Free, no documented hard rate-limit tier, community-funded `LIKELY` | Free Auth-Key | Lower priority |
| Google Safe Browsing | **10,000 queries/day** free tier `CONFIRMED` | API key | Good backup for URL reputation |
| MISP | Self-hosted, not a hosted free API — heavier to integrate | N/A | **Skip** — not worth the setup cost for a 3-week hackathon |

**Design implication, non-negotiable given the "must work fully offline" constraint:** every threat-intel call must be wrapped in a try/fallback that serves from a locally cached JSON snapshot (a few hundred known-bad domains/IPs/hashes you pre-populate) when the live API is unreachable, rate-limited, or the judges' venue WiFi is unreliable. This is not optional polish — it is required by your own ground rules and it is also the direct answer to judge question "what happens if your API is unavailable?" (Section 15).

## 6. Five Candidate Architectures — Scoring & Selection

Weights per your instruction: 30% feasibility, 20% judging impact, 20% technical depth, 15% differentiation, 10% demo quality, 5% scalability.

| Architecture | Components | Effort | Hardware | Major risk |
|---|---|---|---|---|
| **A — Minimal** | PhishMind URL/email + rule engine + basic dashboard | 1.5 wks | Trivial | Too shallow, low differentiation, likely to underwhelm judges who've "seen 50 phishing projects" |
| **B — Phishing + Explanation + MITRE** | A + structured explanation schema + keyword MITRE mapping | 2 wks | Trivial | Still single-threat-type; may not satisfy 3-scenario minimum well |
| **C — Phishing + Impersonation + Fusion (no ATO)** | B + sender/metadata impersonation + fusion risk engine | 2.5 wks | Low (CPU) | Missing explicit ATO scenario which PS09 names directly |
| **D — Full MVP (recommended)** | C + login-anomaly/ATO (RBA-based) + threat-intel w/ fallback + response-recommendation engine + attack-chain graph (NetworkX) | 3.5 wks | Low–Moderate (CPU, no GPU-dependent training) | Scope creep if not disciplined; requires the cut list in Section 13 to be enforced |
| **E — Full scope incl. deepfake** | D + trained-from-scratch deepfake image/audio detection + graph DB (Neo4j-scale) + federated learning | 6+ wks | Exceeds 6GB VRAM comfortably for training; GPU cloud dependence likely | Directly violates your own hardware/timeline constraints; highest risk of an embarrassing "is this actually trained?" moment |

| Architecture | Feasibility (30%) | Judging (20%) | Depth (20%) | Differentiation (15%) | Demo (10%) | Scalability (5%) | **Weighted score** |
|---|---|---|---|---|---|---|---|
| A | 9 | 4 | 3 | 2 | 5 | 5 | 5.30 |
| B | 8 | 6 | 5 | 4 | 6 | 5 | 6.15 |
| C | 7 | 7 | 6 | 7 | 7 | 6 | 6.85 |
| **D (selected)** | **7** | **9** | **8** | **9** | **8** | **7** | **7.90** |
| E | 2 | 8 | 8 | 9 | 6 | 4 | 5.85 |

**Architecture D wins.** It is the only option that satisfies PS09's explicit 3-scenario minimum with real, evaluated components (not just A/B's single-threat shallowness), while E's marginal differentiation gain over D is outweighed by a near-total collapse in feasibility given your explicit hardware ban on 13B+ local LLMs and cloud-GPU dependence. This selection is a direct, literal application of your own stated weighting — not a default.

---

## 7. Detailed Design — Architecture D

### 7.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INGESTION LAYER                              │
│  URL/Email input · Login-event stream (RBA-style) · Mock API/system  │
│  logs · (Stretch) Image/audio upload                                 │
└───────────────┬─────────────────┬──────────────────┬─────────────────┘
                │                 │                    │
        ┌───────▼──────┐  ┌──────▼───────┐  ┌─────────▼─────────┐
        │  PHISHING     │  │ IMPERSONATION │  │  ATO / BEHAVIORAL  │
        │  ENGINE       │  │  ENGINE       │  │  ENGINE            │
        │  (PhishMind:  │  │  (domain      │  │  (Isolation Forest │
        │  BiLSTM+CNN+  │  │  lookalike +  │  │  + rules: spraying,│
        │  TF-IDF+RF)   │  │  stylometry + │  │  impossible travel,│
        │               │  │  sender-auth) │  │  new-device)       │
        └───────┬──────┘  └──────┬───────┘  └─────────┬─────────┘
                │                 │                    │
                └────────┬────────┴──────────┬─────────┘
                         │                    │
                ┌────────▼────────┐  ┌────────▼─────────┐
                │ THREAT-INTEL     │  │  MITRE ATT&CK     │
                │ ENRICHMENT       │  │  MAPPER            │
                │ (VT/URLhaus/     │  │  (keyword/rule     │
                │  AbuseIPDB +     │  │  lookup table)      │
                │  local fallback) │  │                     │
                └────────┬────────┘  └────────┬───────────┘
                         └──────────┬──────────┘
                                    │
                        ┌───────────▼────────────┐
                        │   FUSION RISK ENGINE    │
                        │ (Section 8 formula)     │
                        │ risk tier + confidence  │
                        └───────────┬────────────┘
                                    │
                        ┌───────────▼────────────┐
                        │  EXPLANATION ENGINE     │
                        │ (Section 9 schema)      │
                        └───────────┬────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                    │
        ┌───────▼──────┐  ┌────────▼────────┐  ┌────────▼─────────┐
        │  RESPONSE     │  │  ATTACK-CHAIN   │  │  FastAPI          │
        │  RECOMMENDER  │  │  GRAPH          │  │  REST API         │
        │  (playbook    │  │  (NetworkX,     │  │  (persists to     │
        │  lookup)      │  │  stretch)       │  │  Postgres)        │
        └──────────────┘  └─────────────────┘  └────────┬─────────┘
                                                          │
                                                ┌─────────▼──────────┐
                                                │  Angular SOC        │
                                                │  Dashboard           │
                                                └─────────────────────┘
```

**Rejected alternative:** a microservices split (one container per engine, message-queue orchestration). Rejected because at your team size and timeline, the operational overhead (service discovery, queue setup, distributed debugging) would consume days better spent on the fusion/explanation layer that actually differentiates you. A monolithic FastAPI app with clean internal module boundaries gets you the same architectural story for judges ("here's our pipeline") without the infra tax. `INFERRED`, standard hackathon-scale engineering judgment.

### 7.2 Three (+1 optional) User Flows

**Flow 1 — Phishing URL/Email (MVP)**
1. Analyst pastes URL or uploads .eml → Ingestion normalizes (resolve shorteners, decode punycode, follow redirect chain up to N hops)
2. PhishMind scores → Threat-intel enrichment (VT/URLhaus check on domain/hash) → MITRE mapper tags technique (e.g., T1566.002)
3. Fusion engine combines ML score + heuristics + threat-intel signal → risk tier + confidence
4. Explanation engine renders evidence bullets
5. Dashboard shows alert card; analyst clicks "Recommended Response" → sees "Block URL / Quarantine email" → confirms → status updates to "Contained"

**Flow 2 — Impersonation (MVP)**
1. Message/sender profile submitted (mock inbox entry) → domain-lookalike check against known-org domain list → stylometric similarity vs. known-contact corpus → sender-authenticity heuristic (SPF/DKIM-style mismatch simulation)
2. Fusion engine combines these three signals
3. Explanation: "Sender display name matches 'IT Support' but domain differs from verified organizational domain by 1 character (Levenshtein distance); message tone requests urgent credential action, inconsistent with known communication style."
4. Response: "Warn user, do not click links, verify via alternate channel"

**Flow 3 — Account Takeover / Login Anomaly (MVP)**
1. Login event stream (RBA-derived features: device, geo, RTT, timestamp, success/fail) → rule engine flags spraying/impossible-travel patterns → Isolation Forest flags statistically anomalous logins that pass rules
2. Fusion engine combines rule-hits + anomaly score
3. Explanation: "Login succeeded from a new device and a location 4,800km from the user's last known location within 40 minutes — physically implausible travel time."
4. Response: "Require additional authentication, notify user, flag session for review"

**Flow 4 — Deepfake (Stretch, explicit call: does NOT belong in MVP)**
Reasoning: MVP must be rock-solid by Oct 5–10; deepfake adds a fourth technical surface with the highest live-demo failure risk (Section 5.3) for the lowest incremental score gain (Section 3, feature #13 ranks 13th). **Call: Stretch only, attempted after Flows 1–3 are fully working and evaluated, using a pretrained ONNX model with zero claim of custom training.**

### 7.3 Database Schema

```sql
users(id, name, email, department, is_vip, created_at)
devices(id, user_id, fingerprint, first_seen, last_seen, is_trusted)
domains(id, domain_name, is_verified_org_domain, risk_score, last_checked)
urls(id, raw_url, resolved_url, redirect_chain_json, phishmind_score, threat_intel_json, created_at)
emails(id, sender, subject, body_hash, spf_result, dkim_result, stylometry_score, created_at)
login_events(id, user_id, device_id, ip_address, geo_lat, geo_lon, rtt_ms, is_success, is_new_device, timestamp)
alerts(id, threat_type, source_entity_id, source_entity_type, risk_tier, confidence, ml_score, heuristic_score, threat_intel_score, created_at)
mitre_techniques(id, technique_id, name, tactic, description)
alert_mitre_map(alert_id, technique_id)
incidents(id, alert_ids_json, status, severity, assigned_to, opened_at, closed_at)
evidence(id, alert_id, evidence_text, evidence_type, source_signal)
responses(id, alert_id, recommended_action, action_status, approved_by, approved_at)
```

Relationships: `alerts.source_entity_id` polymorphically references `urls`/`emails`/`login_events` (store `source_entity_type` to disambiguate — simpler than three separate FK columns given your timeline). `incidents` aggregate one or more `alerts` (an attack chain). `alert_mitre_map` is many-to-many. **Rejected alternative**: fully normalized polymorphic association tables (separate junction tables per entity type) — rejected as unnecessary complexity for a 3-week build; the type-tag column is a well-known, acceptable simplification at this scale.

### 7.4 FastAPI Endpoint Design (representative, not exhaustive)

```
POST   /api/v1/analyze/url          → run PhishMind + enrichment + fusion, returns Alert
POST   /api/v1/analyze/email        → impersonation + phishing analysis, returns Alert
POST   /api/v1/analyze/login-event  → ATO engine, returns Alert
GET    /api/v1/alerts               → paginated, filterable by risk_tier/threat_type/date
GET    /api/v1/alerts/{id}          → full alert incl. evidence + MITRE tags + recommended response
POST   /api/v1/alerts/{id}/respond  → analyst confirms a recommended action (human-approval gate)
GET    /api/v1/incidents            → aggregated multi-alert incidents
GET    /api/v1/incidents/{id}/graph → attack-chain graph data (NetworkX → JSON nodes/edges) [stretch]
GET    /api/v1/dashboard/summary    → counts by category/severity/status for dashboard tiles
GET    /api/v1/mitre/techniques     → static technique reference list
```

### 7.5 Angular SOC Dashboard — MVP Screen Subset

| Screen | Included in MVP? | Content |
|---|---|---|
| **Overview/Home** | Yes | Total events, threats by category, risk-level breakdown, attack timeline chart |
| **URL Analyzer** | Yes | Input box, PhishMind score, evidence bullets, MITRE tag, recommended action |
| **Identity/Impersonation Analyzer** | Yes | Message input, sender-similarity result, evidence, action |
| **Incident Detail** | Yes | Single alert deep-dive: evidence list, MITRE chip, confidence vs. risk display, response button |
| **MITRE Map view** | Stretch | Visual tactic/technique grid highlighting hit techniques |
| **Risk Analytics** | Stretch | Trend charts, top-targeted users/services |
| **Attack-chain graph** | Stretch | NetworkX-rendered node/edge view of a multi-step incident |

**Attack-chain graph — is it worth building?** Yes, as a stretch, if MVP is stable by end of week 2 — it's high demo-impact (feature #10, rank 10) and NetworkX-level (in-memory, no Neo4j deployment) keeps it cheap. If MVP slips, cut without hesitation; it is explicitly not required by PS09's minimum deliverables list.

## 8. Risk-Scoring Fusion Formula

**Design principle:** raw ML probability is not a risk score. Risk = severity-if-true; confidence = how sure we are. Conflating them is the single most common mistake in student projects and the easiest thing for a judge to catch.

```
raw_ml_score        ∈ [0,1]   — from PhishMind / stylometry / IsolationForest anomaly score (normalized)
heuristic_score      ∈ [0,1]   — rule-hits normalized (e.g., 1 rule hit = 0.3, 2 = 0.6, 3+ = 1.0, capped)
threat_intel_score   ∈ [0,1]   — 0 if clean/unknown, 0.5 if listed on one feed, 1.0 if on 2+ feeds or known-malicious
identity_score       ∈ [0,1]   — domain-similarity + stylometric mismatch combined (only for impersonation flow)

WEIGHTS (tunable per threat type — this is a design decision to defend, not a fixed universal constant):
  Phishing URL/Email:   w_ml=0.5,  w_heur=0.2,  w_ti=0.3,  w_id=0.0
  Impersonation:        w_ml=0.2,  w_heur=0.2,  w_ti=0.1,  w_id=0.5
  ATO/Login-anomaly:    w_ml=0.6 (IsolationForest), w_heur=0.4 (rule hits), w_ti=0.0, w_id=0.0

fused_risk = (w_ml × raw_ml_score) + (w_heur × heuristic_score) + (w_ti × threat_intel_score) + (w_id × identity_score)

confidence = f(agreement across signals, data completeness)
  — e.g., confidence = 1 - stdev(normalized component scores)   [signals agreeing → high confidence]
  — capped lower if threat-intel was unavailable (offline fallback used) or if input data was incomplete

RISK TIER (from fused_risk):
  0.00–0.20 → Safe
  0.21–0.40 → Low
  0.41–0.65 → Medium
  0.66–0.85 → High
  0.86–1.00 → Critical
```

**Worked example (Flow 1, phishing URL):**
- `raw_ml_score = 0.94` (PhishMind flags as phishing, high confidence internally)
- `heuristic_score = 0.6` (2 heuristic rule hits: suspicious TLD + very new domain registration)
- `threat_intel_score = 0.5` (found on URLhaus, not yet on VirusTotal)
- `fused_risk = 0.5(0.94) + 0.2(0.6) + 0.3(0.5) = 0.47 + 0.12 + 0.15 = 0.74` → **High**
- `confidence`: all three signals point the same direction (low variance) → **confidence = 0.88 (High)**
- Output: **"High risk (confidence: High) — recommend Block URL + notify user."**

**Rejected alternative:** using the raw ML probability directly as the displayed "risk score." Rejected because it conflates model certainty with real-world severity — a 0.94 ML score on a low-value internal test URL and a 0.94 score on a URL actively harvesting banking credentials are not the same *risk* even if the model is equally confident in both, and pure-ML-score display gives judges no way to see that you understand this distinction.

---

## 9. Explainability Schema

Machine-readable, reusable JSON structure — rendered by the frontend into the natural-language PS09-style explanation.

```json
{
  "alert_id": "uuid",
  "threat_type": "phishing_url",
  "risk_tier": "High",
  "confidence": "High",
  "fused_risk_score": 0.74,
  "evidence": [
    { "signal": "ml_model", "text": "URL exhibits lexical and structural patterns consistent with credential-harvesting phishing pages (PhishMind score: 0.94)" },
    { "signal": "heuristic", "text": "Domain registered within the last 5 days" },
    { "signal": "heuristic", "text": "Uses uncommon TLD frequently associated with abuse" },
    { "signal": "threat_intel", "text": "URL matched an entry in URLhaus malware/phishing feed" }
  ],
  "mitre": [
    { "technique_id": "T1566.002", "name": "Spearphishing Link", "tactic": "Initial Access" }
  ],
  "recommended_action": {
    "primary": "Block URL",
    "secondary": ["Notify affected user", "Add domain to organizational blocklist"],
    "requires_human_approval": true
  },
  "data_completeness_note": "Threat-intel enrichment succeeded (live). No degraded signals."
}
```

**Design choice justified:** evidence is a list of short, source-tagged sentences (mirrors the PS09 example explanation format exactly — "the sender domain closely resembles... the message requests urgent credential verification... the embedded URL redirects..." is literally a 3-item evidence list in prose form). MITRE tags are structured metadata, not prose, so the frontend can render them as chips. `recommended_action.requires_human_approval` is always `true` for any action classified as destructive (block, quarantine, revoke session) — this field is your privacy/ethics stance made machine-enforceable, not just a slide claim.

---

## 10. Non-Functional Considerations

### 10.1 Security checklist for the product itself (you are a security tool — this gets tested)
- **SSRF**: URL-resolution/redirect-following logic must not be able to reach internal network ranges (block RFC1918 private IPs, `localhost`, cloud metadata endpoints `169.254.169.254`) before making outbound requests on a user-submitted URL.
- **Injection**: parameterized queries only (SQLAlchemy ORM, never raw string-formatted SQL) for Postgres; sanitize any log/email content rendered in the dashboard (stored XSS risk if you ever render raw email HTML).
- **Upload abuse**: if accepting .eml or image/audio uploads (even stretch), enforce file-size limits and MIME-type validation server-side, not just client-side.
- **Auth**: dashboard should require login even for a demo (basic JWT is enough) — an unauthenticated "security dashboard" is an easy, embarrassing judge callout.
- **Rate limiting your own API**: prevents your own threat-intel quota (4/min VT) from being exhausted by a single misbehaving frontend loop.

### 10.2 Privacy/ethics stance
- Language discipline: outputs say "risk," "suspicious," "confidence" — **never** "confirmed phishing" or "this person is an attacker." This is a direct, defensible answer to the false-positive judge question.
- Data minimization: no real employee/user PII in the demo — synthetic users, synthetic login events, synthetic message corpus.
- **Human approval before any destructive action** (block/quarantine/revoke) is enforced at the API level (`requires_human_approval: true` gate), not just described in a slide — this is the difference between a real design decision and a talking point.

### 10.3 Evaluation plan — concrete metrics per component

| Component | Metric | How measured |
|---|---|---|
| PhishMind (existing) | Accuracy, Precision, Recall, F1, AUC | Already have from prior training; re-report + add adversarial-set results (Section 12) |
| Impersonation module | Precision/Recall on your synthetic impersonation test set | Build ~50–100 labeled synthetic examples (known-good vs. crafted impersonation) |
| ATO / Isolation Forest | FPR at fixed detection threshold, detection latency (ms per event) | Evaluate on held-out RBA dataset slice with the `Is Account Takeover` label |
| Fusion engine | End-to-end alert latency (ingestion → risk tier displayed) | Timestamp instrumentation across pipeline stages |
| Explanation engine | Explanation coverage (% of alerts with ≥3 evidence items and a MITRE tag) | Simple assertion check across test alert set |
| Threat-intel fallback | Fallback trigger rate + fallback latency vs. live-call latency | Force-disable network, measure |

---

## 11. Adversarial Robustness Plan (PhishMind stress test)

| Attack | Expected behavior | Detection mechanism relied on | What you can actually measure/prove |
|---|---|---|---|
| Homoglyph domain (e.g., Cyrillic `а` replacing Latin `a`) | Should flag as suspicious | Punycode-decode preprocessing + lexical n-grams | Build 10–20 homoglyph test URLs, measure detection rate before/after adding punycode normalization step |
| Punycode-encoded IDN | Should decode and flag underlying look-alike | Preprocessing step (not the ML model itself) | Same as above — this is a **preprocessing gap you can demonstrably fix**, which is a strong judge-facing story ("we found this gap and fixed it") |
| Redirect chain (benign-looking URL → N hops → phishing page) | Should resolve final destination before scoring | Redirect-following in ingestion layer, capped at N hops (e.g., 5) to avoid infinite loops | Test with a constructed 2–3 hop redirect chain, measure whether score reflects final destination |
| URL shortener (bit.ly-style) | Should resolve before scoring | Same as above | Test with a real shortened URL pointing to a known-test phishing pattern |
| Subdomain manipulation (`paypal.security-check.ru`) | Should flag via lexical features even without exact domain match | TF-IDF char n-grams | Build test set of 10–20 subdomain-manipulation examples, measure recall |
| Token padding / long benign-looking query strings | May evade if model over-weights domain length | Lexical + heuristic combination | Measure whether padding alone flips classification on known-malicious base URLs |
| Adversarial phishing (literature-reported ~98%→~64% collapse pattern) | Expect measurable degradation — **do not claim immunity** | N/A — this is the honest baseline to report | Run PhishMind against a small adversarially-perturbed test set (character substitution attacks) and **report the actual accuracy drop**, framed as "known limitation, actively characterized" |

**This section is your single strongest judge-defense asset.** A team that says "our model is 98.5% accurate" is one of fifty. A team that says "our model is 98.5% on clean data, drops to approximately X% under homoglyph/redirect obfuscation, and here's the specific preprocessing fix that recovers Y percentage points" is memorable and technically credible. Budget real time for this in Week 2 (Section 14).

## 12. MVP / Stretch / Future Split

### MVP (must work by Oct 5–10)
- PhishMind URL engine integrated into API (existing asset, wire it in)
- Email header/body heuristic layer (basic — sender mismatch, urgency-keyword detection)
- Impersonation module: domain-lookalike + stylometric similarity + sender-authenticity heuristic
- ATO module: rule engine (spraying, impossible-travel, new-device) + Isolation Forest on RBA-derived features
- Fusion risk engine (Section 8) applied uniformly across all three flows
- Structured explanation schema (Section 9) rendered in UI
- MITRE keyword/rule lookup table (10–15 curated technique mappings, not exhaustive)
- Threat-intel enrichment (VirusTotal + URLhaus) **with mandatory local-cache fallback**
- Response-recommendation playbook (static JSON, keyed by threat_type × risk_tier)
- Human-approval gate on destructive actions
- FastAPI backend with the endpoints in Section 7.4 (core subset)
- Angular dashboard: Overview, URL Analyzer, Identity Analyzer, Incident Detail
- Adversarial test suite for PhishMind (homoglyph/punycode/redirect/shortener — Section 12) run and reported
- One leakage/imbalance sanity check on the 1.14M-URL dataset, reported honestly

### Stretch (only if MVP is stable — attempt in this order)
1. Attack-chain graph view (NetworkX)
2. MITRE Map dashboard screen
3. Risk analytics/trend screen
4. Deepfake image detection (pretrained ONNX, explicitly labeled "not trained by us")
5. QR-code phishing decode → feed into PhishMind

### Future (roadmap only — do not attempt to build)
- SMS/social-media phishing ingestion adapters
- Voice deepfake detection
- Graph database (Neo4j-scale) attack analysis
- Federated learning across organizational deployments
- Autonomous agent-driven auto-response (conflicts with your human-approval principle unless heavily redesigned)
- Full threat-intel platform integration (MISP)
- India-specific UPI/banking phishing dataset construction and validation (flagged as a real gap, not something to fabricate now)

---

## 13. Reverse Timeline from Oct 5–10

Assume eval window starts **Oct 5**; treat **Oct 3** as your internal "feature-freeze" date (2 buffer days for integration/rehearsal before the window even opens). Today is Sep 10 — you have ~3.5 weeks.

### Week 1 (Sep 10–16): Foundations, in parallel across workstreams
| Day | ML workstream | Backend | Frontend | Threat-intel/Docs |
|---|---|---|---|---|
| Sep 10 (today) | Re-run PhishMind eval; check leakage/imbalance | Scaffold FastAPI project, DB schema migration | Scaffold Angular project, routing skeleton | Sign up for VT/AbuseIPDB free keys |
| Sep 11 | Start adversarial test-set construction (homoglyph/punycode examples) | Implement `/analyze/url` endpoint (calls PhishMind) | Build URL Analyzer screen (static mock data first) | Download RBA dataset (Zenodo), inspect schema |
| Sep 12 | Punycode/redirect preprocessing layer for PhishMind ingestion | Implement threat-intel client + local-cache fallback logic | Build Overview screen shell | Curate MITRE technique lookup table (10–15 entries) |
| Sep 13 | Build domain-lookalike + stylometric similarity module (impersonation) | Implement fusion risk engine (Section 8 formula) | Wire URL Analyzer to real `/analyze/url` endpoint | Draft THREAT_MODEL.md outline |
| Sep 14 | Continue impersonation module; build small synthetic test corpus | Implement explanation-schema generator | Build Identity Analyzer screen | Draft DATASET_SPEC.md |
| Sep 15 | Train/validate Isolation Forest on RBA subset | Implement `/analyze/login-event` endpoint | Continue Identity Analyzer wiring | Buffer/catch-up day |
| Sep 16 | **Checkpoint**: all 3 core ML/detection modules producing raw scores | **Checkpoint**: fusion + explanation engine functional end-to-end for Flow 1 | **Checkpoint**: URL Analyzer fully functional | Review week 1, adjust week 2 plan |

### Week 2 (Sep 17–23): Integration, rule engines, MITRE, response layer
| Day | ML workstream | Backend | Frontend | Threat-intel/Docs |
|---|---|---|---|---|
| Sep 17 | Build ATO rule engine (spraying, impossible-travel, new-device) | Wire rule engine + Isolation Forest into fusion for Flow 3 | Build Incident Detail screen | Draft API_SPEC.md |
| Sep 18 | Adversarial suite: run tests, measure degradation, document fixes | Implement MITRE mapping layer + `/mitre/techniques` endpoint | Wire Incident Detail to real alert data | Draft ML_SPEC.md |
| Sep 19 | Sanity-check email heuristic layer | Implement response-recommendation playbook + human-approval gate | Build dashboard summary tiles | Draft DB_SCHEMA.md |
| Sep 20 | **Checkpoint**: all 3 flows produce full Detection→Response chain | Implement `/dashboard/summary` endpoint | Wire Overview screen to summary endpoint | Draft EVAL_PLAN.md |
| Sep 21 | Buffer — fix whatever broke in integration | Buffer — same | Buffer — same | Start PPT skeleton |
| Sep 22 | Begin stretch: attack-chain graph (NetworkX) if on schedule | Begin stretch endpoints if on schedule | Begin stretch screens if on schedule | Draft DEMO_SCRIPT.md |
| Sep 23 | **Checkpoint**: MVP feature-complete | Same | Same | Draft judge Q&A prep (Section 15) |

### Weeks 3–4 (Sep 24–Oct 3): Hardening, security checklist, rehearsal, docs finalization
- Sep 24–27: Security checklist pass (SSRF/injection/auth), run full evaluation metrics (Section 10.3), finalize all follow-on docs.
- Sep 28–30: Stretch features only if MVP is fully stable; otherwise more rehearsal and polish.
- Oct 1–3: Full dry-run demo × 3, fix any live-demo breakage, freeze scope.
- Oct 4: Rest/final check day.
- Oct 5–10: Evaluation window.

---

## 14. Team Parallelization Summary

Five workstreams run concurrently from Day 1, with explicit checkpoints (Sep 16, Sep 20, Sep 23) forcing integration rather than letting each stream drift independently:
- **ML**: PhishMind integration/testing → impersonation module → Isolation Forest → adversarial suite
- **Threat-intel**: API key setup → local fallback cache → MITRE table curation
- **Backend**: DB schema → per-flow endpoints → fusion engine → explanation engine → response engine
- **Frontend**: screen scaffolds → wire to real endpoints in the same order flows are completed
- **Docs**: written in parallel from Day 1, not after — each doc has a natural owner (whoever built that component writes its spec) so nothing is reconstructed from memory under deadline pressure

**Dependency note:** Frontend cannot meaningfully wire a screen until its corresponding backend endpoint exists — this is why the week-1/week-2 tables above interleave backend-then-frontend for each flow rather than parallelizing them fully independently.

## 15. Judge-Readiness — 50+ Hard Questions

### ML / Model Choice
1. **"98.5% accuracy — why trust it?"** → We don't lead with the number. We report AUC (0.998) alongside accuracy because AUC is more imbalance-robust, we checked train/test splits for domain-level leakage [state result honestly], and Section 12's adversarial suite shows where accuracy actually degrades — that degradation, not the headline number, is what we consider the honest measure of model quality. Evidence: leakage-check result + adversarial-suite output table.
2. **"Why Random Forest instead of a transformer or LLM?"** → Literature shows fused lexical/heuristic ensembles remain competitive with transformer approaches on clean data, with a narrow enough gap that deployment simplicity and CPU-only inference (mandatory given our 6GB VRAM constraint) make RF the defensible choice; the real differentiator between approaches is adversarial robustness, not baseline accuracy, and both approaches degrade there. Evidence: cite Jalil et al. 2022, Chaudhuri & B 2026, Kaur & Jain 2025 pattern.
3. **"How does this handle zero-day/homoglyph attacks?"** → Punycode-decoding is a preprocessing step, not something the model magically knows; we tested this explicitly (Section 12) and can show before/after detection rates.
4. **"Is your deepfake detector actually trained, or just wired in?"** → Honest answer: it's a pretrained, off-the-shelf forensic classifier used for inference only — we deliberately did not claim to have trained it, because training a deepfake detector credibly needs labeled data and compute beyond a 3-week/6GB-VRAM hackathon scope. We instead invested that budget in the fusion/explanation layer.
5. **"What's actually novel here?"** → Not any single detector — the fusion of phishing + impersonation + behavioral-anomaly signals into one explainable, MITRE-tagged, confidence-separated risk score with an enforced human-approval gate before any destructive response.
6. **"What happens if your API is unavailable?"** → Every threat-intel call has a local-cache fallback (Section 5.6); we can demonstrate this live by disconnecting network access.
7. Could your 1.14M-URL dataset have duplicate contamination between train/test? → [state your actual check result]
8. Why Isolation Forest for ATO instead of a supervised classifier? → RBA dataset does have a label, but a supervised model risks overfitting to this specific service's attack patterns; Isolation Forest generalizes better to *unseen* anomaly types, which matches the "zero-day-ish" nature of ATO.
9. What's your model's false positive rate at the "High" risk tier specifically? → [report from your eval, don't estimate live]
10. How do you handle concept drift (phishing patterns change over time)? → Acknowledge as a known limitation; propose periodic retraining as Future-roadmap item, not built now.
11. Why char n-gram TF-IDF and not word-level or subword tokenization? → Char-level is more robust to novel/obfuscated tokens (misspellings, homoglyphs partially), which matches the adversarial threat model better than word-level would.
12. What's your AUC on the adversarial test set specifically (not just clean)? → Report from Section 12 results.

### Cybersecurity Domain
13. How do you map an alert to a specific MITRE tactic vs. technique? → Curated lookup table keyed by threat_type + evidence pattern, e.g., credential-request phishing → T1566.002 (Initial Access).
14. Why not use embeddings for MITRE mapping? → Literature shows even lightweight published approaches use TF-IDF-level matching; embeddings would be over-engineering relative to payoff at this scale (Section 5.5).
15. How do you decide risk tier thresholds (0.20/0.40/0.65/0.85)? → Currently fixed thresholds chosen for interpretability; acknowledge these should ideally be calibrated against a labeled validation set and cite this as a refinement, not pretend they're derived from a rigorous calibration study if they aren't.
16. What's the difference between your "confidence" and "risk" fields? → Risk = severity if the alert is real; confidence = how sure the fusion engine is, based on signal agreement and data completeness (Section 8).
17. How would you detect a coordinated multi-account attack (not just single-account anomalies)? → This is exactly what the attack-chain graph (stretch) is for — grouping alerts into incidents.
18. What's your incident vs. alert distinction? → An alert is a single detection event; an incident aggregates related alerts (schema in Section 7.3).
19. How do impossible-travel checks handle VPN users (legitimate but geographically odd logins)? → Acknowledge as a real false-positive source; mitigation is flagging as Medium not Critical when the only signal is geo-distance, requiring corroborating signals to escalate.
20. What's your password-spraying detection threshold and why? → State your actual chosen N-failed-logins/M-accounts/T-minutes values and the reasoning (based on RBA dataset attack-pattern inspection, not arbitrary).

### Dataset
21. Is the RBA dataset representative of your target deployment context (it's from a Norwegian SSO service)? → Acknowledge honestly — it's the best available labeled ATO dataset; cross-context generalization is a real limitation we're transparent about.
22. Why not use a India-specific phishing dataset? → We looked; none surfaced in our research. We're flagging that gap rather than fabricating one (Section 4).
23. How large is your impersonation test set and how was it built? → State the actual size/construction method (synthetic corpus, Section 10.3).
24. Did you check for class imbalance in the 1.14M-URL dataset? → [report actual ratio and whether you addressed it]
25. What's your train/validation/test split methodology? → [describe actual methodology honestly]

### Architecture
26. Why a monolith instead of microservices? → Operational overhead not justified at this team size/timeline (Section 7.1); internal module boundaries still exist.
27. Why Postgres and not MongoDB for alerts/incidents? → Structured relational data (alerts, incidents, MITRE mappings) benefits from schema enforcement and join queries for the dashboard; if you also use MongoDB for something (e.g., raw email/log blobs), state that explicitly as a polyglot-persistence choice, don't force one DB where it doesn't fit.
28. How would this scale to real enterprise traffic volumes? → Honest answer: current design is hackathon-scale; production would need async task queues (Celery/RQ) for enrichment calls, horizontal API scaling, and a real message bus — explicitly a Future item.
29. What's your API's rate-limiting story for threat-intel calls? → Local caching + backoff (Section 5.6), essential given VT's 4/min limit.
30. Why NetworkX instead of Neo4j for the attack graph? → Neo4j deployment overhead isn't justified for a stretch feature at this scale; NetworkX in-memory is sufficient to demonstrate the concept.

### Adversarial Robustness
31. Show me a homoglyph attack live. → [have this test case ready and rehearsed]
32. What's your redirect-chain hop limit and why? → State chosen N and the infinite-loop/timeout reasoning.
33. How does PhishMind handle a brand-new (zero registration history) benign domain — false positive risk? → Acknowledge heuristic features (domain age) can misfire on legitimately new sites; mitigate via confidence scoring, not overclaiming precision.
34. Could an attacker adversarially craft a URL specifically to evade your fusion engine (not just PhishMind alone)? → Honest answer: yes, in principle — an attacker aware of your exact rule set could try to minimize heuristic-score triggers while staying under threat-intel radar; this is why confidence scoring and human review remain in the loop rather than fully automated blocking.

### Deepfake / Impersonation
35. What's your deepfake detector's actual accuracy on a benchmark? → State the pretrained model's *published* benchmark number, explicitly distinguishing it from your own evaluation (which you likely didn't independently re-run at scale).
36. Why didn't you build a full deepfake pipeline? → 6GB VRAM and 3-week timeline make training-from-scratch or even fine-tuning infeasible to do credibly; explained fully in Section 5.3.
37. How does stylometric similarity actually work — what features? → Word-choice/sentence-length/TF-IDF-style similarity vs. a known-contact writing corpus; be ready to show the actual feature list you implemented.
38. What if an impersonator copies a real person's writing style closely? → Acknowledge as a real limitation — stylometry catches obvious mismatches, not sophisticated mimicry; this is exactly why it's fused with domain/sender signals, not used alone.

### Privacy / False Positives / Ethics
39. What if your system is wrong and blocks a legitimate email? → Human-approval gate before any destructive action (Section 10.2) — nothing is auto-blocked without analyst confirmation in this design.
40. How do you avoid discriminatory false positives (e.g., flagging non-native-English writing as "suspicious tone")? → Acknowledge as a real risk with heuristic urgency-language detection; mitigate by weighting it low relative to structural signals (domain, threat-intel) rather than as a standalone trigger.
41. What data do you actually store about users, and for how long? → State your actual retention design (synthetic data in demo; real deployment would need a data-retention policy — Future item).
42. Could this tool itself be used to profile/surveil employees? → Acknowledge the dual-use tension honestly; mitigation is restricting to security-relevant signals only (login/email metadata, not general activity monitoring) and requiring role-based access to the dashboard.

### Scalability / Deployment
43. How would you deploy this in a real organization? → Containerize (Docker), add async task queue for enrichment, integrate with real email gateway/IdP via webhook — Future roadmap, not built now.
44. What's your end-to-end alert latency right now? → [report actual measured number from Section 10.3]
45. How would you handle 10,000 logins/minute instead of a demo trickle? → Isolation Forest inference is fast, but the current synchronous FastAPI + threat-intel-call chain would need to move enrichment to a background queue — acknowledge honestly as unaddressed at hackathon scale.

### Novelty / Positioning
46. What would a real SOC team actually want that you don't have? → SIEM/EDR integration, real log ingestion at scale, tunable/ML-calibrated thresholds instead of fixed ones — honest, specific Future items.
47. How is this different from just using Microsoft Defender/Abnormal Security? → We're not competing with commercial SOC tools' scale — we're demonstrating the *reasoning pattern* (fusion, explanation, MITRE-mapping, human-gated response) those tools use, built transparently and explainably at hackathon scale.
48. If you had another month, what's the single highest-value thing you'd build next? → Calibrated risk thresholds against a real labeled validation set, replacing the current fixed cutoffs — this is the most honest "if we had more time" answer because it directly addresses a stated current limitation.
49. What's the weakest part of your system and why? → Answer honestly and specifically — likely candidates: fixed (uncalibrated) risk thresholds, synthetic impersonation test data, deepfake module being pretrained-only. Pick the true answer, not a deflection.
50. Why should we remember this project among 50 phishing/cyber projects? → See Section 17 closing statement.
51. What's your plan if PhishMind's actual performance on your adversarial set is worse than you hoped? → Report it as-is; a demonstrated, honestly-characterized weakness with a proposed fix (e.g., punycode normalization) is stronger than a hidden one.
52. Did any human review label your synthetic impersonation test data, or is it self-labeled? → State your actual process; if self-labeled by the team, acknowledge that as a limitation on that specific metric's independence.

---

## 16. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scope creep toward full multimodal fusion (Architecture E) | Medium | High — could sink the whole MVP | Enforce the MVP/Stretch/Future cut list (Section 13) at every checkpoint; explicit "no new modules after Sep 23" rule |
| PhishMind's real adversarial performance is embarrassingly bad | Medium | Medium — but reframed as a strength if reported honestly (Section 12) | Run the adversarial suite in Week 2, not the night before demo, so there's time to add the punycode/redirect fixes if needed |
| Live-demo threat-intel API failure (rate limit hit, venue WiFi) | High | Medium | Local-cache fallback is MVP, not stretch (Section 5.6); rehearse the demo with network deliberately disabled at least once |
| Dataset leakage/imbalance discovered late, undermining the 98.5% claim | Medium | Medium | Run the sanity check in Week 1, not Week 4, so there's time to reframe the narrative if needed |
| Deepfake stretch feature consumes time better spent hardening MVP | Medium | High if not disciplined | Explicit "MVP must be stable before touching deepfake" gate; someone besides the ML lead owns saying no |
| Isolation Forest on RBA dataset doesn't generalize well to synthetic demo login events | Medium | Medium | Build demo login events to plausibly resemble RBA feature distributions, not arbitrary made-up numbers |
| Judge asks a question your honest answer makes you look unprepared for | Low (if Section 15 is actually rehearsed) | Medium | Rehearse the honest answers, not deflections — a well-delivered honest limitation reads as more credible than a dodge |
| Team member unavailability mid-sprint | Medium | Medium | Daily checkpoints (Section 13/14) surface blockers early; no single-person-owns-critical-path bottleneck if avoidable |
| Angular/FastAPI integration friction eats more time than budgeted | Medium | Medium | Build backend endpoints with a mock-data contract first so frontend can start wiring before every backend feature is 100% done |

---

## 17. Final Locked Blueprint

**Architecture:** D (Full MVP — Section 6) — phishing (PhishMind) + impersonation-by-metadata + login-behavior ATO + fusion risk engine + MITRE keyword mapping + threat-intel with mandatory offline fallback + response-recommendation + human-approval gate + Angular SOC dashboard (4 MVP screens) + FastAPI/Postgres backend, deepfake demoted to honestly-labeled stretch.

**What would make a judge who's seen 50 phishing projects remember this one:**
- **One sentence:** *"We didn't build a phishing detector — we built the reasoning layer a SOC analyst uses, and we can show you exactly where it breaks."*
- **One technical differentiator:** the confidence-vs-risk separation combined with a demonstrated, honestly-reported adversarial degradation curve for the core ML model — most teams show a static accuracy number; you show where and why it fails, and what you fixed.
- **One demo moment:** live-disconnect the network mid-demo and show the threat-intel fallback kick in without the pipeline breaking, immediately followed by feeding a homoglyph-obfuscated URL and showing the before/after detection improvement from your punycode-normalization fix.

**Concrete final recommendation:** build exactly the MVP list in Section 13, attempt stretch items strictly in the stated order only after Sep 23's checkpoint confirms MVP stability, and do not touch deepfake image/audio detection until every MVP flow has been rehearsed end-to-end at least twice.

---

## 18. Follow-On Documents to Draft Next

| Doc | Must contain |
|---|---|
| **PRD** | Problem statement restated in your own words, target user (SOC analyst persona), the 3 MVP scenarios as user stories, explicit MVP/Stretch/Future scope from Section 13 |
| **ARCHITECTURE.md** | The diagram from Section 7.1, component responsibilities, rejected alternatives with reasons (monolith vs. microservices, NetworkX vs. Neo4j) |
| **ML_SPEC.md** | PhishMind's actual architecture/training details, Isolation Forest hyperparameters, stylometric similarity feature list, honest leakage/imbalance check results |
| **DATASET_SPEC.md** | Every dataset from Section 4 with exact source, license, size, and training-grade/demo-only status; explicit note on the missing India-specific dataset |
| **THREAT_MODEL.md** | The PS09 requirement mapping (Section 1), the adversarial test suite (Section 12) as a living document updated with real results |
| **API_SPEC.md** | Full endpoint list (expand Section 7.4) with request/response schemas matching Section 9's explanation JSON |
| **DB_SCHEMA.md** | Full DDL from Section 7.3 with rationale for the polymorphic type-tag simplification |
| **UI_UX_SPEC.md** | Screen-by-screen wireframe descriptions for the 4 MVP + 3 stretch screens (Section 7.5), explanation-schema-to-UI mapping |
| **EVAL_PLAN.md** | Full metric table from Section 10.3 with actual measured results once available |
| **DEMO_SCRIPT.md** | Exact walkthrough sequence for the 3 required scenarios + the network-disconnect and homoglyph-fix demo moments from Section 17 |
| **ROADMAP.md** | The Future-only list from Section 13, framed as "AI Cyber Defence & Digital Trust Platform" evolution per PS09's desired-impact language |
| **RISKS.md** | The risk register from Section 16, updated live as the build progresses |

---

*End of blueprint. No code has been written. This document is the strategic and technical reference for the build phase — treat Sections 13 (timeline), 15 (judge Q&A), and 16 (risk register) as living documents to update as you build, not static artifacts.*
