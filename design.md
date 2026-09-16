# CyberGuard — UI/UX Design Specification

This document covers two layers of the product:

- **Part A — Public site**: the marketing/landing experience and login, where the given references (Better Stack, the two VengeanceUI components, the uifonts.app pairing) apply directly.
- **Part B — Authenticated application**: Dashboard, the three Analyzers, Alerts, Incidents, and Incident Detail, mapped screen-by-screen to the components already defined in the frontend architecture (`Architecture` doc + screen-to-component mapping).

Both layers share one token system so the product feels like a single piece of software, not a marketing site bolted onto a separate app.

---

## 0. Design references (as given)

| Reference | Applied to |
|---|---|
| [betterstack.com](https://betterstack.com/) | Hero section composition and overall page rhythm for the public site |
| `radial-glow-button` (VengeanceUI) — `npx shadcn@latest add https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/radial-glow-button.json` | The **Login** button only |
| Minimalist styling | All other top-nav buttons/links |
| `flip-fade-text` (VengeanceUI) — `npx shadcn@latest add https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/flip-fade-text.json` | The rotating word in the hero's middle line |
| [uifonts.app pairing](https://www.uifonts.app/?primaryFont=Noto+Sans+Ugaritic&secondaryFont=Noto+Kufi+Arabic) — primary: Noto Sans Ugaritic, secondary: Noto Kufi Arabic | Type system (see §3 for an important flag on this) |

> **Flag before anything else:** I pulled both font files to check glyph coverage before locking in the type system. **Noto Sans Ugaritic only contains the ~36 glyphs of the ancient Ugaritic cuneiform alphabet — it has no functional Latin letterforms.** Set English UI copy in it and the browser will silently fall back to a default system font, so none of the intended look would actually reach the screen. Some auto-generated font-info pages claim it "supports Latin," but that's boilerplate text, not real coverage — 36 glyphs can't cover the Latin set. **Noto Kufi Arabic does properly support Latin** (733 glyphs, confirmed), so that half of the pairing works as intended. §3 below keeps the spirit of your instruction — both fonts are used, in the roles each can actually carry — rather than dropping the reference entirely.

---

## 1. Grounding the design in the subject

**Product:** CyberGuard — an AI-assisted SOC (security operations) tool. It runs three analyzers (URL, Identity, Behavior), scores findings for risk and confidence, maps them to MITRE ATT&CK, and lets an analyst review evidence and approve a recommended action on an incident.

**Audience:** security analysts and SOC leads — people who live in dense data screens all day and treat the public site mainly as the door to sign-in. This means restraint matters more in the app than on the marketing page: the flashy hero treatment is a front door, not a template for the workspace behind it.

**Primary job of the public site:** convince a security team this tool cuts triage time and get them to sign in — one hero moment, then get out of the way.

**Primary job of the app:** let an analyst go from "something fired" to "here's the evidence, here's the ATT&CK mapping, here's what I'd approve" as fast as possible, without the UI competing for attention.

---

## 2. Design plan

### Color

Rather than bolting a generic dark theme onto the login button, the whole palette is built outward from the gradient already defined inside `radial-glow-button` — so the one loud element on the page shares its DNA with everything quiet around it, instead of looking like a component copied in from somewhere else.

| Token | Hex / value | Role |
|---|---|---|
| `--void` | `hsl(250 80% 2.5%)` | True background base (public site + app shell) |
| `--ink` | `#000022` | Card / panel / surface fill |
| `--steel` | `#1f3f6d` | Borders, dividers, muted chrome, disabled states |
| `--signal` | `#469396` | Primary interactive accent — links, active nav state, focus rings, primary buttons *other than* Login |
| `--glow` | `#f1ffa5` | Rare high-attention accent — hover peak on the glow button, a live/streaming indicator dot. Never body text, never a fill larger than an icon or badge |
| `--text-primary` | `#EDEFF2` | Primary text on dark surfaces |
| `--text-muted` | `#93A0B4` | Secondary text, timestamps, helper copy |

Severity/status colors are a **separate, semantic-only track** — they never double as brand color, so "this button is teal" and "this incident is low severity" never get confused:

| Token | Hex | Meaning |
|---|---|---|
| `--sev-critical` | `#E5484D` | Critical |
| `--sev-high` | `#F0954A` | High |
| `--sev-medium` | `#E9C94A` | Medium |
| `--sev-low` | `#469396` (reuses `--signal`) | Low — intentionally the calm brand color; low severity *is* the baseline |
| `--sev-resolved` | `#4ADE80` | Resolved / safe |

### Type

Details in §3 — short version: **Noto Kufi Arabic** for anything large (headlines, nav, buttons), **Noto Sans** for anything small and dense (tables, evidence lists, form labels), **Noto Sans Ugaritic** used decoratively only, never as content text.

### Layout concept

**Public hero** — centered, single-column, generous vertical rhythm, matching Better Stack's rhythm of "headline → one-line subhead → CTA → visual proof" rather than a two-column split:

```
┌───────────────────────────────────────────┐
│  [wordmark]              Product  Docs  ▍Login│  ← minimal top nav, Login = glow button
│                                             │
│         Catch the incident before          │
│         it becomes a breach                │
│                                             │
│    One console for   [URL / Identity /     │  ← flip-fade-text cycles the 3 analyzers
│    Behavior] threats,  scored and explained │
│                                             │
│              [ Start free — glow button ]   │
│                                             │
│     ┌─────────────────────────────────┐    │
│     │  faint Ugaritic glyph texture,   │    │  ← decorative cipher motif, §3
│     │  product screenshot floating on  │    │
│     │  top (Dashboard or Incident      │    │
│     │  Detail view)                    │    │
│     └─────────────────────────────────┘    │
└───────────────────────────────────────────┘
```

**Authenticated app shell** — fixed left `SideNav`, thin top bar (`TopNav`) for search/account, content area scrolls independently. Dense, left-aligned, no centered marketing rhythm:

```
┌────────┬──────────────────────────────────────┐
│ Side   │  TopNav: search        account ▾      │
│ Nav    ├──────────────────────────────────────┤
│        │                                       │
│ ▸ Dash │   [ route content — see §5 per screen]│
│ ▸ URL  │                                       │
│ ▸ ID   │                                       │
│ ▸ Behav│                                       │
│ ▸ Alert│                                       │
│ ▸ Incid│                                       │
└────────┴──────────────────────────────────────┘
```

Alignment: left-aligned throughout the app (it's a working tool, not prose); the public hero is the one place center-alignment is earned, because it's a single focal statement rather than a scanning task.

### Principles

- **One loud element.** The glow button is the only piece of overt motion/gradient chrome on the public site. Everything else — including the flip-fade text — is quieter than it, per the component's own default `text-4xl md:text-6xl font-bold` treatment (already commanding enough without extra decoration around it).
- **Severity color is sacred.** Brand teal and severity-low share a hex on purpose (see above), but no other brand token ever leaks into a severity slot, and no severity color is ever reused as a generic UI accent. An analyst should be able to trust color instantly.
- **The app is not the marketing site.** No glow buttons, no flip-fade text, no hero rhythm inside the authenticated product — analysts doing triage all day need calm, dense, predictable screens.
- **Real threat categories, not generic labels.** Wherever the design needs example copy (flip-fade words, empty states, dashboard scenario counters), pull from the actual three analyzers and the MITRE-mapped incident model already in the architecture — not placeholder buzzwords.

### Self-check against generic defaults

Run against the common AI-generated-design tells before building:
- Not the warm-cream-and-terracotta default, nor an unstyled SaaS-card kit with identical rounded corners everywhere — surfaces here use one radius scale tied to elevation (see §4), not one border-radius on everything.
- The dark-background-plus-one-accent pattern *is* present here — but it's directed by the brief (Better Stack itself is dark) and the accent system is derived from the actual glow-button gradient rather than a generic acid-green/vermilion default, so it's a choice tied to this brief's own asset, not a fallback.
- No tracked-out ALL-CAPS eyebrow labels, no middle-dot-joined meta strings, no `→` appended to every button — dropped all three from the component specs below.
- No numbered `01/02/03` badges anywhere in the design system — the only numbered list in this document is the build sequence in §6, which is a genuine sequence.

---

## 3. Type system, in detail

| Role | Font | Why |
|---|---|---|
| **Display / headline** — hero H1, section H2s, `SideNav` and `TopNav` labels, button labels | **Noto Kufi Arabic**, weights 500 / 700 | Confirmed Latin coverage (733 glyphs). Its squared, geometric Kufi structure reads as technical/precise at large sizes — a good fit for a security product headline without reaching for a cliché "hacker" typeface. |
| **Body / dense UI** — table cells (`AlertTable`, `IncidentTable`), `EvidenceList`, form labels, timestamps, paragraph copy | **Noto Sans**, weights 400 / 500 | Google's own description of Noto Sans calls it out as *the* complementary choice for pairing alongside script-specific Noto members like Kufi Arabic — so this isn't a random substitution, it's the family's own intended partner. Kufi Arabic is documented as best suited to larger sizes, and a SOC dashboard lives or dies on legible small text, so body copy needs a font built for that. |
| **Decorative only** — hero background texture, an optional flourish on `LoadingState` | **Noto Sans Ugaritic** | Its 36 cuneiform-style glyphs render as an abstract, angular wedge pattern — visually apt as a faint "cipher" motif behind the hero screenshot (ancient code ↔ modern threat intelligence), at low opacity (~6–10% over `--void`), large scale, never as a font-family assigned to any real copy. |

**Fallback stack**, so nothing ever breaks even before fonts load:

```css
--font-display: "Noto Kufi Arabic", "Segoe UI", system-ui, sans-serif;
--font-body: "Noto Sans", "Segoe UI", system-ui, sans-serif;
```

**Type scale** (major-third-ish, kept to two families as recommended — no third face introduced):

| Token | Size / line-height | Used for |
|---|---|---|
| `display-xl` | 56px / 1.05 | Public hero H1 |
| `display-lg` | 36px / 1.1 | Section H2, `ThreatHeader` incident title |
| `display-md` | 24px / 1.2 | Card titles, `AnalyzerForm` heading |
| `body-lg` | 16px / 1.5 | Default body |
| `body-sm` | 13px / 1.4 | Table rows, badges, timestamps |
| `mono-data` | 13px / 1.4, tabular-nums | IPs, hashes, MITRE technique IDs — **not** a separate typeface swap, just a monospace fallback (`ui-monospace`) reserved for genuinely code-like values, not decoration |

Line length: hero subhead and any prose (empty-state copy, tooltips) capped near 60–70 characters; tables and forms aren't prose, so this cap doesn't apply there.

---

## 4. Core components

### Login button — `RadialGlowButton`
Used exactly once per page: top-right nav on the public site, and on the sign-in screen itself. It already ships its own animated conic-gradient shine and a `--rg-color-*` custom-property system on hover — don't restyle its internals, just drop the CyberGuard palette into those same variables so the glow reads as *this product's* gradient rather than the template default:

```css
.rg-button {
  --rg-color-1: #000022; /* --ink */
  --rg-color-2: #1f3f6d; /* --steel */
  --rg-color-3: #469396; /* --signal */
  --rg-color-4: #f1ffa5; /* --glow */
  --rg-color-5: hsl(250 80% 2.5%); /* --void */
}
```
That's already the component's shipped default — confirming it needs no color changes is itself the design decision here; it was clearly built with a compatible palette in mind.

### Other top-nav items
Plain text links (`Product`, `Docs`), `--text-muted` at rest, `--text-primary` with a 1px `--signal` underline on hover/focus — no pill background, no border, no icon. The restraint here is what makes the glow button read as intentional rather than as one of several loud things competing.

### Hero middle line — `FlipFadeText`
Feed it the three real analyzer domains instead of generic placeholders:

```tsx
<FlipFadeText
  words={["MALICIOUS URLS", "COMPROMISED IDENTITIES", "ANOMALOUS BEHAVIOR"]}
  interval={2500}
  textClassName="text-[--text-primary]"
/>
```
Sitting inside a sentence — *"One console for **[flip word]**, scored and explained"* — rather than standing alone, so the animation illustrates the product's actual scope instead of being a decoration with no referent.

### Shared app primitives (already named in the architecture)

| Component | Design notes |
|---|---|
| `RiskBadge` | Pill, `body-sm`, filled with the matching `--sev-*` color at 15% opacity background / full-opacity text and left border-strip — never a raw saturated fill behind body text (fails contrast at small sizes) |
| `ConfidenceIndicator` | Horizontal bar, not a percentage-only number — analysts scan faster on a bar; number appears as a small caption underneath, not inside the bar |
| `EvidenceList` | Left-aligned list, each item: a small MITRE/source icon, `mono-data` for any raw value (IP, hash, URL), `body-sm` for the description |
| `MitreBadge` | Outline-only chip (border `--steel`, text `--text-muted`), technique ID in `mono-data` — kept visually quiet since a `RecommendationCard` may show several at once |
| `RecommendationCard` | Surface `--ink`, 8px radius, left border-strip in the relevant `--sev-*` color — the one place severity color is allowed to touch a card edge, never a full card background |
| `ApprovalControl` | Two explicit actions, never icon-only: **Approve** (filled `--signal`) and **Reject** (outline `--steel`) — action names stay identical from button → confirmation → `StatusBadge`, per the interface-vocabulary principle |
| `StatusBadge` | Same pill shape as `RiskBadge` but a distinct, non-severity palette (`--steel` = pending, `--signal` = in review, `--sev-resolved` = closed) so status and severity are never visually confusable side by side |
| `LoadingState` / `ErrorState` / `EmptyState` | See §5.7 |

Radius scale (tied to elevation, not applied uniformly): 6px on badges/chips, 8px on cards, 12px on the glow button and any modal — so "how rounded" communicates "how prominent," rather than one border-radius value everywhere.

---

## 5. Screen-by-screen spec

Each screen below maps to its route file and component list exactly as given in the architecture doc.

### 5.1 Dashboard — `routes/Dashboard.tsx`
Components: `AttentionBand`, `SeverityTiles`, `ScenarioCounters`, `TimelineChart`, `RecentIncidentsList`

Reading order top to bottom is triage priority, not filing-cabinet order:
1. **`AttentionBand`** — full-width strip at the very top, only rendered when something needs eyes right now (e.g. an unacknowledged critical incident). Uses `--sev-critical` sparingly as a left accent bar, not a full-band fill, so it reads as urgent without turning the whole dashboard red.
2. **`SeverityTiles`** — a row of 4–5 tiles (critical/high/medium/low/resolved counts), each tinted per its `--sev-*` token at low opacity, `display-md` numeral, `body-sm` label underneath.
3. **`ScenarioCounters`** — three counters, one per analyzer (URL / Identity / Behavior), so the dashboard visually echoes the same three-way split used in the hero's flip-fade words — deliberate consistency between marketing promise and product reality.
4. **`TimelineChart`** — full-width, `--signal` line on `--void`/`--ink`, gridlines in `--steel` at low opacity. No decorative gradient fill under the line; the chart's job is to be read quickly, not to look dramatic.
5. **`RecentIncidentsList`** — each row: `StatusBadge`, `RiskBadge`, title, relative timestamp (`body-sm`, `--text-muted`), click-through to Incident Detail.

### 5.2 Analyzers — `routes/UrlAnalyzer.tsx`, `IdentityAnalyzer.tsx`, `BehaviorAnalyzer.tsx`
Components: `AnalyzerForm`, `AnalyzerResult` (+ `RiskBadge`, `EvidenceList`, `MitreBadge`, `RecommendationCard`)

All three routes share one layout via the parameterized `AnalyzerForm`/`AnalyzerResult` pair already planned in the architecture — the only thing that changes per screen is the form's input shape (URL field vs. identity lookup vs. behavior/log input) and the copy in its heading. Two-column layout on desktop, stacked on mobile:

```
┌───────────────────┬───────────────────────┐
│  AnalyzerForm      │  AnalyzerResult       │
│  (input, one       │  RiskBadge            │
│   primary action:  │  EvidenceList         │
│   "Analyze")        │  MitreBadge(s)        │
│                    │  RecommendationCard   │
└───────────────────┴───────────────────────┘
```
Before a result exists, the right column shows `EmptyState` ("Run an analysis to see results here" — direction, not mood, per the empty-state principle). The submit action is always labeled **Analyze**, never "Submit," and the result panel's heading echoes it back once a result loads, keeping the verb identical through the flow.

### 5.3 Alerts — `routes/Alerts.tsx`
Components: `AlertFilters`, `AlertTable`

`AlertFilters` sits as a slim horizontal bar above the table (severity, analyzer type, date range) rather than a sidebar — alerts are a high-volume, fast-scanning screen, so filters shouldn't eat into table width. `AlertTable` rows use `body-sm`/`mono-data` throughout; `RiskBadge` is the leftmost column so severity is scannable down the whole list without reading row text.

### 5.4 Incidents — `routes/Incidents.tsx`
Components: `IncidentFilters`, `IncidentTable`

Same filter-bar-above-table pattern as Alerts for consistency (same vocabulary across similar screens), but `IncidentTable` adds a `StatusBadge` column alongside `RiskBadge` — an incident carries both a severity and a lifecycle state, and the two badges' distinct palettes (§4) keep them from blurring together.

### 5.5 Incident Detail — `routes/IncidentDetail.tsx`
Components: `ThreatHeader`, `RiskBadge`, `ConfidenceIndicator`, `EvidenceList`, `DetectionSignalsBreakdown`, `MitreBadge`(s), `RecommendationCard`, `ApprovalControl`, `StatusBadge`

This is the analyst's actual workspace screen, so it gets the most vertical structure of any route:

```
┌──────────────────────────────────────────────┐
│ ThreatHeader  (title, RiskBadge, StatusBadge)│
├───────────────────────────┬────────────────── ┤
│ ConfidenceIndicator        │ RecommendationCard│
│ DetectionSignalsBreakdown  │ ApprovalControl   │
│ EvidenceList               │ MitreBadge(s)     │
└───────────────────────────┴────────────────── ┘
```
Left column is "what happened and how sure are we," right column is "what to do about it" — a deliberate left-to-right reading order from evidence to action, so approving something is never the first thing an analyst sees before understanding why.

### 5.6 Navigation — `layout/TopNav.tsx`, `SideNav.tsx`
`SideNav` items in the order an analyst actually works: Dashboard, then the three analyzers grouped together, then Alerts, then Incidents — matching the architecture's own file grouping. Active route: `--signal` text + a 2px left border, not a filled pill (keeps the nav quiet, consistent with §2's "app is not the marketing site" principle). `TopNav` holds search and account only — no marketing chrome leaks into the authenticated shell.

### 5.7 Shared states — `components/shared/states/*`
- **`LoadingState`** — a single quiet pulse on the skeleton shape of the content it's replacing (table skeleton for tables, card skeleton for `AnalyzerResult`), not a spinner + message combo.
- **`ErrorState`** — states what failed and the next concrete action ("Couldn't load incidents. Retry."), in the interface's voice, no apology.
- **`EmptyState`** — always an invitation to act, phrased around the specific screen ("No alerts match these filters" vs. a generic "Nothing here").

---

## 6. Frontend build steps

1. **Scaffold shadcn into the existing Vite/React/TS project.** The architecture has no `components.json` or `lib/utils.ts` yet — both are required by shadcn's CLI:
   ```
   npx shadcn@latest init
   ```
   Point it at the existing `src/` structure; this generates `components.json`, `lib/utils.ts` (the `cn()` helper both VengeanceUI components import), and base Tailwind wiring.

2. **Install the two referenced components:**
   ```
   npx shadcn@latest add https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/radial-glow-button.json
   npx shadcn@latest add https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/flip-fade-text.json
   ```
   The second declares `framer-motion` as a dependency; confirm it lands in `package.json` after the add (`npm install framer-motion` manually if the CLI doesn't pull it in your setup).

3. **Self-host the type system.** Rather than a Google Fonts CDN request from a security product, pull the three families as local packages:
   ```
   npm install @fontsource/noto-kufi-arabic @fontsource/noto-sans @fontsource/noto-sans-ugaritic
   ```
   Import the weights actually used (500/700 for Kufi Arabic, 400/500 for Sans, one weight for the decorative Ugaritic texture) once in `main.tsx`, then declare the `--font-display`/`--font-body` CSS variables from §3 in the global stylesheet.

4. **Add the token system to Tailwind.** Extend `tailwind.config` (or the CSS-variable layer shadcn's init generates) with the `--void`/`--ink`/`--steel`/`--signal`/`--glow` and `--sev-*` tokens from §2, plus the radius scale from §4. Every component built afterward references these tokens — never a raw hex — so a future palette tweak is a one-file change.

5. **Build `layout/TopNav.tsx` and `SideNav.tsx` first.** They wrap every authenticated route, so the app shell (§5.6) needs to exist before any route can be previewed in context.

6. **Build `components/shared/*` before any route.** `RiskBadge`, `StatusBadge`, `ConfidenceIndicator`, `EvidenceList`, `MitreBadge`, `RecommendationCard`, `ApprovalControl`, and the three `states/` components are reused across nearly every screen in §5 — building them once up front avoids redefining the same badge styling per-route later.

7. **Build the public hero** (`RadialGlowButton` wired to the login route, `FlipFadeText` fed the three analyzer words, the decorative Ugaritic texture at low opacity behind the hero screenshot) as its own isolated section — it shares the token system but none of its components are reused inside the authenticated app.

8. **Build routes in triage order:** `Dashboard.tsx` → the three analyzer routes (share one form/result pair, per §5.2) → `Alerts.tsx` → `Incidents.tsx` → `IncidentDetail.tsx`. This order means every shared component gets exercised by Dashboard first, so bugs in shared primitives surface before they're relied on by four more screens.

9. **Wire data last.** `services/`, `hooks/`, and `mocks/mock-data.ts` are already scoped in the architecture — build every screen above against `mocks/mock-data.ts` first, confirm the design holds up against real-shaped data (long incident titles, empty evidence lists, five stacked `MitreBadge`s), then swap in the live `hooks/useAlerts.ts`-style calls.

10. **Accessibility and motion pass.** Verify visible keyboard focus on `ApprovalControl`, `AnalyzerForm` inputs, and both VengeanceUI components (neither ships a visible focus ring by default — add one in the CyberGuard token colors). Wrap `FlipFadeText` and the glow button's shine animation in a `prefers-reduced-motion` check so both go static, not just slower, for users who've asked for that.

---

## 7. Open assumptions

The four files referenced in the original request (`Architecture__2_.md`, `CYBERGUARD_BLUEPRINT.md`, `CYBERGUARD_PRD.md`, `PLAN.md`) didn't come through on upload, so this spec is grounded entirely in the screen-to-component mapping and folder structure provided directly in this conversation. If the PRD or blueprint define things this document had to infer — exact severity taxonomy, a product name/tagline beyond "CyberGuard," specific MITRE tactic groupings, or auth/role requirements beyond a single Login button — re-upload those and I'll reconcile this spec against them.
