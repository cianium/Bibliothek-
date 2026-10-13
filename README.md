# German Library

**A mobile-first, curated German-learning resource library for CEFR levels A1–C2.**

German Library helps learners find appropriate German-learning books, supporting materials, and practice resources without searching through scattered links. It organizes resources by CEFR level, book package, and learning goal, and provides a separate collection for cross-level books.

**[Explore the live site](https://german-library.vercel.app)** · [Source code](https://github.com/cianium/Bibliothek-) · [Changelog](CHANGELOG.md)

> **Project status:** Publicly deployed. Production authentication, storage access, and real-device end-to-end testing should be verified independently before declaring the release fully validated. See [release checklist](docs/RELEASE_CHECKLIST_FA.md).

## The problem

German learners often encounter disconnected resources: a coursebook in one place, its workbook or audio elsewhere, and supplementary grammar or vocabulary material in yet another list. German Library focuses on **resource discovery and organization**, not on replacing a teacher or becoming a full learning management system (LMS).

## Features

- **CEFR-based browsing:** Resources organized across A1, A2, B1, B2, C1, and C2.
- **Book-centered structure:** Coursebooks, workbooks, audio, video, transcripts, and links grouped with the corresponding book package.
- **Learning-oriented discovery:** Suggested routes and supplementary resources for skills such as listening, reading, grammar, and vocabulary.
- **Special Books:** A separate collection for cross-level or non-CEFR books.
- **Responsive learner experience:** Mobile-first layouts and navigation.
- **Content management:** Admin workflows for creating, editing, publishing, archiving, importing, and exporting resources.
- **Backend access controls:** Supabase Authentication, Row Level Security (RLS), and private Storage policies defined in the project; these require verification against the deployed backend.

## Live demo

**Website:** https://german-library.vercel.app

The public website is intended for learners. Administrative features require authorized access and are not part of the public demo.

### Screenshots

Screenshots will be added after capturing and reviewing the deployed desktop and mobile interfaces. This section intentionally contains no placeholder or fabricated product images.

## How it works

```text
Home
├── CEFR Levels (A1–C2)
│   ├── Core Book
│   │   └── Coursebook / Workbook / Audio / Video / Transcript / Links
│   ├── Other Books
│   │   └── Their associated learning assets
│   └── Supplementary Skills
│       └── Listening / Reading / Grammar / Vocabulary / ...
└── Special Books
    └── Cross-level books and their associated resources
```

Learners can choose a level, follow the available suggestions, open a book package, or browse additional resources. Public content is separate from the staff content-management workflow.

## Tech stack

| Layer | Technology / approach |
| --- | --- |
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend | Supabase (Postgres, Auth, Storage) |
| Authorization | Row Level Security and role-based staff workflows |
| Hosting | Vercel |
| Build & QA | Node.js scripts, Python QA utilities |

The frontend does not require a heavyweight framework. The production build generates a deployable `dist/` directory.

## Local development

**Requirements:** Node.js 20+ and Python 3.

Clone and run the project:

```bash
git clone https://github.com/cianium/Bibliothek-.git
cd Bibliothek-
npm run qa
npm run serve
```

Then visit **http://localhost:8080/**.

Local/demo behavior is distinct from production authentication. Do not treat local demo access as evidence of production access controls.

## Production build

Configure the following environment variables in your hosting provider:

```dotenv
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SITE_URL=https://your-domain.example
```

`SUPABASE_PUBLISHABLE_KEY` is a public browser key. **Never place a Supabase secret or service-role key in client-side code or public environment variables.**

```bash
npm run build
npm run verify:dist
```

The deployable output is written to `dist/`. The repository includes Vercel deployment configuration. Before connecting an existing database, review the schema, migration considerations, and backup guidance in [Supabase setup](docs/SUPABASE_SETUP.md).

### Quality checks

```bash
npm run qa
npm run release:check
```

`release:check` runs the project's QA, production build, and output verification. A passing local check does **not** replace real-browser, live Auth/RLS, file-access, and production smoke tests.

## Documentation

- **[Supabase setup](docs/SUPABASE_SETUP.md)** — schema, Auth roles, Storage, and backend verification.
- **[QA report](docs/QA_REPORT.md)** — historical automated test coverage and remaining real-device checks.
- **[Release checklist (Persian)](docs/RELEASE_CHECKLIST_FA.md)** — deployment and acceptance checklist; update its status as tests are completed.
- **[Technical audit (Persian)](docs/AUDIT_AND_RELEASE_FA.md)** — the dated v7.1.1 assessment, fixes, and known limitations.
- **[Changelog](CHANGELOG.md)** — version history.

> Some audit and release documents describe the project **as of October 8, 2026**, before the public deployment was reported. Those historical findings should not be mistaken for a current, fully verified production test result.

## Security and content principles

- Anonymous access should be restricted to published content through database policies.
- Editing and uploading should require authorized staff roles.
- Private Storage files should remain private and be accessed only through the intended authorization flow.
- Resource links should point to authorized publishers and providers; the application should not redistribute copyrighted commercial material without permission.
- Review [Supabase setup](docs/SUPABASE_SETUP.md) and execute the post-deploy checks before declaring these guarantees verified in a specific deployment.

## Project scope

German Library is a **curated resource library and learning-path guide**, not a complete LMS. Progress tracking, gamification, quizzes, and AI tutoring are deliberately outside the current core scope.

## Roadmap

- [ ] Verify end-to-end flows on real mobile devices and desktop browsers.
- [ ] Validate live Supabase Auth, RLS, private-file access, and staff workflows.
- [ ] Collect learner feedback and fix high-impact usability issues.
- [ ] Add verified desktop/mobile product screenshots.
- [ ] Complete the release documentation and publish an official GitHub release after acceptance checks.

## License and contributions

The repository currently has **no root `LICENSE` file** confirmed during this review. Until a license is selected and added, public visibility does not imply permission to reuse or redistribute the source code.

For now, questions, bug reports, and suggestions can be raised through the repository's GitHub Issues, if enabled. Contribution guidelines can be added after deciding on an appropriate licensing and maintenance policy.
