# Vantage Ops — FIFA World Cup 2026 Volunteer Operations Copilot

> **PromptWars Virtual — Challenge 4: Smart Stadiums & Tournament Operations**  
> Built with Gemini AI · Deployed on Render · Powered by Firebase Firestore

**Live Demo:** https://vantage-ops.onrender.com

---

## What is Vantage Ops?

Vantage Ops is a real-time GenAI-powered operations assistant for FIFA World Cup 2026 volunteers. Instead of relying on radio chatter, printed SOPs, or instinct, volunteers can upload a live stadium data snapshot (CSV or PDF) and ask operational questions in any language — getting grounded, actionable recommendations in seconds.

Every answer is:
- **Grounded** in the uploaded data (cites actual numbers, not generic advice)
- **Verified** by a server-side grounding guard that confirms the AI cited real data
- **Translated** automatically into the fan's language via Google Translate
- **Logged** permanently to Firebase Firestore for post-match review

---

## The Problem

At an 82,500-capacity FIFA World Cup venue like MetLife Stadium:
- Volunteers speak different languages than fans
- Gate congestion, medical incidents, and lost children require instant, correct decisions
- Standard radio comms and printed SOPs don't scale to 16 concurrent host venues
- There is no unified tool that reasons over live crowd data in real time

---

## The Solution

One reasoning engine — not a chatbot — that generalizes across every operational scenario:

| Scenario | What Vantage Ops Does |
|---|---|
| Gate congestion | Cites queue length vs capacity, recommends specific redirect gate |
| Medical incident | Escalates with MED-RED dispatch code, cites minutes since report |
| Lost child | Triggers SOP Rule 3, instructs parent placement, suppresses name broadcast |
| Fan speaks Spanish | Auto-detects language, translates recommendation back to Spanish |
| Malformed/empty data | Honest response — states data limitation, gives best-effort guidance |
| Gemini overloaded | Auto-fails over to Groq (Llama 3.3 70B), volunteer never notices |

---

## Features

### Core Reasoning
- Upload live stadium data as **CSV** (gate status, incident log) or **PDF** (SOP updates, incident reports)
- Auto-schema detection — gate_status, incident_log, or generic
- 16-entry SOP knowledge base with real dispatch codes (MED-RED, SEC-ORANGE, SEC-BLACK)
- Few-shot prompted Gemini reasoning — always cites specific data fields in response
- Structured JSON output enforced via Gemini's response schema

### Grounding Guard
- Server-side safeguard extracts all numeric values from uploaded data
- Verifies AI response cites at least one real number from the dataset
- Result surfaced in UI: **✓ Verified against live data** or **⚠ Unverified**

### Multilingual Support
- Speech recognition via Web Speech API (mic button, shown only on supported browsers)
- Auto-detects fan's spoken/typed language via Google Translate API
- Translates recommendation back to fan's language automatically
- No manual language selection needed — fully automatic
- Supports 15+ languages including Hindi, Arabic, Japanese, Korean, Chinese

### AI Resilience
- **Primary:** Gemini Flash (gemini-flash-latest)
- **Fallback:** Groq (Llama 3.3 70B) — activates automatically on:
  - Gemini 503/429 errors
  - 45-second timeout
  - Exponential backoff retry (1s, 2s) before fallback
- Volunteers never see a failure — seamless handoff between providers

### Operational Intelligence Feed
- Every volunteer query + AI response logged in real time
- Urgency badges (HIGH/MEDIUM/LOW) with color coding
- Fan-facing translation shown alongside English recommendation
- Clears automatically when new data snapshot is uploaded
- Permanently archived to Firebase Firestore

### Safety & Alerts
- **Urgency banner** — animated red/amber banner appears for HIGH/MEDIUM incidents
- **Data freshness warning** — warns if snapshot is older than 30 minutes
- **Grounding indicator** — visible proof AI used real data, not hallucination

### Security
- Rate limiting: 30 queries / 15 min per IP, 10 uploads / 15 min per IP
- Input validation: max 500 characters, min 3 characters, extension + size checks
- CORS restricted to known origins only
- Firebase Firestore locked to server-side access only (rules: deny all client access)
- API keys in environment variables only — never committed to git
- File upload: extension validation + 5MB size limit

### Accessibility (WCAG AA)
- Zero failing Lighthouse automated accessibility checks
- Full keyboard navigation with visible focus rings
- ARIA labels, aria-live regions, skip links
- Urgency communicated via icon + text + color (never color alone)
- Screen reader compatible response console

### UI/UX
- Dark/light theme toggle (respects system preference, persists in localStorage)
- Rotating loading messages while AI reasons
- Friendly error UI with Retry button (no raw JSON errors)
- Mobile-responsive layout (tested on Android Chrome)
- Single-page design — everything available without navigation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| AI (Primary) | Google Gemini Flash (gemini-flash-latest) |
| AI (Fallback) | Groq — Llama 3.3 70B Versatile |
| Database | Firebase Firestore (permanent archive) + local JSON (fast display) |
| Translation | google-translate-api-x (free Google Translate) |
| Speech | Web Speech API (browser-native) |
| PDF parsing | pdf-parse (PDFParse class) |
| CSV parsing | csv-parser |
| Rate limiting | express-rate-limit |
| Deployment | Render (Web Service) |
| Container | Docker (Cloud Run compatible) |
| Frontend | Vanilla HTML + CSS + JS (no framework) |

