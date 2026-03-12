# Claude SDK Log Viewer

A web app for viewing and exploring Claude SDK logs.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Redux Toolkit, Tailwind CSS v4, shadcn/ui
- **Backend**: Python aiohttp server
- **Build**: pnpm (frontend), uv (Python), Make (orchestration)

## Project Structure

```
gui/                    # Next.js frontend
  src/app/(tabs)/       # Tab-based pages
  src/components/       # React components
    ui/                 # shadcn/ui primitives
  src/lib/              # Utilities, Redux store, hooks
server/                 # Python aiohttp backend
  app/handlers/         # API route handlers
```

## Development

```bash
make setup    # Install all dependencies
make dev      # Run frontend (localhost:3000) + backend (localhost:8000)
make build    # Build frontend → bundle into Python package
make clean    # Clean all build artifacts
```

## Key Patterns

### API Communication
- **Dev**: Next.js rewrites `/api/*` to `localhost:8000`
- **Prod**: Single aiohttp server serves both API and static frontend

### UI Components (shadcn/ui)
- Components in `gui/src/components/ui/`
- Built on Radix UI primitives + Tailwind CSS
- Theme colors in `gui/src/app/globals.css` (oklch format)
- Dark mode via `next-themes`

### State Management
- Redux Toolkit with typed hooks (`useAppDispatch`, `useAppSelector`)

## Adding Features

- **API endpoint**: Add to `server/app/handlers/api.py`, register in `server/app/__init__.py`
- **Page**: Add directory under `gui/src/app/(tabs)/`, update tabs in `gui/src/app/(tabs)/layout.tsx`
- **Redux slice**: Add to `gui/src/lib/features/`, register in `gui/src/lib/store.ts`
- **UI component**: Use shadcn/ui in `gui/src/components/ui/`
- **CLI command**: Add to `server/app/cli.py`
