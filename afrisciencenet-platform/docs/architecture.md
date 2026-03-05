# Afrisciencenet Platform Architecture (MVP)

## Monorepo layout

```txt
afrisciencenet-platform/
  frontend/      # React/Next.js UI
  backend/       # Node.js + Express API
  database/      # SQL schema + seed data
  docs/          # architecture and implementation docs
  ui/            # design references/tokens
  components/    # shared component specs/assets
```

## Runtime model

- **Frontend**: React components (portable to Next.js pages/app router).
- **Backend**: Express API serving equipment, institutions, resources, forum endpoints.
- **Database**: PostgreSQL for production, SQLite for lightweight startup.
- **Hosting**: VPS/shared hosting with Node support.

## MVP API surface (phase start)

- `GET /api/health`
- `GET /api/equipment`
- `GET /api/equipment/:id`

Future extensions:

- `GET /api/institutions`
- `GET /api/resources`
- `GET/POST /api/forum/posts`
- `POST /api/admin/approve-submission`
