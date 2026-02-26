---
name: browser-testing
description: Run, write, and troubleshoot Japa browser tests that use Playwright; use when you add or change frontend functionality that should be covered by tests
---

# Browser testing with Japa + Playwright

- Japa is built on Playwright, so you can use the methods from Playwright.
- See [resources](resources/japa-browser-client.md) for detailed Japa documentation.

## Quick run

- `node ace test browser` runs the suite; limit files with `--files tests/browser/smoketest.spec.ts`.
- Control Playwright timeout with `BROWSER_TIMEOUT` (ms); defaults to 40000.
- Keep timeout config out of test files; rely on env/runner defaults.

## Debug aids

```shell
PWDEBUG=console node ace test browser
```

Alongside the page.pause method, you can use the page.pauseIf and page.pauseUnless methods to pause the script conditionally.

```js
test('visit home page', async ({ visit }) => {
  const page = await visit('/')
  await page.pauseIf(process.env.DEBUG_TEST)
  await page.pauseUnless(process.env.NO_DEBUG)
})
```

## Auth helpers

- Use `browserContext.loginAs(testUser)` from `tests/bootstrap.ts` to seed sessions.

## Stable assertions

- Assert on data-testid or aria-label that you control; keep display text free for copy tweaks.
- Keep each test focused and deterministic; one concern per test.
- Add screenshots at key moments for future visual confirmation
- Capture multiple screenshots per flow (typically 2–5) at settled states (after waits/detach). Use foldered names `tmp/browser/<suite>/<flow>/<step>.png` via `captureScreenshot` in `tests/browser/utils.ts` (step can be `01-*`). Take them only when the UI is idle to avoid empty or mid-animation shots.

## Patterns that keep tests resilient

- Prefer `page.getByTestId`/`getByRole` over CSS selectors; add `data-testid` on status badges/CTAs you need.
- Assert on URLs for navigations to fail fast; avoid waiting on elements just to hit timeouts.
- Avoid `page.evaluate` for state checks; assert only on rendered UI.
- Use `visit('/path')`, then `waitForLoadState('networkidle')` before assertions.
- For auth/redirect flows, drive the real route:
  - Swap external components with fakes via `app.container.swap` (e.g., fake MSAL that returns a callback URL).
  - Trigger the redirect endpoint, wait for the callback URL, then land back on the target page and assert UI state.
- Keep data isolation: `group.each.setup(() => testUtils.db().withGlobalTransaction())` and clear relevant tables before each case.
- Seed state via models/services (e.g., insert connections or enquiries) instead of mocking fetch.
- When waiting on state changes, combine the action with an awaited navigation/response, or wait for specific testids to detach/appear; avoid arbitrary long timeouts.
