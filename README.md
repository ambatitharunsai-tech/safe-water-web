# Safe Water Web 💧

An interactive web platform designed to promote awareness of safe drinking water, water contamination, hydration tracking, and responsible water management. Built as a cinematic, community-driven environmental awareness campaign.

## Features

- **🔐 Secure Authentication** — Register/Login with bcrypt password hashing and JWT tokens
- **💧 Hydration Tracker** — Daily water intake tracking with weekly velocity charts and monthly calendar heatmaps
- **✅ Safety Checklist** — Interactive daily water safety checklist with progress tracking
- **📡 Live Community Alerts** — Global real-time water safety alert feed shared across all users
- **🩺 Health Diagnostic AI** — Symptom-based waterborne illness risk assessment
- **💰 Cost Calculator** — Family water cost comparison (bottled vs. boiled vs. filtered)
- **📞 Local Contacts** — Emergency water/health service directory
- **📊 Survey Data** — Interactive data visualization from local Narasaraopeta water survey
- **🏆 Gamification** — Achievement badges (Hydration Hero, Safety Inspector, Pristine Storage)

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Styling | Tailwind CSS 3, Framer Motion |
| 3D | Three.js, React Three Fiber |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas |
| Auth | bcryptjs, JSON Web Tokens |
| Icons | Lucide React |

## Architecture

```
React + TypeScript Frontend (Vite)
        │
        │  REST API (/api/*)
        ▼
Express Backend (Node.js)
        │
        ├── Authentication
        │      ├── POST /api/auth/register
        │      ├── POST /api/auth/login
        │      ├── GET  /api/auth/me
        │      ├── bcrypt password hashing
        │      └── JWT (7-day expiry)
        │
        ├── Settings API
        │      ├── GET  /api/settings
        │      └── POST /api/settings
        │
        ├── Alerts API
        │      ├── GET  /api/alerts
        │      └── POST /api/alerts
        │
        ├── Health
        │      └── GET  /api/health
        │
        └── Static file serving (production)
        │
        ▼
MongoDB Atlas (Persistent Cloud Database)
   ├── users          (unique email index)
   ├── userSettings   (unique user_id index)
   └── alerts         (created_at descending index)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | No | Server and database health check |
| `POST` | `/api/auth/register` | No | Create new user account |
| `POST` | `/api/auth/login` | No | Login and receive JWT |
| `GET` | `/api/auth/me` | JWT | Get current authenticated user |
| `GET` | `/api/settings` | JWT | Get user's dashboard settings |
| `POST` | `/api/settings` | JWT | Update user's dashboard settings |
| `GET` | `/api/alerts` | JWT | Get latest 50 community alerts |
| `POST` | `/api/alerts` | JWT | Post a new community alert |

## Local Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- A free MongoDB Atlas account ([sign up here](https://www.mongodb.com/cloud/atlas/register))

### 1. Clone the Repository

```bash
git clone https://github.com/ambatitharunsai-tech/safe-water-web.git
cd safe-water-web
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=safe-water-web
JWT_SECRET=your-secret-key-here
PORT=3001
```

### 4. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account
2. Create a **Free Cluster (M0)**
3. Under **Security Quickstart**, create a database username and password
4. Under **Network Access**, click **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → **Node.js** and copy the connection string
6. Paste the connection string into `backend/.env` as `MONGODB_URI`

### 5. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend && node server.js

# Terminal 2: Start frontend
npm run dev
```

Visit `http://localhost:5173` to view the application.

## Production Deployment (Render)

### Build Command

```bash
npm run render-build
```

### Start Command

```bash
npm run start
```

### Required Environment Variables on Render

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB` | Database name (default: `safe-water-web`) |
| `JWT_SECRET` | Secret key for JWT signing (use a strong random string) |
| `NODE_ENV` | Set to `production` |
| `FRONTEND_URL` | Your Render app URL (for CORS) |

## Security

- Passwords are hashed with **bcryptjs** (10 salt rounds)
- Authentication uses **JWT** with 7-day expiry
- Email addresses are normalized (trimmed + lowercased)
- Input validation on all endpoints (name length, email format, password length)
- Duplicate email registration returns **409 Conflict**
- Password field is **never** returned to the frontend
- CORS is restricted in production via `FRONTEND_URL`
- No credentials are hardcoded or committed to the repository
- `.env` files are gitignored; only `.env.example` is tracked

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run oxlint |
| `npm run preview` | Preview production build locally |
| `npm run render-build` | Full build for Render deployment |
| `npm run start` | Start production backend server |

## Future Improvements

- Real-time WebSocket alerts (replace polling)
- Admin moderation panel for community alerts
- PDF export of health reports and cost analysis
- Push notifications for critical water alerts
- Leaderboard and gamification ranking system
- Multi-language support (Telugu, Hindi)
- Progressive Web App (PWA) support
