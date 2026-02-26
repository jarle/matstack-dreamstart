# Instructions for AI Agents

- This is [@matstack/dreamstart](https://matstack.dev/), a starting kit for building full-stack applications
- Markdown: sentences are always put on separate lines for cleaner git diffs.

## Tech Stack

- Node.js
- React Router v7 framework mode (formerly Remix)
- AdonisJS
- VineJS for validation
- React
- Tailwind
- Shadcn
- Lucid icons

## App Infrastructure

- App infrastructure is defined in `compose.yml`.
- PostgreSQL is used as the primary database.
- Redis is used for cache and queue-backed runtime behavior.
- MinIO is used for object storage.
- MailHog is used for local email capture.

## Formatting Workflow

- After making code changes, run formatting before finishing.
- Prefer formatting only changed files, then run project-wide formatting only when needed.
- Use `pnpm lint --fix` for lint auto-fixes and `pnpm format` for prettier formatting.
