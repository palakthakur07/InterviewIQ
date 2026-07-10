# InterviewIQ

AI-powered, resume-aware mock interview platform. Upload a resume, get a tailored
technical interview, receive real-time scored feedback, and walk away with a
hiring-style PDF report.

## Status

- [x] Frontend scaffold (Vite + React + Tailwind + React Router)
- [x] Landing page (Navbar, Hero, Features, How it works, Company mode, Footer)
- [x] Authentication (JWT, signup/login, protected routes)
- [x] Dashboard & Resume Upload (parsing via PyMuPDF / python-docx)
- [x] AI interview engine (Gemini 2.5 Flash) + Interview page
- [ ] Results / report page (PDF export)

## Stack

| Layer          | Technology                              |
| -------------- | ---------------------------------------- |
| Frontend       | React + Vite, Tailwind CSS, React Router, Axios |
| Backend        | Node.js, Express.js                      |
| Database       | MongoDB Atlas (free tier)                |
| AI             | Google Gemini 2.5 Flash API              |
| Resume parsing | PyMuPDF, python-docx (ai-service)        |
| Auth           | JWT                                      |
| Charts         | Recharts                                 |
| PDF reports    | jsPDF                                    |
| Deployment     | Vercel (frontend), Render (backend)      |

## Project structure

```
InterviewIQ/
├── frontend/     # React + Vite + Tailwind app
├── backend/      # Express API — auth, resume upload/parsing orchestration
├── ai-service/   # Python resume parser (PyMuPDF / python-docx), spawned by backend
└── README.md
```

## Getting started

**1. AI service (Python resume parser dependencies)**
```bash
cd ai-service
pip install -r requirements.txt --break-system-packages
```
No server to run — the backend spawns `resume_parser.py` as a subprocess.

**2. Backend**
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev
```
Runs on http://localhost:5000. Health check: `GET /api/health`.
Get a free Gemini API key at https://aistudio.google.com/apikey.

**3. Frontend**
```bash
cd frontend
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:5000/api
npm install
npm run dev
```
Visit http://localhost:5173.

## API reference (so far)

| Method | Route                  | Auth | Description                          |
| ------ | ----------------------- | ---- | ------------------------------------- |
| POST   | `/api/auth/signup`      | –    | Create account                        |
| POST   | `/api/auth/login`       | –    | Log in, returns JWT                   |
| GET    | `/api/auth/me`          | ✔    | Current user                          |
| POST   | `/api/resumes/upload`   | ✔    | Upload + parse a PDF/DOCX resume      |
| GET    | `/api/resumes`          | ✔    | List the current user's resumes       |
| GET    | `/api/resumes/:id`      | ✔    | Get one resume's extracted data       |
| POST   | `/api/interviews/start` | ✔    | Start a new interview (generates questions) |
| GET    | `/api/interviews/active` | ✔   | Get the current in-progress session, if any |
| GET    | `/api/interviews/history` | ✔  | List completed interview reports      |
| GET    | `/api/interviews/session/:id` | ✔ | Get full session detail (resume/continue) |
| POST   | `/api/interviews/session/:id/answer` | ✔ | Submit + evaluate an answer, advance |
| POST   | `/api/interviews/session/:id/answer/:answerId/retry` | ✔ | Retry a failed evaluation |
| PATCH  | `/api/interviews/session/:id/save-progress` | ✔ | Save a draft answer (Save & Exit) |
| POST   | `/api/interviews/session/:id/finish` | ✔ | Finalize session into an Interview report |
| GET    | `/api/interviews/:id`   | ✔    | Get one finished interview report     |

## Design notes

The landing page uses a dark-first "interview terminal" visual language:
- Display font: Space Grotesk · Body: Inter · Data/mono: JetBrains Mono
- Signal color: indigo-violet (#6E56CF) with a cyan accent (#33C3F0) and mint
  (#34D399) for success/score states
- The hero's signature element is a live-typing mock interview panel that
  plays out a question → answer → score cycle, demonstrating the product's
  actual mechanic instead of a generic screenshot
- Full dark/light mode via a `ThemeContext` + Tailwind `class` strategy
