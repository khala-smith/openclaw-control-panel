# OpenClaw Control Panel

Bootstrap for the OpenClaw gateway control panel. This repository contains a typed `Next.js` application shell for managing gateway health, node inventory, channel connections, and operational activity.

## Tech stack

- `Next.js 16` with the App Router
- `React 19` with TypeScript
- `ESLint 9` for linting
- `Vitest` for initial unit tests

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Available scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` serves the production build
- `npm run lint` runs ESLint across the repo
- `npm run test` runs the Vitest suite
- `npm run typecheck` runs TypeScript without emitting files

## Project structure

```text
src/
  app/
    globals.css          Global dashboard styles
    layout.tsx           App metadata and font setup
    page.tsx             App entry for the control panel shell
  components/
    dashboard-shell.tsx  Reusable dashboard sections and cards
    status-chip.tsx      Shared status presentation
  data/
    control-panel.ts     Seed data for metrics, nodes, connections, and activity
  lib/
    status.ts            Status formatting and tone mapping helpers
    status.test.ts       Initial unit tests
```

## Next steps

- Replace seeded records in `src/data/control-panel.ts` with real gateway API calls
- Add authenticated routes for gateway settings, node management, and connection configuration
- Introduce data fetching, mutations, and end-to-end tests once backend endpoints are available

## Verification

The bootstrap is expected to pass:

```bash
npm run lint
npm run test
npm run build
```
