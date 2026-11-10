# Safe Water Web 💧

A water-safety and hydration awareness web application. The project combines a React frontend with an Express API and MongoDB persistence to provide account-based dashboards and community information.

**Live application:** https://safe-water-web.onrender.com  
**Repository:** https://github.com/ambatitharunsai-tech/safe-water-web

## Features

- **Account access:** registration and login using bcrypt password hashing and signed JWTs.
- **Hydration dashboard:** tools for tracking daily water intake and reviewing progress.
- **Water-safety checklist:** interactive reminders for safer water handling and storage.
- **Community alerts:** authenticated users can view and submit water-safety alerts.
- **AI assistant:** an optional Gemini-powered chat endpoint; without a Gemini key the API returns a basic offline guidance response.
- **Settings and profile data:** user-specific dashboard settings stored by the backend.
- **Awareness content:** educational pages, local contacts and water-awareness information.

Feature availability and stored information depend on the configured backend and database.

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| UI | Tailwind CSS, Framer Motion, Three.js / React Three Fiber, Lucide |
| Backend | Node.js, Express 5 |
| Database | MongoDB |
| Authentication | bcryptjs, JSON Web Tokens |
| Deployment | Render |

## Architecture

```text
React + TypeScript frontend (Vite)
             |
             | HTTP / JSON
             v
Express API (backend/server.js)
   ├── Authentication endpoints
   ├── User settings endpoints
   ├── Community alerts endpoints
   ├── Optional Gemini assistant
   └── Static frontend hosting in production
             |
             v
MongoDB
```

## Local development

### Requirements

- Node.js version supported by the installed Vite release
- npm
- A MongoDB database (local or MongoDB Atlas)

### 1. Clone and install

```bash
git clone https://github.com/ambatitharunsai-tech/safe-water-web.git
cd safe-water-web
npm install
cd backend
npm install
cd ..
```

### 2. Configure the backend

Create the environment file:

```bash
cp backend/.env.example backend/.env
```

Configure the values in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
MONGODB_DB=safe-water-web
JWT_SECRET=replace-with-a-long-random-secret
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
GEMINI_API_KEY=your-gemini-api-key
```

- `MONGODB_URI` connects the service to MongoDB.
- `MONGODB_DB` selects the database (defaults to `safe-water-web` in the example).
- `JWT_SECRET` signs authentication tokens. Set a long, unique value.
- `PORT` controls the backend port.
- `FRONTEND_URL` configures the allowed production frontend origin.
- `GEMINI_API_KEY` is optional and enables the Gemini chat integration.

Never commit `backend/.env` or real credentials.

### 3. Start development servers

Terminal 1 – backend:

```bash
cd backend
npm run dev
```

Terminal 2 – frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173).

## API overview

The backend provides the following main API groups:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | API/database health |
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Authenticate and issue a JWT |
| `GET` | `/api/auth/me` | Read the authenticated user |
| `GET`, `POST` | `/api/settings` | Read or update user settings |
| `GET`, `POST` | `/api/alerts` | Read or create community alerts |
| `POST` | `/api/ai/chat` | Send a message to the optional AI assistant |

Protected endpoints require an `Authorization: Bearer <token>` header. See `backend/server.js` for request validation and response details.

## Render deployment

The root `package.json` includes deployment scripts:

- **Build:** `npm run render-build`
- **Start:** `npm run start`

The build script builds the frontend and installs production backend dependencies. The backend serves the generated `dist/` directory in production.

Configure `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `NODE_ENV=production`, and (when using a separate frontend origin) `FRONTEND_URL` in the Render service environment. Add `GEMINI_API_KEY` only when enabling the Gemini integration.

## Security notes

- Use a strong, unique `JWT_SECRET` in production; the development fallback is not suitable for deployment.
- Keep database credentials and AI keys in Render's secret environment settings.
- Restrict MongoDB network access to trusted sources where practical.
- Configure `FRONTEND_URL` to the expected production origin.
- Do not treat an AI-generated response as medical advice or a substitute for local water-quality testing and public-health guidance.

## License

See the repository's license file, if present, for reuse terms.
