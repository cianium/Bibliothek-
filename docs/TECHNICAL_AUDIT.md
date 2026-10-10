> Historical V7.1 report. Current status and limitations: [7.1.1 audit](AUDIT_AND_RELEASE_FA.md).

# German Library — Three-version Audit → v7

## Version comparison

### Version 1 — static directory

Useful as an early content sketch, but structurally too flat. It behaves like a resource list rather than a guided library, has no scalable content model, no meaningful admin workflow and weak mobile information architecture.

### Version 2 — richer neumorphic prototype

Visual hierarchy and learner guidance improved, but the product drifted toward an LMS with progress / continue-learning concepts. The page remains too monolithic for A1–C2 growth and the information model does not cleanly solve multiple independent books per level.

### Version 3 / v6 — selected base

The strongest architecture: reusable data model, multiple pages, Supabase integration, Auth/RLS/private Storage, admin CRUD, content health, publishing states and mobile-aware patterns. v7 therefore evolves v6 instead of rewriting from the earlier prototypes.

## Material issues found and v7 resolution

1. **Only the Core Course was properly surfaced on level pages.** v7 renders Core Book and Other Books as separate packages.
2. **No clean home for non-CEFR / cross-level books.** v7 adds a first-class `special` collection and `special.html`.
3. **Published resources could have no access target.** Admin publishing now rejects that state; validation reports legacy violations.
4. **Book/resource context could diverge.** Client validation and a Supabase trigger enforce collection and level consistency.
5. **Mobile public navigation depended too much on header/menu interaction.** v7 adds a fixed safe-area-aware bottom navigation on small screens.
6. **Admin needed faster mobile editing.** Management is card-based on mobile; editors remain bottom sheets with dirty-state protection.
7. **Legacy learning-app state was unnecessary.** v7 keeps the library focused on resource access and removes progress/lesson-engine concepts from public scope.
8. **Content legality / dead-end risk.** Curated starter links point to official learning providers or publishers; the product does not seed unauthorized commercial downloads.
9. **Special books cannot be represented with fake CEFR data.** Database `level_code` is nullable only when `collection='special'`, protected by constraints.
10. **Empty published books create dead ends.** v7 content health reports published books with no published assets.

## Architecture decision

Keep the current framework-free static frontend + Supabase backend. For this product size it minimizes bundle cost, dependencies and maintenance. A framework migration is not justified unless routing, localization, SSR/SEO, complex editorial workflows or a much larger component surface becomes necessary.
