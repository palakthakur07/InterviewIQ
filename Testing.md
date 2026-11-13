# Test plan

This document describes how InterviewIQ is tested: what is covered, how each area is tested, how to run it, and how defects are handled.

## 1. Scope

| Area | In scope now | Not covered yet |
| --- | --- | --- |
| Auth API (`/api/auth/signup`, `/login`, `/me`) | Functional, validation, boundary, negative, security (JWT) | Rate limiting |
| Resume parser (Python) | Keyword matching, section splitting, education / project parsing, PDF and DOCX end to end | Scanned / image-only resumes |
| Login UI | Page load, client-side validation, wrong credentials, successful login | Signup, dashboard and interview flows |
| Service health and load | Health endpoint and login rejection under 10 virtual users | Authenticated flows, ramped load |
| Resume, interview, admin, notification APIs | None | All of it (see overall coverage in the README) |

## 2. Test approach

- **API tests (Jest + Supertest):** run against an in-memory MongoDB, so no real data is touched.
- **Unit and integration tests (pytest):** the parser functions are tested directly, plus end to end with generated PDF and DOCX files.
- **Browser smoke tests (Playwright):** the backend is mocked at `http://localhost:5000/api`, so these tests are fast and deterministic.
- **Smoke and API checks against a running server:** `smoke.sh` (curl) and a Postman collection run with newman.
- **Load check (k6):** 10 virtual users for 30 seconds, thresholds on error rate and p95 latency.
- **Test design techniques:** equivalence partitioning (valid and invalid input classes), boundary values (password length, year ranges), negative testing (missing, malformed, expired and forged tokens) and error guessing (short keywords such as `C` and `Go`).

## 3. Environments

| Environment | Used for |
| --- | --- |
| Local machine | Jest, pytest, Playwright |
| GitHub Actions (Ubuntu) | All suites on every push and pull request |
| Docker Compose (API + MongoDB, in CI) | Smoke test, Postman collection and k6 against a real running stack |

## 4. Test cases

### 4.1 Auth API (Jest + Supertest, `backend/tests/auth.test.js`)

| ID | Endpoint | Scenario | Expected |
| --- | --- | --- | --- |
| API-01 | POST /signup | Valid name, email, password | 201, token returned, password not in response |
| API-02 | POST /signup | Email already registered | 409 |
| API-03 | POST /signup | Missing fields | 400 |
| API-04 | POST /signup | Invalid email; password too short or without a digit | 400 |
| API-05 | POST /login | Correct credentials | 200, token returned |
| API-06 | POST /login | Wrong password | 401 |
| API-07 | POST /login | Unknown email | 401, same generic message as wrong password (no user enumeration) |
| API-08 | POST /login | Missing fields | 400 |
| API-09 | GET /me | Valid token | 200, user returned |
| API-10 | GET /me | No token | 401 |
| API-11 | GET /me | Malformed token | 401 |
| API-12 | GET /me | Expired token | 401 |
| API-13 | GET /me | Token signed with the wrong secret | 401 |

### 4.2 Browser (Playwright, `frontend/e2e/login.spec.js`)

| ID | Scenario | Expected |
| --- | --- | --- |
| UI-01 | Open /login | Email field, password field and submit button visible |
| UI-02 | Submit an empty form | Stays on /login, no login request sent |
| UI-03 | Submit wrong credentials (401 mocked) | Alert shows "Invalid email or password", stays on /login |
| UI-04 | Submit valid credentials (200 mocked) | Redirected to /dashboard |

### 4.3 Resume parser (pytest, `ai-service/tests/test_resume_parser.py`)

| Group | What is checked |
| --- | --- |
| Keyword matching | Case-insensitive, whole-word only (`Java` not inside `JavaScript`), no duplicates, empty text; short terms (`C`, `Go`) do not match inside `C++` or ordinary words |
| Section splitting | Known headings found, punctuation tolerated, no headings, long lines containing a heading word are ignored |
| Skills, education, projects | Labels stripped, single characters dropped, graduation year taken from a range, title and description kept together |
| Text extraction | PDF and DOCX files are read |
| End to end | JSON output for PDF and DOCX, unsupported file type, empty document, output size limits |

### 4.4 Smoke, Postman and load

| ID | Check | Expected |
| --- | --- | --- |
| SM-01 | GET /api/health | 200, status ok |
| SM-02 | Sign up, log in, wrong password, /me without token (`smoke.sh`) | 201, 200, 401, 401 |
| PM-01 | Postman collection: signup, login, wrong password, /me with and without token | All assertions pass |
| LD-01 | k6: 10 virtual users, 30 s | Error rate below 1%, p95 below 800 ms |

## 5. Entry and exit criteria

- **Entry:** code builds and dependencies install (`npm ci`, `pip install`).
- **Exit (a change may be merged):** every CI job is green: backend, ai-service, e2e, docker-smoke-and-load.

## 6. Defect handling

1. Reproduce it and write a test or a minimal repro.
2. Open a GitHub Issue with steps to reproduce, expected result and actual result.
3. Fix it, add a regression test, and reference the issue in the commit or pull request (`Fixes #N`).
4. Confirm CI is green, then close the issue.

Example: the parser defects found by pytest (issues for `find_matches`, `parse_education_section` and `parse_projects_section`).

## 7. Known gaps and next steps

- Overall backend coverage is about 26% because only the auth module is tested so far. Next: tests for the resume, interview and notification endpoints.
- Browser tests cover login only. Next: signup and the dashboard.
- The k6 test does not use an authenticated flow. Next: a login and `/me` scenario with ramped load.

## 8. How to run

See the Testing section of the [README](README.md).