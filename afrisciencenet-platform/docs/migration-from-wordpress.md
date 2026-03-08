# Migration Notes: WordPress Plugin → AfriScienceNet Node Platform

## Source mapping principles
- WordPress shortcodes/modules were mapped to first-class routes and relational models.
- Moderated content workflows were preserved with `ApprovalStatus` for each major entity.
- Portal/admin concepts were migrated into role-specific dashboards.

## Module mapping
- `home` → `/` homepage with universal search and featured modules.
- `search` → `/search` + `/api/search` with grouped results.
- `researchers`, `create profile` → `/researchers`, `/researchers/[slug]` + `ResearcherProfile` model.
- `equipment`, `submit equipment`, `equipment calendar`, `equipment booking` → `/equipment`, `/equipment/submit`, booking APIs, and `BookingRequest` model.
- `funding`, `apply funding`, `grant applications` → `/funding`, `/funding/[slug]`, `SavedFunding` and status workflows.
- `collaboration marketplace`, `collaboration requests` → `/collaborations`, `/collaborations/[slug]` + `CollaborationPost`.
- `institutions` → `/institutions`, `/institutions/[slug]` + `Institution` model.
- `messages`, `researcher message form` → `/api/messages`, `MessageThread`, `Message`.
- `research map` → `/map` with map-ready institution/equipment data.
- `dashboard`, `admin portal`, `portal profile/settings/bookings` → `/dashboard/*` role-based slices.
- `login`, `register` → NextAuth credentials flow + pages.

## Data migration sequence
1. Export plugin content (equipment, institutions, researchers, funding, collaborations, bookings, users).
2. Normalize taxonomy terms into dedicated tables (`Country`, `Discipline`).
3. Resolve author/content ownership to `User` IDs and roles.
4. Import in dependency order: countries → users → institutions → researchers/equipment/funding/collaborations → bookings/messages.
5. Backfill slugs and moderation statuses.
6. Validate counts and random record parity against legacy plugin.

## Operational migration checklist
- Configure email verification/reset provider.
- Set up object/local storage adapter for uploads.
- Re-index search logs after go-live.
- Keep WordPress read-only during final delta migration.
