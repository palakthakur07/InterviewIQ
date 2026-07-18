# InterviewIQ

**AI-powered, resume-aware mock interview platform.** Upload a resume, get a
tailored technical interview generated from your real skills and projects,
receive real-time AI-scored feedback question by question, and walk away with
a hiring-style analytics dashboard and a downloadable PDF report.

Built as an end-to-end SDE portfolio project: authentication, file upload +
parsing, a third-party AI integration, a full CRUD data model, an admin panel,
and a production deployment — not just a CRUD-app tutorial clone.

🔗 **Live demo:** [https://interview-iq-virid.vercel.app](https://interview-iq-virid.vercel.app) ·
Backend health check: [`/api/health`](https://interviewiq-api-ejq8.onrender.com/api/health)

> The backend is hosted on Render's free tier, which sleeps after 15 minutes
> of inactivity — the first request after a period of idle time can take
> 30–60 seconds to respond while it wakes up. Subsequent requests are fast.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [How to run](#how-to-run)
- [API reference](#api-reference)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Future improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

InterviewIQ simulates a real technical interview loop:

1. **Sign up** and **upload a resume** (PDF/DOCX) — a Python microservice
   extracts skills, technologies, and project context.
2. **Pick a company mode** (General, Google, Amazon, Microsoft, Atlassian)
   and start an interview — Google's Gemini 2.5 Flash generates questions
   tailored to the parsed resume and the selected company's interview style.
3. **Answer each question**; every answer is scored and critiqued by the AI
   in real time, with the option to retry a failed evaluation or save and
   exit mid-interview.
4. **Review results** — an overall score, per-skill breakdown, strengths/
   weaknesses, and a hiring-style recommendation — then export a PDF report
   or revisit it later from **History**.
5. **Track progress** over time on the **Dashboard** and **Analytics** pages,
   manage your **Profile** and account **Settings**, and get **notifications**
   as resumes are parsed, interviews complete, and reports are generated.
6. An **Admin dashboard** gives platform-wide visibility into usage: total
   users, interviews, resumes, average scores, and the most-practiced company
   mode.

## Features

- 🔐 JWT authentication with protected + role-based (user/admin) routes
- 📄 Resume upload and parsing (PDF/DOCX → structured skills/tech/projects)
- 🤖 AI-generated, resume-aware interview questions (Gemini 2.5 Flash)
- ✅ Real-time AI answer evaluation with per-question scoring and feedback
- 📊 Results, analytics, and full interview history with search/filter/sort
- 🧾 Downloadable, hiring-style PDF interview reports (jsPDF)
- 👤 Profile page with avatar upload and computed stats (best/average score,
  companies practiced, skills detected)
- ⚙️ Account settings: profile info, password change, logout-from-all-devices,
  and interview preferences (default company, difficulty, question count)
- 🔔 In-app notifications for resume upload, AI analysis, interview
  completion, and report generation
- 🛡️ Admin dashboard with platform-wide stats and Recharts visualizations
- 🌗 Full dark/light mode
- ⚡ Route-based code splitting, skeleton loaders, and toast notifications
- 🧯 Dedicated 404 / 500 / network-error / session-expired / unauthorized
  states, plus a React error boundary
- ♿ Semantic HTML, ARIA labels/roles, and keyboard-accessible focus states

## Tech stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------- |
| Frontend       | React 19 + Vite, Tailwind CSS, React Router, Axios, Recharts, jsPDF |
| Backend        | Node.js, Express.js                               |
| Database       | MongoDB Atlas (Mongoose)                          |
| Auth           | JWT (with token-versioning for session invalidation) |
| AI             | Google Gemini 2.5 Flash API                       |
| Resume parsing | Python microservice (PyMuPDF, python-docx)        |
| Deployment     | Vercel (frontend), Render (backend)                |

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
│   └── src/
│       ├── controllers/       # Request handlers
│       ├── middleware/        # Auth, validation, error/timeout handling
│       ├── models/            # Mongoose schemas
│       ├── routes/            # Route → controller wiring
│       ├── services/          # AI/notification/business-logic services
│       └── utils/              # Small stateless helpers
├── ai-service/                # Python resume parser (spawned by backend)
├── render.yaml                # Render deployment blueprint (backend)
└── README.md
```

> **Note:** depending on how you cloned/downloaded this repo, everything
> above may sit one level deeper, inside an outer `InterviewIQ/` folder (i.e.
> `InterviewIQ/InterviewIQ/backend` instead of `InterviewIQ/backend`). If
> that's the case for you, either flatten it by moving the inner folder's
> contents up one level, or just remember to `cd` in one extra level — and
> if you're deploying, make sure `render.yaml`'s `rootDir` and Vercel's
> "Root Directory" setting match whichever layout you actually have.

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

Copy each `.env.example` to `.env` and fill in real values — **never commit
a real `.env` file.**

**`backend/.env`**
```bash
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```
`CLIENT_URL` accepts a comma-separated list, useful when the frontend has
both a production domain and Vercel preview deployments.

Get a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas and a
free Gemini API key at https://aistudio.google.com/apikey.

> **MongoDB Atlas note:** in Atlas, go to **Network Access** and add
> `0.0.0.0/0` ("Allow Access From Anywhere") to the IP Access List. Hosting
> providers like Render don't have a fixed IP, so restricting to a single
> address will cause connection failures in production.

**`frontend/.env`**
```bash
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

## API reference

| Method | Route | Auth | Description |
| ------ | ----- | :--: | ----------- |
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
- `render.yaml` at the repo root defines the service, using Render's
  Blueprint feature (`New → Blueprint`, pick this repo).
- `rootDir` in `render.yaml` must point at wherever `backend/` actually sits
  in your repo — a plain `backend` for a flat layout, or something like
  `InterviewIQ/backend` if your checkout has the extra nested folder
  mentioned above.
- Set `MONGO_URI`, `CLIENT_URL`, and `GEMINI_API_KEY` as environment
  variables in the Render dashboard when prompted (they're marked
  `sync: false` in the blueprint so Render asks for them rather than reading
  committed values).
- Make sure MongoDB Atlas's Network Access list includes `0.0.0.0/0` —
  otherwise Render's servers can't reach your database.

**Frontend → Vercel**
- Import the repo into Vercel and set **Root Directory** to wherever
  `frontend/` actually sits (same nesting caveat as above).
- `vercel.json` handles SPA rewrites so client-side routes don't 404 on
  refresh.
- Set `VITE_API_URL` to your deployed Render backend's `/api` URL, e.g.
  `https://interviewiq-api-ejq8.onrender.com/api`.
- Once both are live, update `CLIENT_URL` on Render to your real Vercel URL
  so CORS allows the deployed frontend to call the deployed backend.

## Future improvements

- WebSocket-based live notifications instead of polling
- Voice-based interview answers with speech-to-text
- Team/organization accounts for bootcamps and universities
- Configurable question banks per company beyond the built-in five modes
- Automated test suite (Jest/Vitest + Supertest) and CI pipeline

## Contributing

This is primarily a personal portfolio project, but issues and PRs are
welcome:

1. Fork the repo and create a feature branch
2. Keep changes scoped and consistent with the existing code style
3. Open a PR describing what changed and why

## License

[ISC](https://opensource.org/licenses/ISC) — free to use and adapt for your
own learning or portfolio.
