# Frontend Assignments & Execution Order — v0.2

## Frontend A

Execution order:

```text
01 Home
↓
02 About
↓
04 Services
↓
05 Product Engineering
↓
06 Platform & Infrastructure
↓
07 Data Engineering
↓
08 Developer Tools
↓
09 AI Integration
↓
10 Design Engineering
↓
24 Careers
↓
25 Senior Backend Engineer
↓
26 Machine Learning Engineer
↓
27 Design Engineer
↓
29 FAQ
↓
30 Privacy Policy
↓
31 Terms of Service
↓
32 Cookie Policy
↓
33 Sign In
↓
34 Sign Up
↓
35 Forgot Password
↓
44 404
```

### Why this order

- Home establishes production page composition and missing global Footer.
- Services listing establishes ServiceCard/listing patterns before service details.
- Page 05 establishes the reusable Service Detail family.
- Careers establishes JobCard/listing patterns before job details.
- Page 25 establishes the reusable Job Detail/application presentation family.
- Privacy establishes the Legal page family.
- Sign In establishes the Auth shell.
- 404 is already partially implemented, so it is intentionally left as a cleanup/finish task.

## Frontend B

Execution order:

```text
03 Team
↓
11 Projects
↓
12 Sahim Analytics
↓
13 Naft Deploy
↓
14 Rakeen Portal
↓
15 Musnad CLI
↓
16 Wathq Observability
↓
17 Hudhud Chat
↓
18 Blog
↓
19 Eval-first RAG
↓
20 Bilingual RTL Done Right
↓
21 Small Teams No Kubernetes
↓
22 Postgres as Queue
↓
23 Design Tokens That Scale
↓
28 Contact
↓
36 Account Overview
↓
37 Account Profile
↓
38 Saved Projects
↓
39 My Comments
↓
40 My Ratings
↓
41 My Inquiries
↓
42 Notifications
↓
43 Account & Security
```

### Why this order

- Team is an independent warm-up page with low merge risk.
- Projects listing establishes ProjectCard/filter patterns.
- Page 12 establishes the reusable Project Detail family.
- Blog establishes ArticleCard/listing patterns.
- Page 19 establishes the reusable Article Detail family.
- Contact is a standalone complex form and does not block the account family.
- Account Overview establishes the Account shell/sidebar used by every later account page.

## Parallel Start

Recommended initial parallel work:

```text
Frontend A
page/01-home

Frontend B
page/03-team
```

After each page is merged, the developer starts the next branch from updated `main`.

## Git Start Command

For every new page:

```bash
git switch main
git pull --ff-only
git switch -c page/<number>-<name>
```

## After Page Completion

```bash
npm run lint
npm run build
git status
git add .
git commit -m "feat: implement <page-name> page"
git push -u origin page/<number>-<name>
```

Then open a Pull Request to `main`.

After merge:

```bash
git switch main
git pull --ff-only
git branch -d page/<number>-<name>
```

## Page Completion Gate

Do not move to the next page until the current page:

- matches the structural reference,
- uses the repository Design System,
- supports light/dark,
- supports `ar`/`en`,
- supports RTL/LTR,
- is responsive,
- covers relevant visual states,
- contains no backend implementation,
- passes lint/build,
- has been reviewed,
- is merged.
