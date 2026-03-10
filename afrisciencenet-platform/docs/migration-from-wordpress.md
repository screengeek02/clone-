# Migration Notes: WordPress Plugin → Standalone Node.js Platform

## Principles
- WordPress plugin modules were used as feature inventory only.
- New platform is fully standalone (Next.js + Prisma + PostgreSQL) with no WP runtime dependencies.
- Moderation, dashboards, booking, messaging, and search are implemented as first-class app modules.

## Module mapping (legacy → standalone)
- `home` → `/`
- `search` → `/search` + `/api/search`
- `researchers`, `create profile` → `/researchers`, `/researchers/[slug]`, `/researchers/create`, `/researchers/edit/[id]`
- `equipment`, `submit equipment`, `equipment booking`, `equipment calendar` → `/equipment`, `/equipment/[slug]`, `/equipment/submit` + `/api/bookings`
- `projects`, `submit project` → `/projects`, `/projects/[slug]`, `/projects/submit`
- `datasets`, `submit dataset` → `/datasets`, `/datasets/[slug]`, `/datasets/submit`
- `funding`, `apply funding`, `grant applications` → `/funding`, `/funding/[slug]`, `SavedFunding`
- `collaboration marketplace`, `collaboration requests` → `/collaborations`, `/collaborations/[slug]`, `/collaborations/create`
- `institutions` → `/institutions`, `/institutions/[slug]`
- `messages`, `researcher message form` → `/messages` + `/api/messages`
- `research map` → `/map`
- `dashboard`, `portal`, `admin portal`, `portal bookings` → `/dashboard/researcher`, `/dashboard/institution-admin`, `/dashboard/country-coordinator`, `/dashboard/super-admin`
- `research policy hub` → `/policy-hub`
- `ai matchmaker`, `grant partner finder` → `/ai-matchmaker` (structured explainable matching MVP)
- `login`, `register` → `/login`, `/register` with Auth.js

## Data migration sequence
1. Export WP records (equipment, researchers, institutions, funding, collaborations, projects, datasets, users, bookings, messages).
2. Normalize taxonomies to `Country`, `Discipline`, and controlled enums.
3. Map user roles to platform roles (`VISITOR`, `RESEARCHER`, `INSTITUTION_ADMIN`, `COUNTRY_COORDINATOR`, `SUPER_ADMIN`).
4. Import dependency order: country/discipline → users → institutions → researchers/equipment/funding/collaborations/projects/datasets → bookings/messages.
5. Backfill slugs, moderation states, and ownership links.
6. Verify counts and sample records before cutover.
