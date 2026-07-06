# ✨ Inspi.Ai

**Inspi.Ai** is a full-stack, AI-powered companion web application that combines real-time conversational AI with a private, reflective personal space — giving users a place to talk, think, write, and plan, all wrapped in a calm, night-sky aesthetic.

Built as a complete MERN-adjacent stack (MongoDB, Express, React, Node) with Google's Gemini API at its core, Inspi.Ai demonstrates end-to-end product engineering: authentication, persistent multi-session chat, AI integration, and a personal productivity/wellness suite.

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-black?style=for-the-badge)](https://inspi-ai-1.onrender.com)
[![Open Website](https://img.shields.io/badge/👉_CLICK_HERE_TO_OPEN_WEBSITE-ff4d4d?style=for-the-badge)](https://inspi-ai-1.onrender.com)

---

### 🛠️ Built With (Technologies Used)

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Render](https://img.shields.io/badge/Render-000000?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Author](#author)
- [License](#license)

---

## Overview

Inspi.Ai is designed around a single idea: an AI companion should feel less like a tool and more like a space. The product is split into two experiences that share one identity:

1. **Chat** — a persistent, multi-session conversation interface powered by Google's Gemini model, where every conversation is saved and retrievable, just like a modern AI chat product.
2. **Personal Space** — a private area (accessible only via the user's own profile) containing a mood-based ambient sound player, a personal diary that can optionally consult the AI for reflection, and a daily to-do list organized by date.

The entire experience is authenticated end-to-end: accounts are real, passwords are hashed, sessions are token-based, and user data (profile, chats, diary entries, tasks) is persisted server-side rather than simulated client-side.

---

## Features

### Authentication & Identity
- Email/password signup and login backed by MongoDB
- Passwords hashed with **bcrypt** — never stored in plain text
- Stateless session management via **JWT** (JSON Web Tokens)
- Editable profile photo, stored as part of the user record
- Persistent sessions across browser refreshes

### Conversational AI
- Real-time chat powered by the **Gemini 2.5 Flash** model
- Multi-turn context awareness (full conversation history passed per request)
- Multiple, independently saved chat sessions with auto-generated titles
- "Previous chats" history panel for resuming any past conversation
- Live typing indicator while the AI is composing a response
- A defined system persona so responses stay consistent in tone

### Personal Space
- **Mood-based ambient sound player** — Calm Night, Focus Flow, Morning Energy, Rain & Quiet
- **Personal Diary** — private journaling with an optional "Ask Inspi.Ai" action that sends the entry to the AI and stores its reflection alongside it
- **Daily To-Do List** — tasks grouped and labeled by date (Today, Yesterday, or the exact date), with completion tracking

### UI/UX
- Collapsible left navigation rail with session history
- Fully responsive, dark, "night sky" visual theme with animated starfield
- Component-level loading and typing states for perceived performance
- Clean separation between public (auth) and protected (chat/personal space) routes

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 (Vite) | Component-based SPA with fast HMR dev experience |
| **Routing** | React Router v6 | Client-side routing with protected/public route guards |
| **Styling** | Tailwind CSS | Utility-first styling for a consistent design system |
| **Icons** | lucide-react | Lightweight, consistent icon set |
| **State Management** | React Context API | `AuthContext`, `ChatContext`, `LockerContext` — no external state library needed |
| **Backend Runtime** | Node.js (ES Modules) | JavaScript runtime for the API server |
| **Backend Framework** | Express.js | REST API routing and middleware |
| **Database** | MongoDB (via Mongoose) | Persistent storage for user accounts and profiles |
| **Authentication** | bcryptjs + jsonwebtoken | Password hashing and stateless auth tokens |
| **AI Provider** | Google Gemini API (`@google/generative-ai`) | Conversational AI generation |
| **Client-side Persistence** | Web `localStorage` | Chat sessions, diary entries, and to-do items scoped to the browser |
| **Deployment Target** | Render (Web Service + Static Site) | Backend API and frontend static build hosting |
| **Version Control** | Git + GitHub | Source control and CI trigger for deployment |

---

## Architecture

```
┌──────────────────┐        HTTPS/JSON        ┌───────────────────┐
│                  │ ────────────────────────► │                   │
│   React Client    │                            │   Express Server  │
│   (Vite + Router) │ ◄──────────────────────── │   (Node.js API)   │
│                  │        JWT-protected        │                   │
└──────────────────┘                            └─────────┬─────────┘
                                                            │
                                     ┌──────────────────────┼───────────────────────┐
                                     ▼                                             ▼
                          ┌────────────────────┐                     ┌────────────────────┐
                          │   MongoDB (Atlas)   │                     │  Google Gemini API   │
                          │  Users / Auth data   │                     │  Chat generation     │
                          └────────────────────┘                     └────────────────────┘
```

**Design principles applied:**
- **Separation of concerns** — the frontend never talks to Gemini or MongoDB directly; it only calls the backend's REST endpoints. The API key never reaches the browser.
- **Stateless authentication** — the server issues a signed JWT on login/signup; the client stores it and attaches it as a Bearer token on subsequent requests. No server-side session store is required.
- **Context-driven frontend state** — each domain of the app (auth, chat, personal space) owns its own React Context, keeping components declarative and free of prop-drilling.

---

## Project Structure

```
inspi-ai/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.jsx        # Login / signup form
│   │   │   ├── ChatWindow.jsx      # Chat message list + composer
│   │   │   ├── Sidebar.jsx         # Left nav: brand, profile, chat history
│   │   │   ├── SparkMark.jsx       # Brand mark / logo component
│   │   │   ├── HopeLocker.jsx      # Personal Space container (mood + tabs)
│   │   │   ├── PersonalDiary.jsx   # Diary write/save/ask-AI section
│   │   │   └── DailyTodoList.jsx   # Date-grouped task list
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state, backed by the server
│   │   │   ├── ChatContext.jsx     # Multi-session chat state
│   │   │   └── LockerContext.jsx   # Diary + to-do state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── LockerPage.jsx      # Personal Space route
│   │   ├── services/
│   │   │   ├── api.js              # Gemini chat requests
│   │   │   └── authApi.js          # Auth requests (signup/login/me/avatar)
│   │   └── App.jsx                 # Route definitions + provider tree
│   └── vite.config.js
│
├── server/                         # Express backend
│   ├── models/
│   │   └── User.js                 # Mongoose user schema
│   ├── routes/
│   │   └── auth.js                 # /api/auth/* endpoints
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── db.js                       # MongoDB connection
│   └── index.js                    # App entry point, Gemini chat route
│
├── render.yaml                     # Infrastructure-as-code for Render deployment
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier works)
- A Gemini API key ([Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone and install
```bash
git clone https://github.com/<your-username>/inspi-ai.git
cd inspi-ai
```

**Backend:**
```bash
cd server
npm install
cp .env.example .env   # then fill in the values — see below
npm run dev
```

**Frontend** (in a separate terminal):
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, with the API running at `http://localhost:5000` and proxied through Vite.

---

## Environment Variables

Set these in `server/.env` (see `server/.env.example` for a template):

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key for Google's Generative AI (Gemini) service |
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Long, random string used to sign authentication tokens |
| `PORT` | Port the backend listens on (default `5000`) |
| `CLIENT_ORIGIN` | The frontend's origin, used for CORS |

---

## API Reference

All endpoints are prefixed with the backend's base URL (e.g. `http://localhost:5000`).

### Auth

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | No | Create a new account — `{ name, email, password }` |
| `POST` | `/api/auth/login` | No | Authenticate — `{ email, password }`, returns `{ token, user }` |
| `GET` | `/api/auth/me` | Yes (Bearer token) | Returns the current user's profile |
| `PATCH` | `/api/auth/avatar` | Yes (Bearer token) | Updates the stored profile photo |

### Chat

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/chat/gemini` | No | Sends `{ message, history }`, returns `{ reply }` from Gemini |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Basic liveness check, returns `{ ok: true }` |

---

## Deployment

This project is deployed as two independent Render services:

| Service | Type | Root Directory | Build Command | Start/Publish | Live URL |
|---|---|---|---|---|---|
| `inspi-ai` | Web Service | `server` | `npm install` | `npm start` | `https://inspi-ai.onrender.com` |
| `inspi-ai-1` | Static Site | `client` | `npm install && npm run build` | `dist` | `https://inspi-ai-1.onrender.com` |

A `render.yaml` blueprint is included at the project root for one-step provisioning of both services. Secrets (`GEMINI_API_KEY`, `MONGODB_URI`, `JWT_SECRET`) are intentionally excluded from the blueprint and are configured directly in the Render dashboard.

The frontend's API service files (`client/src/services/api.js` and `authApi.js`) point directly at the live backend URL above, and the backend's `CLIENT_ORIGIN` environment variable is set to the live frontend URL for CORS.

---

## Security Notes

- Passwords are never stored or logged in plain text — only bcrypt hashes are persisted.
- The Gemini API key lives exclusively on the server; it is never exposed to the client bundle.
- JWTs are short-lived by design intent and should be paired with HTTPS in production.
- CORS is explicitly scoped to the configured `CLIENT_ORIGIN` rather than left open (`*`).

---



The current release is optimized for desktop/web usage. The following enhancements are planned for future iterations:

### Platform & Accessibility
- [ ] **Mobile-responsive UI** — the current layout is designed and tested for desktop viewports only; a dedicated responsive breakpoint system (sidebar → bottom nav, stacked layouts) is planned for mobile and tablet
- [ ] Progressive Web App (PWA) support for installable, app-like mobile experience
- [ ] Dark/light theme toggle

### Authentication & Security
- [ ] **Real email verification** — confirmation link/OTP sent on signup before an account is fully activated, preventing fake or mistyped email registrations
- [ ] Google OAuth sign-in (one-tap login)
- [ ] Password reset via email
- [ ] Rate limiting and brute-force protection on auth endpoints

### AI & Content
- [ ] **AI image generation** — allow users to generate and attach images within chat or diary entries
- [ ] Voice input and text-to-speech for AI responses
- [ ] Smarter, sentiment-aware AI responses tailored to diary/mood context

### Personal Space Enhancements
- [ ] **Fully working mood-based sound library** — bundled, licensed ambient tracks shipped with the app (Calm Night, Focus Flow, Morning Energy, Rain & Quiet) instead of requiring manually-added files
- [ ] Recurring/repeating to-do items and reminders
- [ ] Mood tracking with visual trends over time (weekly/monthly charts)

### Engagement & Notifications
- [ ] **Time-based updates and reminders** — daily check-in nudges, streaks, and gentle reminders to journal or complete tasks
- [ ] Push notifications (web + mobile)
- [ ] Weekly personal summary/recap generated by the AI

### Data & Infrastructure
- [ ] Server-side persistence for chat history, diary entries, and to-do items (currently client-side via `localStorage`)
- [ ] Data export (download your diary/quotes/tasks as PDF or JSON)
- [ ] Automated test coverage (Jest/Vitest + Supertest)
- [ ] CI/CD pipeline with GitHub Actions for automated testing before deployment

---

## Author

**Prerna Parashari**

Full-stack developer with hands-on experience building end-to-end web applications — from database schema design and REST API architecture to responsive, production-grade frontend interfaces. Inspi.Ai was independently designed, built, and deployed as a demonstration of complete product ownership: authentication systems, third-party AI integration, cloud database management, and CI-driven deployment on Render.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/prernaparashari)

---

## License

This project is provided as-is for educational and portfolio purposes.

---

<p align="center">
  <strong>Built with React, Node.js, MongoDB, and Google Gemini.</strong><br/>
  <sub>Designed & developed by Prerna Parashari</sub>
</p>
