# Architecture Guidelines

This project follows a pragmatic structure for a Next.js App Router app.
The goal is predictable placement for code and clear boundaries.

## Top-level folders

- `app/` routes, layouts, pages, and route handlers
- `components/` shared UI and reusable building blocks
- `features/` self-contained feature modules
- `hooks/` reusable React hooks by domain
- `lib/` framework-agnostic utilities and services
- `types/` global TS types and declarations

## app/

- Route-specific components must live in `app/<route>/_components/`
- Do not place reusable UI in `app/`
- API handlers live in `app/api/`

## components/

- `components/ui/` reusable, generic UI primitives (no domain logic)
- `components/<domain>/` shared components tied to a domain but used across routes
- Keep styling and UI logic here when it is reused

## features/

Use a feature module when code is mostly isolated to one product area.
Suggested structure:

- `features/<feature>/_components/`
- `features/<feature>/_services/`
- `features/<feature>/_types/`
- `features/<feature>/_core/`

## hooks/

Hooks should not live in `lib/`.
Suggested placement:

- `hooks/ui/` UI-only hooks (scroll, visibility, etc.)
- `hooks/<domain>/` feature hooks (profile, ads, reports, etc.)

## lib/

Pure utilities, helpers, and server/client-agnostic logic.
Examples: time, formatting, URL helpers, security helpers.

## Naming conventions

- Route-local components: `app/<route>/_components/Foo.tsx`
- Shared components: `components/<domain>/Foo.tsx`
- UI primitives: `components/ui/Foo.tsx`
- Hooks: `hooks/<domain>/useFoo.ts`
- Utilities: `lib/foo.ts`

## Import style

Prefer absolute imports using `@/` for cross-folder references.
Use relative imports only within the same local folder.
