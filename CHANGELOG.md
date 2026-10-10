# 7.1.1 — 2026-10-08

- Serialized, revision-aware sync and account-scoped pending changes.
- Cloud/demo cache isolation and deferred Auth callbacks.
- Stable edited IDs, corrected core moves, safer upload/import flows.
- Data-driven linked roadmap; hidden empty sections; optional resources disclosure.
- Quieter cards, visible focus, labelled fields, modal keyboard support and responsive fixes.
- External page scripts and stricter CSP; published-only fallback build; reject secret config keys.
- Regression QA and 56 Chromium page/viewport checks. Live backend not yet verified.

# Changelog

## v7.1 — production hardening

- Added production `dist/` build with environment-driven Supabase configuration; backend SQL/docs/dev tools are excluded from the deployed bundle.
- Migrated runtime configuration to modern Supabase publishable keys while keeping a legacy fallback only for compatibility.
- Pinned `@supabase/supabase-js` to 2.117.2 instead of a floating major CDN tag.
- Hardened Postgres/RLS grants, helper-function exposure, private Storage policies and URL/access constraints.
- Added database integrity checks for Core Book publication state and parent/child Book/Resource consistency.
- Replaced destructive full-snapshot/archive sync behavior with changed-row upserts and explicit Archive actions.
- Added persistent pending-sync recovery: offline edits survive reload/reconnect, retry against a fresh remote base, and preserve untouched remote entities.
- Added unsynced-change exit protection and online/offline feedback in Admin.
- Hardened Import validation so invalid external URLs cannot bypass the editor.
- Added Vercel/portable security headers, production cache policy, web manifest and optional generated sitemap.
- Added repeatable static/content QA plus a post-deploy SQL integrity check.
- Revalidated official starter links and replaced three stale Hueber URLs.

## v7 — multi-book + special collection + mobile access

- Chose v6 as the architectural base after comparing all three supplied project versions.
- Added a first-class `collection` model: `level` or `special`.
- Added multiple book packages per CEFR level instead of exposing only the core course.
- Added a dedicated Special Books page for cross-level or uncategorized books.
- Reworked level-page hierarchy to: Level header → compact roadmap → Core Book → Other Books → Skill Practice → Recommendations.
- Added fast mobile bottom navigation to learner pages.
- Rebuilt admin workflows around mobile editing, contextual book/resource forms, Draft-first publishing and collection-aware filters.
- Added validation for mismatched resource/book contexts and empty published books.
- Updated Supabase schema with nullable CEFR level for special books, collection constraints and server-side context validation.
- Replaced placeholder / dead public resources with curated official links where available.
- Removed learner-app scope creep: no public progress, notes, vocabulary tracking or lesson engine.

## v6

- Mobile-first static/Supabase architecture, admin, RLS, private storage, content health and publishing states.
