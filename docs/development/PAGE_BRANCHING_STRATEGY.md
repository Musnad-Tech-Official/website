# Page Branching Strategy — v0.2

## Rule

Every frontend page gets its own Git branch.

Pattern:

```text
page/<screen-number>-<reference-name>
```

The branch name should match the reference screenshot basename wherever practical.

## Examples

```text
01-home.png
→ page/01-home

12-project-sahim-analytics.png
→ page/12-project-sahim-analytics

33-signin.png
→ page/33-signin

43-account-security.png
→ page/43-account-security
```

## Branch Lifecycle

```text
updated main
↓
page branch
↓
complete page
↓
self-check
↓
lint/build
↓
review
↓
PR
↓
merge
↓
delete branch
↓
updated main
↓
next page branch
```

## WIP

Each frontend developer should normally have exactly one active page branch.

Do not create the next page branch simply because the current page is waiting for review if review/fixes can be completed promptly.

Prefer finishing the current page.

## Merge Coordination

Before creating the next page branch:

```bash
git switch main
git pull --ff-only
```

This ensures reusable components added by the other developer are visible before new work starts.

## Shared Changes

A page PR may include a small shared component needed by that page.

A broad foundation change should use a dedicated branch:

```text
shared/<name>
refactor/<name>
```

Examples:

```text
shared/footer
shared/page-header
refactor/design-system-dialog
```

Page branches should not become disguised repository refactors.

## No Long-Lived Frontend Developer Branches

Do not use:

```text
frontend-a
frontend-b
```

as implementation branches containing many pages.

The ChatGPT conversation branch can remain developer-specific, but Git branches remain page-specific.
