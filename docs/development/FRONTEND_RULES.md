# Frontend Rules

## Scope

Frontend A and Frontend B own complete pages and page-family presentation.

They are not backend implementers for this project phase.

## Allowed

- routes/pages,
- layouts,
- page composition,
- reusable presentation components,
- Design System use,
- responsive behavior,
- RTL/LTR,
- dark/light,
- accessibility,
- mock data,
- loading/empty/error presentation,
- client-only visual interactions.

## Not Allowed

Frontend lane should not implement:

- Supabase queries,
- database schema,
- migrations,
- RLS,
- storage policies,
- Clerk backend authorization,
- backend business logic,
- background jobs,
- application email workflows.

## Mock Data

Mock data must:

- be typed,
- represent realistic states,
- be easy to replace,
- stay outside visual components where practical,
- include both Arabic and English where localized content is relevant.

Avoid burying large data objects directly inside JSX.

## Complete Page Definition

A page is frontend-complete when:

- reference structure is implemented,
- project Design System is used,
- desktop/mobile are usable,
- Arabic/English work,
- RTL/LTR work,
- light/dark work,
- main loading/empty/error states are represented where relevant,
- no backend implementation was introduced,
- no obvious duplicate shared component was created.

## Shared Files

Avoid simultaneous uncontrolled edits to:

- `app/globals.css`
- `components/ui/*`
- `components/navbar/*`
- i18n routing/config

A change to shared foundation should be intentional and communicated before implementation.

## Current Home

Remove `UIShowcase` from production Home composition when the real Home is implemented.

Preserve the showcase as a development/design-system reference rather than deleting valuable component examples.
