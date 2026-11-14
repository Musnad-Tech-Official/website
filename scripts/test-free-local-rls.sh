#!/usr/bin/env bash
set -euo pipefail

# Never contact the user's hosted Supabase database.
if [[ "${PGDATABASE:-}" != "musnad_local_ci" ]] ||
   [[ "${PGHOST:-}" != "127.0.0.1" && "${PGHOST:-}" != "localhost" ]]; then
  echo "Refusing to test outside localhost/musnad_local_ci" >&2
  exit 1
fi

export PGOPTIONS='-c statement_timeout=30000'
psql -X -v ON_ERROR_STOP=1 -f tests/local-db/auth-shim.sql

# Import actual source DDL/RLS, stopping before synthetic marketing/client seeds.
sed '/^-- Seed initial representative inquiries/,$d' supabase/sql/inquiries.sql |
  psql -X -v ON_ERROR_STOP=1
sed '/^-- Seed initial 6 official capabilities/,$d' supabase/sql/services.sql |
  psql -X -v ON_ERROR_STOP=1
sed '/^-- Initial Seed Data:/,$d' supabase/sql/page_visibility.sql |
  psql -X -v ON_ERROR_STOP=1

psql -X -v ON_ERROR_STOP=1 -f tests/local-db/rls-smoke.sql
