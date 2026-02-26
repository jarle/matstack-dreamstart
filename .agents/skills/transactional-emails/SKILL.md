---
name: transactional-emails
description: Write or update transactional emails rendered from Markdown via the EmailService. Use when adding templates, wiring new sends, or adjusting email metadata.
---

# Transactional Emails

- Renderer: `app/services/email_service/email_service.ts` turns `resources/views/emails/*.edge` Markdown into HTML with Dimer, injects it into `resources/views/emails/base.edge`, and queues delivery through `mail.sendLater` + BullMQ (`app/jobs/send_mail_job.ts`). The first line must be a `#` heading; it becomes the subject and is stripped from the body.
- Specs: Register each template key in `app/services/email_service/email_specs.ts` with `from` (env-backed) and optional `dummyData`. The key must match the Edge filename. Missing spec entries or views log errors at boot.
- Templates: Create `resources/views/emails/<key>.edge` as Markdown. Variables come from the `state` passed to `EmailService.send`. Static templates (no state) are cached in production; include a leading `# Title` to avoid runtime errors.
- Sending: Inject `EmailService` and call `emailService.send('<key>', { to, state?, bcc? })`. `bcc: true` adds `EMAIL_OWNER`. `state` is optional; omit it for static emails.
- Styling/Layout: Base wrapper sets a simple HTML shell and font; Markdown content controls layout. Use Markdown headings/lists/links instead of bespoke HTML.
- Checks: Run type checks after changes. Skip `.react-router` files. Keep templates minimal—no duplicate logic; rely on services instead of inline data fetching.
