# Cyber Crime India

Cyber Crime India is a citizen-first web portal for reporting cyber crime, checking suspicious content, tracking complaints, and learning about common scams.

It is designed around a simple principle: help a person take the right next step quickly, whether they need to report fraud, verify a link, understand a scam, or call the national helpline.

## Features

### Report a cyber crime

- Guided complaint flow with four steps:
  1. Complaint details
  2. Incident details
  3. Evidence
  4. Review and submit
- Text-based complaint reporting.
- Voice-assisted reporting with supported Indian languages.
- Browser recording and audio conversion before transcription.
- Complaint references generated in the `CCIN/YYYY/######` format.
- Submitted complaints are persisted in Convex when a Convex URL is configured.
- The no-backend demo mode keeps the example reference `CCIN/2026/004281` available.

### Detect cyber crime

- Scan a URL, message, or uploaded screenshot.
- Local heuristic checks for OTP/PIN requests, urgency, shortened links, KYC/refund/job themes, and similar signals.
- Optional integrations for Gemini 3.5 Flash-Lite vision/OCR, ScamCheck, VirusTotal, and Google Safe Browsing.
- Displays a risk score, risk level, provider status, and reasons behind the result.
- Includes a built-in suspicious SBI message demo.

### Track a complaint

- Search by complaint reference.
- Live Convex query subscription for realtime complaint updates.
- Displays category, summary, status, progress, last update, and case timeline.
- Supports registered, investigating, and resolved statuses.
- Keeps a hardcoded demo complaint for local/demo mode.
- Unknown references show a clear not-found state.

### Awareness

- Trending complaint list with interactive scam-learning boards.
- Five tailored, five-step explainers covering:
  - Fake UPI Collect requests
  - KYC expiry phishing links
  - Telegram task-job scams
  - Fake bank helplines
  - RBI refund OTP scams
- Step navigation through buttons, numbered progress controls, and keyboard arrows.
- Creator-credited Instagram reels and posts.
- Same-origin Instagram media proxy for development media loading.
- Official I4C awareness creatives.

### Other portal areas

- Cyber safety learning resources.
- Support and contact information.
- 1930 national cyber fraud helpline call-to-action.
- English and Indian-language translation infrastructure through Convex.
- Responsive layout for desktop, tablet, and mobile.

## Technology

- React 19
- TypeScript
- Vite 7
- Convex 1.45
- Phosphor Icons Web
- Native CSS design tokens and responsive styles
- Optional Sarvam speech-to-text integration

## Project structure

```text
.
├── convex/
│   ├── schema.ts              Database schema
│   ├── mutations.ts           Complaint writes
│   ├── queries.ts             Complaint, trend, and resource reads
│   ├── detection.ts            Detection action and persisted scan results
│   ├── voice.ts                Speech-to-text action
│   ├── seed.ts                 Demo database seed
│   └── translationSeed.ts      Translation seed data
├── src/
│   ├── App.tsx                Hash-routed application shell
│   ├── main.tsx               React and optional Convex bootstrapping
│   ├── i18n.tsx               Translation provider
│   ├── components/
│   │   ├── layout/             Header and footer
│   │   ├── pages/              Route-level pages
│   │   ├── report/             Complaint and voice reporting flows
│   │   └── ui/                 Shared UI components
│   ├── data/                   Cached awareness data
│   └── styles/                 Tokens, global styles, and page styles
├── public/                     Static assets and demo screenshot
├── vite.config.ts              Vite config and Instagram proxy middleware
└── index.html                  Application entry point
```

## Application architecture

The app is a Vite-powered single-page React application. Navigation uses URL hashes instead of a router dependency:

```text
Header navigation
       │
       ▼
App.tsx parses #route
       │
       ├── Home
       ├── Report
       ├── Detect
       ├── Track
       ├── Learn
       ├── Awareness
       ├── Resources
       ├── Contact
       └── Voice
```

Convex is optional at runtime. `src/main.tsx` only creates a `ConvexProvider` when `VITE_CONVEX_URL` exists. Pages that require backend features use connected variants and provide a safe demo/unavailable state when Convex is not configured.

### Complaint data flow

```text
ComplaintFlow
    │ useMutation(api.mutations.submitComplaint)
    ▼
Convex complaints table
    │
    │ useQuery(api.queries.getComplaint, { reference })
    ▼
TrackPage realtime subscription
```

The complaint table stores:

- `reference`
- `category`
- `summary`
- `status`
- `reportedAt`
- `lastUpdated`

Evidence currently records selected filenames in the client flow. The files themselves are not uploaded to Convex storage yet.

### Detection data flow

```text
Text / URL / screenshot
          │
          ▼
Convex detection action
          │
          ├── Local heuristic fallback
          ├── Optional external providers
          └── Persisted scan result
```

## Requirements

- Node.js 18 or newer
- npm
- A Convex project for live complaint, detection, voice, and translation features

## Local development

Install dependencies:

```bash
npm install
```

Start the Vite frontend:

```bash
npm run dev
```

For live Convex functionality, start Convex in a second terminal:

```bash
npx convex dev
```

Create `.env.local` in the project root:

```bash
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

The exact value is normally written by the Convex CLI during setup. Restart Vite after changing environment variables.

## Convex setup

Deploy or sync Convex functions:

```bash
npx convex dev
```

Seed demo complaints, trends, and resources:

```bash
npx convex run seed:seedDemoData
```

Seed translations when needed:

```bash
npx convex run translationSeed:seed
```

Optional backend environment variables:

```bash
npx convex env set SARVAM_API_KEY your_key
npx convex env set GEMINI_API_KEY your_key
npx convex env set SCAMCHECK_API_KEY your_key
npx convex env set VIRUSTOTAL_API_KEY your_key
npx convex env set GOOGLE_SAFE_BROWSING_KEY your_key
```

Without optional provider keys, detection still uses its local heuristic fallback.

## Production build

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Serve the production build locally |
| `npx convex dev` | Run and sync Convex functions |
| `npx convex run seed:seedDemoData` | Load demo database records |

## Development notes

- Read `AGENTS.md` before changing project code.
- Read `convex/_generated/ai/guidelines.md` before changing Convex code.
- Keep frontend-only fallbacks working when `VITE_CONVEX_URL` is absent.
- Use the existing Phosphor icon family for new interface icons.
- Prefer the existing CSS variables and component patterns before adding new tokens.
- Complaint status changes are currently database-driven; an admin workflow for changing status is not included.
- Authentication and authorization are not currently implemented.

## Current limitations

- Complaint evidence filenames are captured, but file bytes are not stored.
- Complaint status is created as `registered`; no citizen-facing status update mutation exists yet.
- External detection services are optional and may be unavailable or rate-limited.
- Instagram content depends on the upstream public profile endpoints and proxy availability.
- The production host must support the configured Convex URL and any required server-side media proxy behavior.

## Safety and privacy

This project is an awareness and reporting prototype. Users should not share passwords, OTPs, UPI PINs, or other secrets in a complaint description. For active financial fraud, contact the national cyber fraud helpline at **1930** immediately.
