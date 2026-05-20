# TaskFlow — Team Task Manager

A full-stack team task management web application with role-based access control (Admin / Member).

## Tech Stack
- **Frontend**: React 18 + Vite + CSS-in-JS
- **Backend**: Node.js + Express + SQLite (via better-sqlite3)
- **Auth**: JWT (JSON Web Tokens)
- **Deploy**: Railway-ready

---

## Team Accounts (Seed Data)

| Name | Email | Password | Role |
|---|---|---|---|
| Arjun Sharma | arjun@taskflow.com | arjun@123 | Admin |
| Tejaswee Thorat | tejaswee@taskflow.com | tejas@123 | Member |
| Rohan Kulkarni | rohan@taskflow.com | rohan@123 | Member |
| Priya Desai | priya@taskflow.com | priya@123 | Member |

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Setup Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173  
Backend API runs on: http://localhost:5000

---

## Project Structure
```
taskflow/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── App.jsx    # Full application (all components)
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/           # Express REST API
│   ├── src/
│   │   ├── index.js         # Entry point
│   │   ├── db/seed.js       # Database seed
│   │   ├── middleware/auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── users.js
│   │       ├── projects.js
│   │       └── tasks.js
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Railway Deployment

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add two services: `frontend` and `backend`
4. Set environment variables from `.env.example`
5. Deploy!

---

## Features
- ✅ Authentication (Signup / Login / Logout / Reset Password)
- ✅ Role-based access: Admin vs Member
- ✅ Project management (create, edit, delete, assign members)
- ✅ Task management (create, assign, status tracking, comments)
- ✅ Dashboard with stats, progress, overdue alerts
- ✅ Team management (view progress, change roles, remove members)
- ✅ Reports & Activity logs
- ✅ Kanban board + List view for tasks
- ✅ Fullscreen mode
