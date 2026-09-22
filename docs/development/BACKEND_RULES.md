# Backend / Platform Owner Rules

## Scope

The Backend / Platform Owner owns all backend, data, security, platform integration, and final data connection work.

## Responsibilities

- System/Data/Backend Design
- Supabase/PostgreSQL
- migrations
- RLS
- Clerk server integration
- admin RBAC
- private storage
- Cloudinary backend integration
- Inngest
- Resend
- search
- moderation
- malware scanning
- analytics backend events
- logging/error integrations
- backend testing
- integration with completed frontend

## Frontend Boundary

Do not redesign finished pages during integration.

If data requirements conflict with the UI, define a page-facing adapter/contract rather than exposing raw database complexity to components.

## No ORM

Use the approved Supabase APIs/SDK/database functions approach.

Do not introduce Prisma, Drizzle, or another ORM without an explicit architecture decision.

## Security

RLS is required where appropriate but is not the only security layer.

Also enforce:

- authentication,
- authorization,
- validation,
- anti-abuse controls,
- file security,
- moderation,
- server-only secrets.

## Integration Principle

Persist domain data first, then trigger retryable side effects where appropriate.

Example:

```text
validated inquiry
→ stored lead
→ background event
→ email/notification
```

A transient email failure must not erase the primary business record.
