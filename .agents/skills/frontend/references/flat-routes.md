## Routing convention (how to read `routes/`)

### 0) Start point

Everything under `resources/react_app/routes/` defines URLs.

## 1) Which folders matter for the URL?

### A) `name+` folders = route namespaces (they affect the URL)

A folder whose name ends with `+` **is a routing folder**.

- Remove the trailing `+`.
- Treat that name as a **URL segment**, _unless it starts with `_` (see below)\_.

Examples:

- `settings+/...` contributes `settings`
- `admin+/emails+/...` contributes `admin/emails`

### B) normal folders (no `+`) = colocation only (ignored for URL)

Folders without `+` are just for organizing code near a route. They **do not** add URL segments.

Example:

- `sale_enquiries/table/` does not change the URL; it’s just colocated modules.

---

## 2) “Pathless” grouping / layout segments

### `_name+` folders are pathless (they do NOT add a URL segment)

If a routing folder (ends with `+`) starts with `_`, it’s a **group/layout** only.

Example:

- `_app+` groups “app routes” but does **not** add `/app`
- `_open+/_authentication+` groups public auth routes but does **not** add `/open/authentication`

---

## 3) Which files define routes (and how they map to URL segments)?

Inside routing folders (`...+`), route modules are `.tsx` files:

### A) Leaf route files

A normal file name becomes the next URL segment.

- `workspace.tsx` → `/workspace` (relative to its parents)

### B) Index routes

`_index.tsx` (or `index.tsx`) means **“no additional segment”** (the default page for that folder path).

- `settings+/_index.tsx` → `/settings`

### C) Dynamic params

`$param.tsx` becomes `:param`.

- `$emailId.tsx` → `/:emailId`

### D) Layout/boundary files

`_layout.tsx` and `_route.tsx` are **route boundary modules** for the folder:

- they wrap/host nested routes
- they do **not** create a new URL segment by themselves

(They define the UI/layout for that path level.)

---

## 4) How to compute a URL from a file path (algorithm)

Given a file path under `routes/`:

1. Split into path parts (folders + file).
2. Keep only folders that end with `+`.
3. For each kept folder:
   - remove trailing `+`
   - if it starts with `_`, **skip** it (pathless)
   - else append it as a URL segment

4. Handle the file:
   - if file is `_index.tsx` or `index.tsx`: append **nothing**
   - else if file name starts with `$`: append `:` + rest (dynamic param)
   - else if file is `_layout.tsx` or `_route.tsx`: append **nothing** (boundary only)
   - else append file name (without extension) as segment

5. Join segments with `/` and prefix with `/`.

---

## 5) Examples from this repo

- `routes/_app+/workspace.tsx` → `/workspace`
- `routes/_app+/settings+/_layout.tsx` → boundary for `/settings`
- `routes/_app+/settings+/account+/email-feeds.tsx` → `/settings/account/email-feeds`
- `routes/_app+/admin+/emails+/$emailId.tsx` → `/admin/emails/:emailId`
- `routes/_app+/_index/_route.tsx` → `/` (because `_app+` is pathless and `_index` contributes no segment)

---

## 6) Safe assumptions when editing/adding routes

- Only create new URL path segments by adding:
  - a `name+.folder`, or
  - a leaf `.tsx` file in a routing folder.

- Put components/helpers in non-`+` folders so you don’t accidentally create new routes.
- Use `_layout.tsx` when you want shared UI around children at that path level.
