# 🧠 Smart Study Ecosystem

A full-stack, production-grade study dashboard built with React + Vite (frontend) and Node.js + Express (backend). Features glassmorphism UI, Framer Motion animations, Pomodoro timer, task management, notes, and analytics.

---

## 📁 Project Structure

```
smart-study-ecosystem/
├── backend/
│   ├── server.js          # Express REST API
│   └── package.json
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api.js
        ├── context/
        │   └── AppContext.jsx
        ├── components/
        │   ├── Sidebar.jsx
        │   └── FocusTimer.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── Tasks.jsx
            ├── Notes.jsx
            └── Analytics.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

---

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

The API will be available at: **http://localhost:3001**

For development with auto-reload:
```bash
npm run dev
```

---

### 2. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will open at: **http://localhost:5173**

> The Vite dev server proxies all `/tasks`, `/notes`, and `/stats` requests to the backend automatically — no CORS issues.

---

## 🔌 API Endpoints

| Method | Endpoint        | Description              |
|--------|----------------|--------------------------|
| GET    | /tasks          | Fetch all tasks          |
| POST   | /tasks          | Create a new task        |
| PUT    | /tasks/:id      | Update task (toggle etc) |
| DELETE | /tasks/:id      | Delete a task            |
| GET    | /notes          | Fetch all notes          |
| POST   | /notes          | Create/upsert a note     |
| PUT    | /notes/:id      | Update a note            |
| GET    | /stats          | Get streak & stats       |
| PUT    | /stats          | Update stats             |

---

## ✨ Features

- **Dashboard** — Live stats, progress bars, weekly chart, streak tracking
- **Task Manager** — Add/toggle/delete tasks with category filtering
- **Notes** — Auto-saving rich text notes with word count
- **Analytics** — Completion rate, bar charts, productivity score
- **Focus Timer** — Floating Pomodoro timer (25/5/15 min modes)
- **Responsive** — Sidebar collapses on mobile with slide-in drawer
- **Glassmorphism UI** — Blur, transparency, gradient mesh background
- **Framer Motion** — Page transitions, staggered list animations, spring physics

---

## 🎨 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, Framer Motion |
| Styling   | Tailwind CSS, custom CSS vars |
| Backend   | Node.js, Express              |
| Storage   | In-memory (arrays)            |
| Icons     | Lucide React                  |
| Fonts     | Syne (display), DM Sans (body)|

---

## 📦 Production Build

```bash
cd frontend
npm run build
# Output in frontend/dist/
```
