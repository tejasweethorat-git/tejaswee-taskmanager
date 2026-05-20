# TaskFlow — Team Task Manager

A full-stack team task management web application with role-based access control (Admin / Member).

---

## Description

TaskFlow is a collaborative task management platform built for teams. It supports project creation, task assignment, progress tracking, activity logging, and team management — all secured with JWT authentication and role-based permissions.

---

## Tech Stack

| Layer          | Technology                  |
|----------------|-----------------------------|
| Frontend       | React 18 + Vite + CSS-in-JS |
| Backend        | Node.js + Express.js        |
| Auth           | JWT (JSON Web Tokens)       |
| Database       | SQLite                      |
| Deployment     | Railway                     |

---

## Features

- Authentication — Signup, Login, Logout, Reset Password
- Role-Based Access — Admin vs Member permissions
- Project Management — Create, edit, delete, assign members
- Task Management — Create, assign, track status, add comments
- Dashboard — Stats, progress indicators, overdue alerts
- Team Management — View progress, change roles, remove members
- Reports and Activity Logs — Full audit trail of all actions

---

## Authentication & Role-Based Access

### Roles

| Role   | Permissions                                          |
|--------|------------------------------------------------------|
| Admin  | Full access — manage projects, tasks, users, roles   |
| Member | View assigned tasks, update task status, add comments |

---

## REST API Endpoints

### Auth — `/api/auth`

| Method | Endpoint    | Access | Description                  |
|--------|-------------|--------|------------------------------|
| POST   | /signup     | Public | Register a new user          |
| POST   | /login      | Public | Login and receive JWT        |
| GET    | /me         | Auth   | Get current logged-in user   |
| PUT    | /profile    | Auth   | Update name, email, bio      |
| PUT    | /password   | Auth   | Change password              |

### Projects — `/api/projects`

| Method | Endpoint | Access | Description                                          |
|--------|----------|--------|------------------------------------------------------|
| GET    | /        | Auth   | Get all projects (Admin: all, Member: assigned only) |
| POST   | /        | Admin  | Create a new project                                 |
| PUT    | /:id     | Admin  | Update project details                               |
| DELETE | /:id     | Admin  | Delete a project                                     |

### Tasks — `/api/tasks`

| Method | Endpoint      | Access | Description                                       |
|--------|---------------|--------|---------------------------------------------------|
| GET    | /             | Auth   | Get all tasks (Admin: all, Member: assigned only) |
| POST   | /             | Admin  | Create a new task                                 |
| PUT    | /:id          | Auth   | Admin: full update. Member: status update only    |
| DELETE | /:id          | Admin  | Delete a task                                     |
| POST   | /:id/comments | Auth   | Add a comment to a task                           |
| GET    | /logs         | Auth   | Fetch recent activity logs                        |

### Users — `/api/users`

| Method | Endpoint  | Access | Description              |
|--------|-----------|--------|--------------------------|
| GET    | /         | Admin  | List all team members    |
| PUT    | /:id/role | Admin  | Change a user's role     |
| DELETE | /:id      | Admin  | Remove a member          |

---

## Team Accounts

| Name             | Email                    | Password  | Role   |
|------------------|--------------------------|-----------|--------|
| Arjun Sharma     | arjun@taskflow.com       | arjun@123 | Admin  |
| Tejaswee Thorat  | tejaswee@taskflow.com    | tejas@123 | Member |
| Rohan Kulkarni   | rohan@taskflow.com       | rohan@123 | Member |
| Priya Desai      | priya@taskflow.com       | priya@123 | Member |

---

## Local Setup Instructions

### Prerequisites

- Node.js v18+
- npm v9+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Set up the Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Set up the Frontend (open a new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

The database file (`taskflow.db`) is created automatically on first run and loaded with seed data.

---

## Project Structure

```
taskflow/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── App.jsx            # Full application (all components)
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/                   # Express REST API
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── db/
│   │   │   ├── init.js        # Database setup & schema
│   │   │   └── seed.js        # Seed data
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT verification + role check
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

1. Push this repository to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add two services: `frontend` and `backend`
4. In each service, set the environment variables from `.env.example`
5. Railway auto-detects Node.js — click Deploy

---

## Validation Implemented

- All required fields (name, email, password, title, project) are validated on the backend before processing
- Email uniqueness is checked at signup — duplicate emails are rejected
- Password must be at least 6 characters when changing via the reset password flow
- Task status updates from Members are restricted to valid values: `To Do`, `In Progress`, `Completed`
- Role changes are validated to only allow `Admin` or `Member`
- An Admin cannot delete their own account
- JWT token is verified on every protected route — invalid or expired tokens are rejected with 401

---

## Author

Name: Tejaswee Thorat
Email: tejasweethorat76@gmail.com
Project: Team Task Manager
