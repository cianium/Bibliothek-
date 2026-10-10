# German Library v7 — Product Scope

## Product goal

German Library is a **curated resource-access library + learning roadmap**. Its success metric is whether a learner can quickly answer: **What should I study next, and where do I open it?**

## In scope

- CEFR navigation A1–C2.
- Multiple books per level.
- One optional Core Book per level, visually prioritized.
- Book Package pages that keep each book's Kursbuch, Arbeitsbuch, Audio, Video, transcript and related assets together.
- Supplementary resources grouped by learning goal: Hören, Lesen, Grammatik, Wortschatz, Sprechen, Schreiben, Aussprache, Prüfung and Extra Practice.
- Priority: Essential, Recommended, Optional.
- Dedicated Special Books collection for cross-level or non-CEFR materials.
- Search/filtering for CEFR resources.
- Mobile-first public navigation and mobile-first content administration.
- Draft / Published / Archived lifecycle.
- Supabase Auth, RLS and private Storage for production.

## Explicitly out of scope for the core product

German Library is not an LMS. Public learner accounts, streaks, detailed progress tracking, lesson engines, notes, spaced repetition, gamification and social features are excluded unless a future user problem clearly justifies them.

## Information architecture

```text
Level
→ Core Book
→ Other Books
→ Book Package
→ Book Assets
→ Supplementary Skill Categories
→ Resources
```

Special books use a parallel hierarchy:

```text
Special Books
→ Book Package
→ Book Assets
```

## Publishing rule

A public resource must provide a usable access path: an approved external `http(s)` URL or a valid stored file. Commercial copyrighted books should link to official publisher/access pages or use files the administrator has the right to distribute.
