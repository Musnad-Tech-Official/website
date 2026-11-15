# Free local browser E2E: Clerk Development key setup

Local Supabase CLI + Docker and PostgREST already passed at GitHub run 43739230732.
The genuine Next.js app requires the existing Musnad Tech Clerk DEVELOPMENT
Secret Key. A fabricated sk_test_ value is not valid and must not be used.
The connected Vercel Preview shares production Clerk keys; NEVER copy those.

## GitHub secret (free; no new app or subscription)

1. Clerk Dashboard -> existing Musnad Tech app -> Development -> API Keys.
2. Copy the development Secret Key beginning with sk_test_.
3. GitHub repo Musnad-Tech-Official/website -> Settings -> Secrets and
   variables -> Actions -> New repository secret.
4. Name it MUSNAD_E2E_CLERK_DEV_SECRET_KEY and paste the value in GitHub.
5. Do not paste this key into chat, repo files, logs or screenshots.
6. Rerun the GitHub Actions browser workflow on this reviewed test branch.

The workflow checks the prefix and skips the browser job without that secret.
A skipped job does not count as a successful E2E test.

The browser job runs local Supabase and local Next.js on 127.0.0.1 and never
contacts the production Supabase project. It tests public pages and anonymous
admin boundaries; live admin/member tests are separately gated on staging-only
browser state files and are skipped without them.

No production site, paid Supabase branch or customer record is touched.
