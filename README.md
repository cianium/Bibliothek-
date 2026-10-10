# German Library 7.1.1 — reviewed V7.1 maintenance update

Current audit, verified fixes and release blockers: [گزارش بررسی و انتشار](docs/AUDIT_AND_RELEASE_FA.md). Source is ready for staging; live Supabase/Auth/Storage verification is still required.

Optional browser QA: install `playwright@1.62.1` in a test environment, install its Chromium, then run `node tools/browser-qa.cjs`. Set `PLAYWRIGHT_EXECUTABLE_PATH` only when using a separately installed Chromium. No browser dependency is required by the production app.

Before upgrading from 7.1, sync or export pending local changes. Unowned old pending queues are not automatically assigned to a new authenticated account.

# German Library v7.1

German Library is a **mobile-first curated German-learning library** for CEFR A1–C2. It is intentionally a resource-access product rather than a full LMS: learners see what to use first, each book owns its related assets, and supplementary resources are grouped by learning goal.

## Product hierarchy

```text
Home
├─ CEFR Level (A1–C2)
│  ├─ Core Book
│  │  └─ Kursbuch / Arbeitsbuch / Audio / Video / Transcript / links
│  ├─ Other Books
│  │  └─ Their own assets
│  └─ Supplementary Skills
│     └─ Hören / Lesen / Grammatik / Wortschatz / ...
└─ Special Books
   └─ Cross-level or non-CEFR books and their assets
```

## Release highlights

- Multiple books per CEFR level with one optional Published Core Book.
- Dedicated `special` collection and `special.html` for cross-level/non-CEFR books.
- One-tap mobile bottom navigation on learner pages.
- Mobile-first Admin with card lists and bottom-sheet editors.
- Draft / Published / Archived workflow with content-health validation.
- Delta-based cloud sync to reduce accidental overwrites between stale tabs.
- Supabase Auth + RLS + private Storage with least-privilege database grants.
- Modern Supabase publishable-key support; no secret/service-role key belongs in browser code.
- Production build outputs only the public bundle to `dist/`; backend SQL, docs and QA tools are not deployed.
- Curated starter content points to official publishers/providers instead of redistributing copyrighted commercial files.

## Local development

No framework or dependency install is required.

```bash
npm run qa
npm run serve
```

Open `http://localhost:8080/`. Demo Admin is allowed only in an explicitly safe local context (localhost/file mode or an explicit development flag).

## Production build

Set these environment variables in the hosting provider:

```text
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SITE_URL=https://your-domain.example   # recommended; used for sitemap.xml
```

Then:

```bash
npm run build
```

The deployable site is generated in `dist/`. The production build intentionally fails when the Supabase URL or modern publishable key is missing.

### Vercel

`vercel.json` is included and configured to run `npm run build`, publish `dist/`, and set baseline security/cache headers. Configure the three variables above in Vercel before deploying.

## Supabase

1. Create/use a **dedicated** Supabase project for German Library.
2. Apply `backend/supabase-schema.sql`.
3. Apply `backend/seed.sql` if the starter catalog is wanted.
4. Create the Admin account in Supabase Auth and promote its `profiles.role` to `admin` through trusted SQL/admin tooling.
5. Disable open sign-ups if only invited staff accounts should exist.
6. Run the Supabase Security and Performance Advisors after schema changes.
7. Run `backend/post-deploy-check.sql` and test Auth, RLS, uploads, private-file access and session expiry.

See `docs/SUPABASE_SETUP.md`, `docs/QA_REPORT.md` and `docs/RELEASE_CHECKLIST_FA.md`.
# Bibliothek-
