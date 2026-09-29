# Backend Foundation V1 — Implemented Contract

This implementation establishes the first shared backend gate for the Musnad Tech website.

## Included

- Clerk as the sole application authentication provider.
- Supabase Third-Party Auth client pattern using Clerk session tokens.
- Explicit user-scoped browser/server Supabase clients.
- Explicit privileged server-only Supabase client.
- `locales`, `profiles`, and `admin_memberships` database foundation.
- Internal UUID profile identity mapped from Clerk `sub`.
- RLS helpers in a non-exposed `private` schema.
- Deny-by-default grants/RLS for the identity foundation.
- Clerk webhook route for `user.created`, `user.updated`, and `user.deleted`.
- Synchronous `ensureCurrentProfile()` fallback for webhook eventual consistency.
- Stable backend `ActionResult`/error conventions.
- Vitest + explicit Vite peer, pgTAP, and Playwright foundation test scaffolding.
- API bypass from `next-intl` in `proxy.ts` so infrastructure endpoints are not locale rewritten.

## Deliberately not included yet

- Projects/blog/services/careers domain tables.
- Account UI/pages.
- Admin CMS.
- Inngest/Resend/Cloudinary/OPSWAT/Sentry/Better Stack implementations.
- Notifications/audit tables.
- Storage policies.
- Domain Server Actions.

These begin only after this foundation gate is validated and merged.

## Identity ownership

- Clerk owns credentials, sessions, MFA, OAuth identities, and password/security settings.
- `public.profiles.id` is the internal application UUID.
- `public.profiles.clerk_user_id` is the unique external identity.
- Domain tables must reference `profiles.id`, never email.

## Security invariants

- `private.current_profile_id()` only returns active profiles.
- User profile UPDATE grants are column-limited to `display_name` and `preferred_locale`.
- Admin membership rows are not directly exposed to ordinary authenticated clients.
- Privileged Supabase access is restricted to server-only code.
- Webhook handlers do not log payloads or profile PII.
- Clerk profile sync and deletion are atomic, timestamp-ordered database writes.
- A deletion creates a tombstone even if the create event has not arrived yet.
- Deleted profiles cannot be reactivated by delayed or later create/update events.

## Clerk webhook validation boundary

The local pgTAP suite covers create, update, retries, out-of-order events,
deletion, and deletion-before-create tombstones. The Playwright smoke suite
checks that an unsigned POST to `/api/webhooks/clerk` is rejected.

To validate delivery from Clerk, expose the local Next.js server on a public
HTTPS URL with a tunnel. In Clerk Dashboard, create a webhook endpoint at
`https://<your-tunnel-host>/api/webhooks/clerk` and subscribe to `user.created`,
`user.updated`, and `user.deleted`. Store that endpoint's signing secret in
the server-only `CLERK_WEBHOOK_SIGNING_SECRET` environment variable in
`.env.local`, restart Next.js, and use Clerk's event delivery or test feature.
Check for HTTP 204 and verify the matching local `profiles` row after each
event; resend an event to check idempotency. Never commit the signing secret.

## Generated database types

After the local migration is applied, run `npm run db:types` and commit `types/database.types.ts`. Regenerate it whenever repository-managed schema changes affect the generated API types.