---

## Project Structure

```
vantage-ops/
├── server.js                    # Express entry point, routes, middleware wiring
├── middleware/
│   ├── rateLimit.js             # Per-IP rate limiting (query + upload)
│   └── inputValidator.js        # Input sanitization and validation
├── services/
│   ├── firestore.js             # Firebase Firestore + local fallback DB
│   └── gemini.js                # Gemini retry logic, Groq fallback, timeout
├── public/
│   ├── index.html               # Single-page volunteer UI
│   ├── app.js                   # Frontend logic
│   └── styles.css               # Dark/light theme, WCAG AA compliant
├── venue.config.json            # Fixed venue config per deployment
├── Dockerfile                   # Cloud Run compatible container
├── .env                         # API keys (gitignored)
├── .env.example                 # Placeholder only
└── firebase-service-account.json # Firebase credentials (gitignored)
```

---

## Setup & Local Development

### Prerequisites
- Node.js 20+
- A Gemini API key from https://aistudio.google.com/apikey
- A Groq API key from https://console.groq.com
- A Firebase project with Firestore enabled

### Installation

```bash
git clone https://github.com/Aaditya1344/Volunteer-Ops-Copilot
cd Volunteer-Ops-Copilot
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
ADMIN_PASSCODE=your_chosen_passcode
PORT=8080
```

Place your Firebase service account JSON file at `./firebase-service-account.json`.

### Run locally

```bash
npm start
```

Open http://localhost:8080

### Test data files

Upload these sample files to test the system:

| File | Schema | Tests |
|---|---|---|
| `gate_status.csv` | gate_status | Crowd bottleneck, gate redirect |
| `incident_log.csv` | incident_log | Medical escalation, lost child |
| `gate_status_update.pdf` | pdf_text | PDF reasoning, mixed scenario |
| `malformed_test.csv` | generic | Edge case handling |

---

## Deployment on Render

1. Connect your GitHub repo to Render
2. Set environment variables in Render dashboard:
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT_JSON` (paste entire JSON as one line)
   - `ADMIN_PASSCODE`
3. Build command: `npm install`
4. Start command: `npm start`
5. Render auto-deploys on every GitHub push

---

## How It Works

```
Volunteer/Fan Input
       │
       ▼
Web Speech API (optional mic input, auto-detects language)
       │
       ▼
POST /api/query
       │
       ├── Input validation (length, type, sanitization)
       ├── Rate limiting (30 req/15min per IP)
       │
       ▼
Load LIVE_DATA from Firestore/local
       │
       ▼
Build Gemini prompt:
  - System: venue config + 16 SOPs + grounding rules
  - User: LIVE_DATA JSON + volunteer question
       │
       ▼
callGeminiWithRetry() with 45s timeout
  ├── Success → parse JSON response
  └── Fail (503/429/timeout) → callGroq() fallback
       │
       ▼
Grounding Guard:
  - Extract numbers from LIVE_DATA
  - Check if AI response cites any of them
  - Set isGrounded: true/false
       │
       ▼
Auto-detect question language → Google Translate recommendation
       │
       ▼
Save to Firestore (permanent) + local_db.json (fast display, last 6)
       │
       ▼
Return to frontend:
  {recommendation, reasoning, urgency, fan_facing_translation, isGrounded}
```

---

## SOP Knowledge Base

16 standard operating procedures embedded in the reasoning engine:

1. Crowd Bottleneck (>90% capacity or >40 fans/min)
2. Medical Incident (MED-RED dispatch, 3-minute escalation window)
3. Lost Child (announcement protocol, no name broadcast)
4. Lost Item (Guest Services Desk — Sections 124, 224, 324)
5. Evacuation (zone routes, parking lot assembly)
6. Ticket Dispute (Box Office redirect)
7. Severe Weather (Upper/Mezzanine zone clearance)
8. Unruly Fan (SEC-ORANGE dispatch)
9. Suspicious Package (SEC-BLACK, 50-foot perimeter)
10. Power Outage (remain seated protocol)
11. Gate Equipment Failure (offline backup scan mode)
12. VIP/VVIP Escort (West Club Entrance)
13. Disabled Access/ADA (elevator banks at Sections 104, 124, 204, 224)
14. Stretcher Request (service tunnel path clearance)
15. Media Access (Press Box Level 4)
16. Alcohol Control (75th minute cutoff)

---

## Venue Configuration

Each deployment is fixed to one venue via `venue.config.json`:

```json
{
  "venueName": "MetLife Stadium",
  "officialTournamentName": "New York New Jersey Stadium",
  "capacity": 82500,
  "zones": ["Club", "Field", "Mezzanine", "Upper"],
  "city": "East Rutherford"
}
```

To deploy for a different FIFA 2026 host venue, update this file and redeploy. One deployment per stadium.

---

## Security Notes

- All API keys stored in environment variables only — never in source code
- Firebase Firestore rules deny all direct client access — server-side only
- `firebase-service-account.json` and `.env` are gitignored
- Input sanitized before reaching AI prompt (length limits, type checks)
- CORS restricted to known deployment origins
- Rate limiting prevents API quota abuse and DoS attempts
- File uploads validated by extension and size (not MIME type — unreliable across OS)

---

## License

Built for FIFA World Cup 2026 operations context. Internal volunteer use only.