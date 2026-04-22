# Doodle Chat Frontend

Next.js frontend for the Doodle chat challenge API.

## Quick Start

### Option A: Local development (recommended)

1. Copy env file:

```bash
cp .env.example .env.local
```

2. Start the frontend:

```bash
npm run dev
```

3. Open `http://localhost:3001`.

The frontend expects the backend API at `http://localhost:3000` by default.

### Option B: Docker Compose (frontend + backend)

```bash
docker compose up -d --build
```

Services:
- Frontend: `http://localhost:3002` (container listens on `3001`, mapped as `3002:3001`)
- Backend API: `http://localhost:3000/api/v1`

## Port Mapping

- App runtime port inside frontend container: `3001`
- Local non-Docker app URL: `http://localhost:3001`
- Docker Compose exposed frontend URL: `http://localhost:3002`
- Backend API URL: `http://localhost:3000/api/v1`

## Environment Variables

Create `.env.local` from `.env.example` and adjust if needed:

- `NEXT_PUBLIC_CHAT_API_ORIGIN` (default: `http://localhost:3000`)
- `NEXT_PUBLIC_CHAT_API_BASE_URL` (default: `http://localhost:3000/api/v1`)
- `NEXT_PUBLIC_CHAT_AUTH_TOKEN` (default: `super-secret-doodle-token`)
- `AUTH_TOKEN` (default: `super-secret-doodle-token`, backend)

## Scripts

- `npm run dev` - Start Next.js dev server on port `3001`
- `npm run build` - Build production app
- `npm run start` - Start production app on port `3001`
- `npm run lint` - Run ESLint
- `npm test` - Run Jest test suite

## Testing

Run all tests:

```bash
npm test
```

Run a single test file:

```bash
npm test -- src/components/MessageInput/MessageInput.test.tsx --watchAll=false
```

## Data Model

### Message

- `id`: string
- `message`: string
- `author`: string
- `timestamp`: string (ISO)

### ApiMessage (raw API)

- `id?`: string
- `message`: string
- `author`: string
- `timestamp?`: string
- `createdAt?`: string

Frontend normalizes API payloads into the `Message` shape before rendering.
