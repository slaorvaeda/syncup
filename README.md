# SyncUp

Realtime coaching feed app — coaches publish tips, announcements, and reminders; students and visitors browse the public feed; staff manage posts, notifications, and users with live Socket.IO updates.

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB |
| Cache | Redis (feed list caching) |
| Media | Cloudinary |
| Realtime | Socket.IO |
| Deploy | Railway (API), Vercel (web) |

**Live demo**

| Service | URL |
|---------|-----|
| API | https://syncup-production.up.railway.app |
| Web | https://syncup-lake.vercel.app |

---

## Table of contents

- [Assessment requirements](#assessment-requirements)
- [Architecture](#architecture)
- [User roles](#user-roles)
- [Frontend routes](#frontend-routes)
- [Socket.IO events](#socketio-events)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Deploy backend (Railway)](#deploy-backend-railway)
- [Deploy frontend (Vercel)](#deploy-frontend-vercel)
- [CORS](#cors)
- [API reference](#api-reference)
- [Testing](#testing)
- [Postman](#postman)

---

## Assessment requirements

> Based on the **SyncUp assessment** spec (Home + Admin, realtime feed, reusable UI) and the implemented codebase. Place `Syncup_Assessment.pdf` in the repo root for reviewers.

### Core features

| Requirement | Status | Notes |
|-------------|--------|--------|
| Public coaching feed (Home) | Done | `GET /feed` — no login required |
| Coach/admin publish & manage posts | Done | `/admin`, `/admin/posts`, create/edit |
| JWT authentication | Done | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| Roles: coach, student, admin | Done | Middleware `authorize()` |
| Comments on posts | Done | `GET/POST /feed/:feedId/comments` |
| Likes on posts | Done | `POST /feed/:feedId/like` (toggle) |
| Realtime updates (Socket.IO) | Done | See [Socket.IO events](#socketio-events) |
| Notifications (staff) | Done | Like/comment triggers; bell UI |
| MongoDB persistence | Done | Users, feeds, comments, likes, notifications |
| Redis caching | Done | Public feed list cached; cleared on writes |
| Input validation (Zod) | Done | Auth & feed validators |
| Pagination | Done | `?page=&limit=` on feed endpoints |
| Image/file upload | Done | Cloudinary via `/upload/image`, `/upload/file` |
| Health check | Done | `GET /health` — Mongo + Redis status |
| Rate limiting (auth) | Done | Login/register limits in production |
| Reusable UI components | Done | `components/common`, `feed`, `layout` |
| Skeleton loaders | Done | Feed grid, cards, comments |
| Next.js App Router structure | Done | `(public)` and `(admin)` route groups |
| Guest socket listeners | Done | Home feed updates without login |
| Deployed full stack | Done | Railway + Vercel |

### Frontend pages (assessment + extensions)

| Page | Route | Who |
|------|-------|-----|
| Home (public feed) | `/` | Everyone — read-only likes/comments for guests |
| Staff login | `/login` or `/admin` | Coach / admin sign-in & sign-up |
| Dashboard | `/admin` | Staff overview |
| All posts | `/admin/posts` | Coach (own) / admin (all) |
| Edit post | `/admin/posts/[feedId]` | Coach / admin |
| Notifications | `/notifications` | Staff |
| Profile | `/profile` | Staff |
| Users | `/users` | Admin only |

### Optional / bonus (implemented)

| Feature | Status |
|---------|--------|
| Dark / light theme | Done |
| Infinite scroll on feed | Done |
| Toast notifications (sonner) | Done |
| Socket reconnect + dedup | Done |
| Sentry (server, if `SENTRY_DSN` set) | Done |
| Winston request/error logging | Done |
| Jest unit + integration tests | Done |
| Admin edits any post; coach own posts only | Done |

---

## Architecture

```text
┌─────────────┐     HTTPS      ┌──────────────────┐
│   Vercel    │ ──────────────►│  Railway (API)   │
│  Next.js    │   REST + WS    │  Express + IO    │
│  client/    │◄──────────────►│  server/         │
└─────────────┘                └────────┬─────────┘
                                        │
                         ┌──────────────┼──────────────┐
                         ▼              ▼              ▼
                    MongoDB          Redis      Cloudinary
                   (documents)     (cache)      (media)
```

**Request flow**

1. Browser loads Next.js from Vercel.
2. API calls use `NEXT_PUBLIC_API_URL` (axios).
3. Socket.IO connects to the same API host (guest or authenticated).
4. Feed list reads Redis cache; writes clear cache and emit socket events.

---

## User roles

| Role | Register | Home feed | Like / comment | Create feed | Notifications | Users list |
|------|----------|-----------|----------------|-------------|---------------|------------|
| Guest | — | View + live updates | Read-only | — | — | — |
| Student | Yes | View + live updates | If logged in | — | — | — |
| Coach | Yes | View | Yes | Own posts | Yes | — |
| Admin | Yes | View | Yes | All posts | Yes | Yes |

---

## Frontend routes

| Route | Component area |
|-------|----------------|
| `/` | `HomePage` — public `FeedGrid` |
| `/login` | `LoginPage` — staff auth |
| `/admin` | `AdminPage` — dashboard |
| `/admin/posts` | `MyPostsPage` |
| `/admin/posts/:feedId` | `EditPostPage` |
| `/notifications` | `NotificationsPage` |
| `/profile` | `ProfilePage` |
| `/users` | `UsersPage` (admin) |

**Client folder layout**

```text
client/src/
├── app/              # Next.js routes (public) + (admin)
├── components/
│   ├── common/       # Button, Input, Skeleton, Alert, …
│   ├── feed/         # FeedGrid, FeedCard, CommentSection, …
│   ├── layout/       # AdminSidebar, PublicHeader, …
│   ├── auth/         # LoginForm, AdminAuthGuard, …
│   └── pages/        # HomePage, AdminPage, …
├── contexts/         # Auth, Socket, Theme, Notifications
├── hooks/            # useFeeds, useComments, useNotifications, …
├── lib/              # api, socket, routes, validation
└── constants/        # API_URL, SOCKET_EVENTS, feed enums
```

---

## Socket.IO events

| Event | Direction | Payload | Frontend usage |
|-------|-----------|---------|----------------|
| `feed:new` | Server → client | Full feed document | Prepend to home feed |
| `comment:new` | Server → client | `{ feedId, comment }` | Update comment count / list |
| `like:updated` | Server → client | `{ feedId, likesCount, liked }` | Update like count |
| `notification:new` | Server → client | Notification doc | Staff notification bell |
| `notification:read` | Server → client | Notification doc | Mark read in UI |
| `notification:all-read` | Server → client | `{ userId }` | Mark all read |

**Connection**

- Guests: connect without token (public feed listener).
- Authenticated: pass JWT in `socket.handshake.auth.token`.
- Client handles reconnect, event dedup, and refetch on reconnect (`SocketContext`, `lib/socket.js`).

**Server-only emit:** `feed:updated` (on PATCH feed) — not wired on client yet.

---

## Project structure

```text
sync-up/
├── client/                 # Next.js frontend (port 3000)
├── server/                 # Express API (port 3001)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── socket/
│   │   └── validators/
│   ├── tests/              # Jest unit + integration
│   └── docker-compose.yml  # Local Redis
├── README.md
└── Syncup_Assessment.pdf   # Add assessment PDF here (optional)
```

---

## Local development

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (`cd server && npm run redis:up` uses Docker)

### 1. Backend

```bash
cd server
cp .env.example .env   # then edit values
npm install
npm run redis:up       # optional: Docker Redis
npm run dev            # http://localhost:3001
```

### 2. Frontend

```bash
cd client
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

### 3. Health check

```bash
curl http://localhost:3001/health
```

---

## Environment variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `REDIS_URL` | Yes | Redis URL (`redis://127.0.0.1:6379` locally) |
| `JWT_SECRET` | Yes | Secret for auth tokens |
| `NODE_ENV` | Yes | `development` or `production` |
| `CORS_ORIGIN` | Yes | Comma-separated allowed frontend URLs |
| `CORS_ALLOW_VERCEL` | No | Default `true` — allows `https://*.vercel.app` previews |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary dashboard |
| `SENTRY_DSN` | No | Error monitoring |
| `FEED_CACHE_KEY` | No | Redis key prefix (default `feed`) |
| `FEED_CACHE_TTL` | No | Feed cache TTL in seconds (default `60`) |
| `LOGIN_RATE_MAX` | No | Max login attempts per window (default `5`) |
| `REGISTER_RATE_MAX` | No | Max register attempts per window (default `10`) |
| `PORT` | No | Default `3000` locally; Railway sets automatically |

**Example (local):**

```env
MONGO_URI=mongodb://localhost:27017/sync_up
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your-local-secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Client (`client/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend base URL (no trailing slash) |

**Local:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Production:**

```env
NEXT_PUBLIC_API_URL=https://syncup-production.up.railway.app
```

> Restart `npm run dev` after changing `.env.local`. Redeploy Vercel after changing production env vars.

---

## Production URLs

| Service | URL |
|---------|-----|
| API (Railway) | https://syncup-production.up.railway.app |
| Frontend (Vercel) | https://syncup-lake.vercel.app |

Update this table if your domains change.

---

## Deploy backend (Railway)

### 1. Connect repo

- [Railway](https://railway.com) → **New Project** → Deploy from GitHub
- Select repo: `slaorvaeda/syncup`
- **Root Directory:** `server`
- **Start Command:** `npm start`

### 2. Add databases

| Service | Action |
|---------|--------|
| **MongoDB** | Railway Mongo plugin **or** [MongoDB Atlas](https://www.mongodb.com/atlas) |
| **Redis** | Railway → **+ New** → **Redis** |

On the **API service**, reference Redis `REDIS_URL` (prefer private URL between services).

### 3. Set variables

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/sync_up
REDIS_URL=redis://...
JWT_SECRET=long-random-production-secret
CORS_ORIGIN=https://syncup-lake.vercel.app,http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 4. Public domain

**Settings** → **Networking** → **Generate Domain**  
Example: `syncup-production.up.railway.app`

### 5. Verify

```bash
curl https://syncup-production.up.railway.app/health
```

Expected: `"mongodb":{"status":"connected"}` and `"redis":{"status":"connected"}`.

### Railway troubleshooting

| Symptom | Fix |
|---------|-----|
| Crash loop, `injected env (0) from .env` | Set all variables in Railway **Variables** — `.env` is not deployed |
| `npm warn config production` | Harmless npm warning — ignore |
| Mongo/Redis errors | Check `MONGO_URI`, `REDIS_URL`, Atlas IP allowlist |

---

## Deploy frontend (Vercel)

1. [vercel.com](https://vercel.com) → **Import** → GitHub repo `syncup`
2. **Root Directory:** `client`
3. Framework: **Next.js** (auto-detected)
4. **Environment variable:**

```env
NEXT_PUBLIC_API_URL=https://syncup-production.up.railway.app
```

5. Deploy

### Vercel preview deployments

Preview URLs look like:

`https://syncup-xxxxx-slaorvaedas-projects.vercel.app`

The API allows any `https://*.vercel.app` origin by default (`CORS_ALLOW_VERCEL` is not `false`). You still need your production URL in Railway `CORS_ORIGIN`.

---

## CORS

The browser blocks API calls from Vercel to Railway unless the API sends `Access-Control-Allow-Origin`.

**Railway `CORS_ORIGIN` must include every fixed frontend URL:**

```env
CORS_ORIGIN=https://syncup-lake.vercel.app,http://localhost:3000
```

**Rules:**

- Exact match — no trailing slash
- Comma-separated for multiple origins
- Vercel preview URLs (`*.vercel.app`) are allowed automatically unless `CORS_ALLOW_VERCEL=false`

**Test CORS:**

```bash
curl -sI -H "Origin: https://syncup-lake.vercel.app" \
  "https://syncup-production.up.railway.app/feed?page=1&limit=1" \
  | grep -i access-control
```

You should see `access-control-allow-origin: https://syncup-lake.vercel.app`.

---

## API reference

Base URL: `{{API_URL}}` — local `http://localhost:3001`, production `https://syncup-production.up.railway.app`

### Auth header (protected routes)

```http
Authorization: Bearer <token>
```

Get a token from `POST /auth/login` or `POST /auth/register`.

---

### Health

| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | No |

---

### Auth

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/auth/register` | No | `{ name, email, password, role? }` |
| POST | `/auth/login` | No | `{ email, password }` |
| GET | `/auth/me` | Yes | — |

**Roles:** `coach`, `student`, `admin`

**Login example:**

```bash
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret123"}'
```

Response includes `data.token` and `data.user`.

---

### Feeds

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/feed?page=1&limit=20` | No | Public feed |
| GET | `/feed/mine` | Coach/Admin | Own posts (admin: all) |
| GET | `/feed/:feedId` | Coach/Admin | Single post |
| POST | `/feed` | Coach/Admin | Create |
| PATCH | `/feed/:feedId` | Coach/Admin | Update |

**Create feed body:**

```json
{
  "title": "Welcome",
  "message": "Hello team!",
  "type": "tip",
  "status": "published",
  "visibility": "public",
  "tags": ["onboarding"]
}
```

`type`: `tip` | `announcement` | `reminder`  
`status`: `published` | `draft` | `archived`  
`visibility`: `public` | `team` | `private`

---

### Comments

| Method | Path | Auth |
|--------|------|------|
| GET | `/feed/:feedId/comments` | No |
| POST | `/feed/:feedId/comments` | Yes |

**Body:** `{ "text": "Nice post!" }`

---

### Likes

| Method | Path | Auth |
|--------|------|------|
| POST | `/feed/:feedId/like` | Yes |

Toggle like (no body). Call again to unlike.

---

### Users (admin)

| Method | Path | Auth |
|--------|------|------|
| GET | `/users` | Admin |
| GET | `/users/:id` | Yes |

---

### Notifications

| Method | Path | Auth |
|--------|------|------|
| GET | `/notifications/user/:userId` | Yes |
| PATCH | `/notifications/:id/read` | Yes |
| PATCH | `/notifications/user/:userId/read-all` | Yes |

---

### Upload (coach/admin)

| Method | Path | Body |
|--------|------|------|
| POST | `/upload/image` | `form-data`, field `image` |
| POST | `/upload/file` | `form-data`, field `file` |

Use returned URL in `imageUrl` when creating a feed.

**Cloudinary:** create a free account, then set `CLOUDINARY_*` in `server/.env`. Upload fields: `image` (images), `file` (image or PDF). Files are stored under `syncup/feeds` on Cloudinary.

---

## Testing

### Server (Jest)

```bash
cd server
npm test                  # all tests
npm run test:unit         # validators, pagination
npm run test:integration  # auth, health (needs local Mongo)
```

Integration tests expect MongoDB at `MONGO_URI` (see `server/.env.test`).

### Manual smoke test

```bash
# Health
curl https://syncup-production.up.railway.app/health

# Public feeds
curl "https://syncup-production.up.railway.app/feed?page=1&limit=5"

# Register + login
curl -X POST https://syncup-production.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"secret123","role":"coach"}'
```

### Client

```bash
cd client
npm run build    # production build check
npm run lint     # ESLint
```

---

## Postman

1. Create environment variable `baseUrl` = `https://syncup-production.up.railway.app`
2. **Login** → save `data.token` as `token`
3. Protected requests → **Authorization: Bearer Token** → `{{token}}`

**Suggested flow:** Health → Login → Me → List feeds → Create feed → Comment → Like

---

## Git

```bash
git add .
git commit -m "Your message"
git push origin main
```

- Do **not** use `sudo git` (breaks `.git` ownership)
- `.env` files are gitignored — never commit secrets
- Railway auto-deploys on push to `main` (if connected)

---

## Full-stack checklist

| Step | Where | What |
|------|--------|------|
| 1 | Railway | API deployed, `/health` OK |
| 2 | Railway | `MONGO_URI`, `REDIS_URL`, `JWT_SECRET` set |
| 3 | Railway | `CORS_ORIGIN` includes Vercel + localhost |
| 4 | Vercel | `NEXT_PUBLIC_API_URL` = Railway URL |
| 5 | Vercel | Redeploy after env change |
| 6 | Browser | Feed loads without CORS errors |

---

## Scripts

### Server

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with nodemon |
| `npm start` | Production start |
| `npm run build` | Syntax-check `src/` |
| `npm run redis:up` | Start Redis (Docker) |
| `npm test` | Jest tests |

### Client

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |

---

## License

ISC
