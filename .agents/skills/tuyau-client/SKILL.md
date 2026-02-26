---
name: tuyau-client
description: Use Tuyau (generated client) for type-safe AdonisJS API access in this repo; prefer the generated client over fetch/axios
---

# Tuyau Client

## When to reach for this

- Any frontend call to the AdonisJS API should use the Tuyau client instead of fetch/axios.
- Use after adding or changing backend routes, Vine validation, or controllers to refresh types.

## Generate and refresh types

- Run `node ace tuyau:generate` in the project root after route/controller or `request.validateUsing` changes; this updates `.adonisjs/api.ts` and `.adonisjs/index.ts`.
- Tuyau types must exist before `pnpm typecheck` because the React typecheck imports the generated schema.

## Client entry point in this repo

- Import the shared client from `resources/react_app/utils/tuyau.ts` via `import { api } from '#web/utils/tuyau'`.
- The client is created with `createTuyau({ api: generatedApi, baseUrl: '/' })`, so relative calls work in loaders, actions, and components.

## Making requests

- Prefer named routes: `api.$route('enquiries:sale').$get({ query: { page, pageSize } }).unwrap()`.
- Path params: `api.$route('enquiries:sale.show', { id }).$get().unwrap()`.
- Bodies: `api.$route('column_layouts:update').$put({ mode, category, visibleColumns }).unwrap()`.
- URL only: `api.$url('brokers:index')`.
- Response handling: calls return `{ data, error, status, response }`; use `unwrap()` to throw on non-2xx when you do not need custom narrowing.

## Type utilities

- Import `InferRequestType`, `InferResponseType`, and `InferErrorType` from `@tuyau/client` to keep derived types in sync with backend contracts.

## Integration tips

- Use the shared client in React Router loaders/actions instead of fetch; it already encodes params, query, and body shapes from the Adonis validators.
- For React Query hooks, call `.unwrap()` inside the query/mutation function so callers receive plain data.
- If a route is missing, regenerate types and check the named route exists in `.adonisjs/api.ts` under `routes`.

## After changes

- Always rerun `node ace tuyau:generate` when backend API surface changes, then run `pnpm typecheck` to confirm the frontend remains aligned.
