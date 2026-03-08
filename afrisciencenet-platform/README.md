# AfriScienceNet Platform (Next.js + Prisma)

**Brand:** Africa’s Research Infrastructure & Collaboration Network  
**Tagline:** From Laboratory Access to Global Funding — One Platform.

## Stack
- Next.js App Router + TypeScript
- Prisma ORM + PostgreSQL
- NextAuth (credentials)
- Tailwind CSS + reusable UI components
- Zod + React Hook Form
- Leaflet-ready map module

## Folder structure
```txt
afrisciencenet-platform/
  app/
    api/
      auth/[...nextauth]/route.ts
      search/route.ts
      bookings/route.ts
      moderation/route.ts
      messages/route.ts
      upload/route.ts
    dashboard/
      researcher/
      institution-admin/
      country-coordinator/
      super-admin/
    equipment/, researchers/, funding/, collaborations/, institutions/, map/, search/
    layout.tsx
    page.tsx
  components/
    layout/, sections/, cards/, forms/
  lib/
    auth/, db/, services/, validation/
  prisma/
    schema.prisma
    seed.ts
  docs/
    migration-from-wordpress.md
  middleware.ts
  .env.example
```

## Setup
1. `cd afrisciencenet-platform`
2. `cp .env.example .env`
3. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`
4. `npm install`
5. `npx prisma migrate dev --name init`
6. `npm run db:seed`
7. `npm run dev`

## Auth + roles
Roles implemented:
- VISITOR
- RESEARCHER
- INSTITUTION_ADMIN
- COUNTRY_COORDINATOR
- SUPER_ADMIN

Route protection is enforced in `middleware.ts` and `requireRole()` checks for dashboard pages.

## Core modules included
- Public homepage with search-first UX and featured modules
- Advanced grouped search endpoint/page
- Equipment registry and detail pages
- Researcher directory/profile pages
- Funding hub list/detail pages
- Collaboration marketplace list/detail pages
- Institution directory and institution profile
- Research map page (Leaflet-ready)
- Booking workflow API
- Moderation workflow API
- Messaging API
- Role-based dashboard slices

## Deployment targets
- VPS: `npm run build && npm run start`
- Vercel + managed Postgres: set env vars in project settings
- Docker: use Node 20 image, run Prisma migrate + Next start

## Extendability roadmap
- Add elastic-compatible search adapter while preserving Postgres FTS fallback.
- Add notification workers and annual verification cron.
- Add mobile API tokens and donor reporting modules.

## Migration reference
See `docs/migration-from-wordpress.md` for module parity and migration sequence.
