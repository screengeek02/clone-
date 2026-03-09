# AfriScienceNet Platform (Standalone Node.js Application)

**Positioning:** Africa’s Research Infrastructure & Collaboration Network  
**Tagline:** From Laboratory Access to Global Funding — One Platform.

This is a **fully independent Next.js + Node.js platform** and not a WordPress plugin/theme.

## Tech Stack
- Next.js App Router + TypeScript
- Prisma ORM + PostgreSQL
- Auth.js/NextAuth credentials auth
- Tailwind CSS (shadcn-compatible component structure)
- Zod validation + React Hook Form
- Leaflet-ready research map module

## Core Modules
- Homepage with universal search and quick actions
- Global grouped search (equipment, researchers, institutions, funding, collaborations, projects, datasets)
- Equipment registry + submit flow + booking API integration
- Researcher directory + profile routes
- Funding & scholarships hub
- Collaboration marketplace
- Institutions directory
- Projects module
- Datasets module
- Messaging shell + API routes
- Moderation API workflow + audit logs
- Role dashboards (Researcher, Institution Admin, Country Coordinator, Super Admin)
- Policy Hub + AI Matchmaker (structured matching MVP shell)

## Quick Start
1. `cd afrisciencenet-platform`
2. `cp .env.example .env`
3. Configure `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
4. `npm install`
5. `npx prisma migrate dev --name init`
6. `npm run db:seed`
7. `npm run dev`

## Key Routes
- `/` home
- `/search`
- `/equipment`, `/equipment/[slug]`, `/equipment/submit`
- `/researchers`, `/researchers/[slug]`, `/researchers/create`
- `/funding`, `/funding/[slug]`
- `/collaborations`, `/collaborations/[slug]`, `/collaborations/create`
- `/institutions`, `/institutions/[slug]`
- `/projects`, `/projects/[slug]`, `/projects/submit`
- `/datasets`, `/datasets/[slug]`, `/datasets/submit`
- `/map`
- `/dashboard/*`
- `/policy-hub`, `/ai-matchmaker`

## Deployment
- VPS / Plesk Node hosting: `npm run build && npm run start`
- Docker-compatible with Node 20+
- Vercel + managed Postgres

## Migration Guidance
See `docs/migration-from-wordpress.md` for module-by-module mapping from WordPress-era feature inventory to standalone Node routes/workflows.
