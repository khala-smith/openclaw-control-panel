# KHA-10 Monorepo Bootstrap

Monorepo bootstrap with:

- `apps/frontend`: Next.js 16 + Tailwind CSS admin dashboard
- `apps/backend`: Gin-based Go websocket service streaming operational telemetry

## Prerequisites

- Node.js 20+
- npm 10+
- Go 1.22+

## Local development

Install workspace dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev:frontend
```

Run backend stream service:

```bash
npm run dev:backend
```

Frontend websocket endpoint defaults to:

```text
ws://localhost:8080/api/v1/ws/stream
```

Set `NEXT_PUBLIC_STREAM_WS_URL` to override.

## Verification commands

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

## Backend API

- `GET /healthz` health probe
- `GET /api/v1/stream` single telemetry snapshot
- `GET /api/v1/ws/stream` websocket stream (envelope `{ type: "snapshot", payload: ... }`)
