# InterviewIQ

AI-powered, resume-aware mock interview platform. Upload a resume, get a tailored technical interview generated from your real skills and projects, receive real-time AI-scored feedback question by question, and walk away with a hiring-style analytics dashboard and a downloadable PDF report.

Built as an end-to-end SDE portfolio project: authentication, file upload + parsing, a third-party AI integration, a full CRUD data model, an admin panel, automated API tests with CI, and a production deployment — not just a CRUD-app tutorial clone.

🔗 **Live demo:** https://interview-iq-virid.vercel.app · Backend health check: `/api/health`

> The backend is hosted on Render's free tier, which sleeps after 15 minutes of inactivity — the first request after a period of idle time can take 30–60 seconds to respond while it wakes up. Subsequent requests are fast.

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [How to run](#how-to-run)
- [Running tests](#running-tests)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [Future improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Overview

InterviewIQ simulates a real technical interview loop:

1. **Sign up and upload a resume** (PDF/DOCX) — a Python microservice extracts skills, technologies, and project context.
2. **Pick a company mode** (General, Google, Amazon, Microsoft, Atlassian) and start an interview — Google's Gemini 2.5 Flash generates questions tailored to the parsed resume and the selected company's interview style.
3. **Answer each question;** every answer is scored and critiqued by the AI in real time, with the option to retry a failed evaluation or save and exit mid-interview.
4. **Review results** — an overall score, per-skill breakdown, strengths/weaknesses, and a hiring-style recommendation — then export a PDF report or revisit it later from History.
5. **Track progress over time** on the Dashboard and Analytics pages, manage your Profile and account Settings, and get notifications as resumes are parsed, interviews complete, and reports are generated.

An **Admin dashboard** gives platform-wide visibility into usage: total users, interviews, resumes, average scores, and the most-practiced company mode.

## Features

- 🔐 JWT authentication with protected + role-based (user/admin) routes
- 📄 Resume upload and parsing (PDF/DOCX → structured skills/tech/projects)
- 🤖 AI-generated, resume-aware interview questions (Gemini 2.5 Flash)
- ✅ Real-time AI answer evaluation with per-question scoring and feedback
- 📊 Results, analytics, and full interview history with search/filter/sort
- 🧾 Downloadable, hiring-style PDF interview reports (jsPDF)
- 👤 Profile page with avatar upload and computed stats (best/average score, companies practiced, skills detected)
- ⚙️ Account settings: profile info, password change, logout-from-all-devices, and interview preferences (default company, difficulty, question count)
- 🔔 In-app notifications for resume upload, AI analysis, interview completion, and report generation
- 🛡️ Admin dashboard with platform-wide stats and Recharts visualizations
- 🧪 Layered test suite: Jest + Supertest API tests, pytest for the resume parser, Playwright browser smoke tests, a Postman collection, a curl smoke script and a k6 load test, all wired into GitHub Actions CI
- 🐳 Dockerfile and `docker-compose.yml` for a one-command local API + MongoDB
- 🌗 Full dark/light mode
- ⚡ Route-based code splitting, skeleton loaders, and toast notifications
- 🧯 Dedicated 404 / 500 / network-error / session-expired / unauthorized states, plus a React error boundary
- ♿ Semantic HTML, ARIA labels/roles, and keyboard-accessible focus states

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 + Vite, Tailwind CSS, React Router, Axios, Recharts, jsPDF |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (with token-versioning for session invalidation) |
| AI | Google Gemini 2.5 Flash API |
| Resume parsing | Python microservice (PyMuPDF, python-docx) |
| Testing / CI | Jest, Supertest, mongodb-memory-server, pytest, Playwright, Postman, k6, curl/Bash, GitHub Actions |
| Containers | Docker, Docker Compose |
| Deployment | Vercel (frontend), Render (backend) |

## Folder structure

```
InterviewIQ/
├── frontend/                # React + Vite + Tailwind SPA
│   └── src/
│       ├── api/              # Axios request modules, one per resource
│       ├── components/       # Reusable UI, grouped by feature area
│       ├── context/          # Auth, Theme, Toast, Notification providers
│       ├── hooks/             # Shared hooks (e.g. useOnlineStatus)
│       └── pages/             # Route-level page components
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, validation, error/timeout handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Route → controller wiring
│   │   ├── services/          # AI/notification/business-logic services
│   │   └── utils/              # Small stateless helpers
│   └── tests/
│       ├── auth.test.js       # Jest + Supertest API tests
│       ├── postman/           # Postman collection (import into Postman or run with newman)
│       ├── k6/load.js         # k6 load test
│       └── smoke.sh           # curl-based smoke test
├── frontend/e2e/              # Playwright browser smoke tests (API mocked)
├── ai-service/                # Python resume parser (spawned by backend)
│   └── tests/                 # pytest suite for the parser
├── Dockerfile / docker-compose.yml  # API + MongoDB, one command (repo root)
├── .github/workflows/         # GitHub Actions CI (all test suites)
├── render.yaml                # Render deployment blueprint (backend)
└── README.md
```

> **Note:** depending on how you cloned/downloaded this repo, everything above may sit one level deeper, inside an outer `InterviewIQ/` folder (i.e. `InterviewIQ/InterviewIQ/backend` instead of `InterviewIQ/backend`). If that's the case for you, either flatten it by moving the inner folder's contents up one level, or just remember to `cd` in one extra level — and if you're deploying, make sure `render.yaml`'s `rootDir` and Vercel's "Root Directory" setting match whichever layout you actually have.

## Installation

Clone the repo, then install each part independently:

```bash
git clone https://github.com/<your-username>/InterviewIQ.git
cd InterviewIQ
```

**AI service (Python resume parser)**

```bash
cd ai-service
pip install -r requirements.txt --break-system-packages
```

No server to run — the backend spawns `resume_parser.py` as a subprocess.

**Backend**

```bash
cd ../backend
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

## Environment variables

Copy each `.env.example` to `.env` and fill in real values — never commit a real `.env` file.

**`backend/.env`**

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

`CLIENT_URL` accepts a comma-separated list, useful when the frontend has both a production domain and Vercel preview deployments.

Get a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas and a free Gemini API key at https://aistudio.google.com/apikey.

> **MongoDB Atlas note:** in Atlas, go to **Network Access** and add `0.0.0.0/0` ("Allow Access From Anywhere") to the IP Access List. Hosting providers like Render don't have a fixed IP, so restricting to a single address will cause connection failures in production.

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:5000/api
```

## How to run

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

Health check: `GET http://localhost:5000/api/health`.

## Testing

| Layer | Tool | Where | What it checks |
| --- | --- | --- | --- |
| API | Jest + Supertest | `backend/tests/auth.test.js` | Auth endpoints: validation, duplicate email, wrong password, missing / malformed / expired / forged JWTs (13 tests) |
| API (manual / CI) | Postman collection | `backend/tests/postman/` | Signup, login, wrong password, `/me` with and without a token |
| Smoke | curl + Bash | `backend/tests/smoke.sh` | Health, signup, login, bad login, unauthenticated `/me` against a running server |
| Browser | Playwright | `frontend/e2e/login.spec.js` | Login page, client-side validation, wrong credentials, successful login to `/dashboard` (API mocked) |
| Unit / integration | pytest | `ai-service/tests/` | Resume parser: keyword matching, section splitting, education / project parsing, PDF and DOCX end to end |
| Load | k6 | `backend/tests/k6/load.js` | 10 virtual users for 30 s against `/api/health` and `/api/auth/login`, thresholds on error rate and p95 latency |

### API tests (Jest + Supertest)

**Prerequisites:** Node.js 18+ and an internet connection on the first run. The tests use `mongodb-memory-server`, which downloads a MongoDB binary once and caches it. No `.env` file, Atlas cluster or running server is needed.

```bash
cd InterviewIQ/backend
npm ci
npm test                        # run the suite
npm test -- --coverage          # with a coverage report
npm test -- -t "wrong password" # a single test by name
```

Expected result: `Tests: 13 passed, 13 total`.

### Browser smoke tests (Playwright)

```bash
cd InterviewIQ/frontend
npm ci
npx playwright install chromium
npm run test:e2e
```

The tests mock the API with `page.route`, so no backend or database is needed. Playwright starts the Vite dev server itself.

### Parser tests (pytest)

```bash
cd InterviewIQ/ai-service
pip install -r requirements-dev.txt --break-system-packages
pytest -v
```

A few tests are marked `xfail(strict=True)`: they document known parser defects that are tracked as GitHub Issues. When a defect is fixed its test starts passing, strict mode flags it, and the marker is removed.

### Running with Docker, then smoke and load tests

```bash
docker compose up --build -d          # API on :5000, MongoDB on :27017
curl -s localhost:5000/api/health     # {"success":true,"status":"ok","db":"connected",...}
bash InterviewIQ/backend/tests/smoke.sh
k6 run InterviewIQ/backend/tests/k6/load.js
# or: BASE_URL=https://your-api.example.com k6 run InterviewIQ/backend/tests/k6/load.js
```

Manual smoke test with curl:

```bash
BASE=http://localhost:5000
curl -s $BASE/api/health
curl -s -X POST $BASE/api/auth/signup -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"me@example.com","password":"password123"}'
curl -s -X POST $BASE/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"me@example.com","password":"password123"}'
```

Postman: import `backend/tests/postman/InterviewIQ.postman_collection.json`, set the `baseUrl` variable, and run the collection. The Login request stores the token for the `/me` request.

### Latest results

| Check | Result |
| --- | --- |
| Jest | 13 / 13 passing, coverage **[fill in]**% (statements) |
| pytest | 22 passed, 3 expected failures (open parser bugs) |
| k6 (10 VUs, 30 s, local Docker) | p95 **[fill in]** ms, error rate **[fill in]**% |

### Continuous integration

`.github/workflows/test.yml` runs on every push and pull request: backend Jest with coverage (report uploaded as an artifact), pytest for the parser, Playwright for the frontend, and a Docker job that builds the image, starts the stack with Docker Compose, then runs `smoke.sh` and the k6 load test. Results appear in the repo's **Actions** tab.

## API reference

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | – | Create an account |
| POST | `/api/auth/login` | – | Log in, returns a JWT |
| GET | `/api/auth/me` | ✔ | Current user |
| POST | `/api/resumes/upload` | ✔ | Upload + parse a PDF/DOCX resume |
| GET | `/api/resumes` | ✔ | List the current user's resumes |
| GET | `/api/resumes/:id` | ✔ | Get one resume's extracted data |
| POST | `/api/interviews/start` | ✔ | Start a new interview (generates questions) |
| GET | `/api/interviews/active` | ✔ | Get the in-progress session, if any |
| GET | `/api/interviews/history` | ✔ | List completed interview reports |
| GET | `/api/interviews/session/:id` | ✔ | Get full session detail (resume/continue) |
| POST | `/api/interviews/session/:id/answer` | ✔ | Submit + evaluate an answer, advance |
| POST | `/api/interviews/session/:id/answer/:answerId/retry` | ✔ | Retry a failed evaluation |
| PATCH | `/api/interviews/session/:id/save-progress` | ✔ | Save a draft answer |
| POST | `/api/interviews/session/:id/finish` | ✔ | Finalize into an Interview report |
| GET | `/api/interviews/:id` | ✔ | Get one finished interview report |
| GET | `/api/results/:interviewId` | ✔ | Get a single result summary |
| GET | `/api/history` | ✔ | List all interviews for History page |
| DELETE | `/api/history/:id` | ✔ | Delete an interview record |
| GET | `/api/report/:id` | ✔ | Full report data for PDF export |
| POST | `/api/report/pdf` | ✔ | Record that a PDF was generated |
| GET | `/api/profile` | ✔ | Profile + computed stats |
| PUT | `/api/profile` | ✔ | Update profile fields |
| POST | `/api/profile/avatar` | ✔ | Upload a profile photo |
| PUT | `/api/settings` | ✔ | Update profile fields and/or preferences |
| POST | `/api/settings/change-password` | ✔ | Change password |
| POST | `/api/settings/logout-all-devices` | ✔ | Invalidate every active session |
| GET | `/api/notifications` | ✔ | List notifications + unread count |
| PUT | `/api/notifications/read` | ✔ | Mark one or all notifications read |
| GET | `/api/admin/dashboard` | ✔ (admin) | Platform-wide stats and chart data |

## Deployment

**Backend → Render**

1. `render.yaml` at the repo root defines the service, using Render's Blueprint feature (New → Blueprint, pick this repo).
2. `rootDir` in `render.yaml` must point at wherever `backend/` actually sits in your repo — a plain `backend` for a flat layout, or something like `InterviewIQ/backend` if your checkout has the extra nested folder mentioned above.
3. Set `MONGO_URI`, `CLIENT_URL`, and `GEMINI_API_KEY` as environment variables in the Render dashboard when prompted (they're marked `sync: false` in the blueprint so Render asks for them rather than reading committed values).
4. Make sure MongoDB Atlas's Network Access list includes `0.0.0.0/0` — otherwise Render's servers can't reach your database.

**Frontend → Vercel**

1. Import the repo into Vercel and set **Root Directory** to wherever `frontend/` actually sits (same nesting caveat as above).
2. `vercel.json` handles SPA rewrites so client-side routes don't 404 on refresh.
3. Set `VITE_API_URL` to your deployed Render backend's `/api` URL, e.g. `https://interviewiq-api-ejq8.onrender.com/api`.
4. Once both are live, update `CLIENT_URL` on Render to your real Vercel URL so CORS allows the deployed frontend to call the deployed backend.

## Future improvements

- WebSocket-based live notifications instead of polling
- Voice-based interview answers with speech-to-text
- Team/organization accounts for bootcamps and universities
- Configurable question banks per company beyond the built-in five modes
- Expand test coverage to resume, interview and admin endpoints, plus frontend component tests
- Run the Postman collection in CI with newman

## Contributing

This is primarily a personal portfolio project, but issues and PRs are welcome:

1. Fork the repo and create a feature branch
2. Keep changes scoped and consistent with the existing code style
3. Open a PR describing what changed and why

## License

ISC — free to use and adapt for your own learning or portfolio.