# DR Services Marketplace

A production-ready **Next.js 14 App Router** marketplace where providers list services and customers can browse, book, and message.

## Stack

- Next.js 14 (App Router + TypeScript)
- PostgreSQL + Prisma
- JWT auth with HTTP-only secure cookies
- Tailwind CSS
- ESLint + Prettier
- GitHub Actions deploy to VPS/Plesk
- `app.js` startup entrypoint for Plesk/Passenger

## Folder Structure

```text
app/
  (public)/
  (protected)/
  (admin)/
  api/
components/
lib/
prisma/
styles/
types/
middleware.ts
app.js
.github/workflows/deploy.yml
```

## Auth & Security

- Password hashing with bcrypt (`bcryptjs`)
- JWT signed with `JWT_SECRET`
- Token stored in HTTP-only cookie (`drs_token`)
- Middleware protects `/dashboard`, `/profile`, `/bookings`, `/messages`, and `/admin/*`
- Provider-only listing creation
- Admin-only admin API endpoints

## API Endpoints

Auth:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

User:
- `GET /api/user/me`

Listings:
- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`

Bookings:
- `POST /api/bookings`
- `GET /api/bookings`
- `PUT /api/bookings/:id`

Messages:
- `POST /api/messages`
- `GET /api/messages`

Admin:
- `GET /api/admin/users`
- `GET /api/admin/bookings`
- `GET /api/admin/listings`

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

## Deployment Setup (GitHub Actions + VPS Node 20 + Plesk)

1. Configure repo secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`
2. Push to `main` to trigger `.github/workflows/deploy.yml`
3. On server use Node 20 and run production install/build
4. In Plesk set:
   - Application Root = project root
   - Application Startup File = `app.js`
   - Mode = `production`
5. Restart app from Plesk panel

Production run:

```bash
npm ci --omit=dev
npm run build
node app.js
```

## Environment Variables

Required in `.env`:

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`
- `PORT`

Optional:
- `HOST`

## Tailwind Configuration

- `tailwind.config.ts`
- `postcss.config.js`
- `styles/globals.css`

## Optional Extras You Can Add

- Email verification
- Password reset
- Stripe subscriptions
- Role management UI (Admin/Provider/Customer)
- File uploads (S3/Cloudinary)
- Real-time messaging
- Search and filters
