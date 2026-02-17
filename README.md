# Next.js Prisma Auth Starter

A production-ready starter project using **Next.js App Router**, **PostgreSQL + Prisma**, **JWT authentication**, and **Tailwind CSS**.

## What is the application?

This repository is a full Next.js web app starter. When it is running correctly, opening your domain should show the app home page titled **"Next.js Prisma Auth Starter"** with navigation links to:

- Home (`/`)
- Sign Up (`/register`)
- Login (`/login`)
- Dashboard (`/dashboard`)

If you only see the default Plesk page, your Node app is not currently the page being served for the domain.

## Features

- Next.js 14 App Router with TypeScript
- Prisma ORM with PostgreSQL
- Secure password hashing using bcrypt
- JWT authentication for login sessions
- Protected `/dashboard` route with middleware
- Tailwind CSS starter UI
- ESLint + Prettier configuration
- `.env.example` for local setup
- `app.js` startup file for hosts that require an explicit Node entrypoint (for example Plesk)

## Project structure

```text
app/
  api/
    auth/
      login/route.ts
      signup/route.ts
  dashboard/page.tsx
  login/page.tsx
  register/page.tsx
  layout.tsx
  page.tsx
components/
  Footer.tsx
  Header.tsx
lib/
  auth.ts
  prisma.ts
prisma/
  schema.prisma
app.js
middleware.ts
```

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Set up environment variables

Copy `.env.example` to `.env` and update values.

```bash
cp .env.example .env
```

Required values:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Long random secret used to sign JWT tokens

### 3) Run Prisma migration

```bash
npx prisma migrate dev --name init
```

### 4) Run local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5) Build and start production

```bash
npm run build
npm run start
```

`npm run start` runs `node app.js`, which starts Next.js using a standard Node startup file.

## Deploying on hosts that require an application startup file (example: Plesk)

If your control panel expects an entrypoint file like `app.js`:

1. Set **Application Startup File** to `app.js`.
2. Ensure `NODE_ENV=production` is set.
3. Set `PORT` if your provider requires a specific port.
4. Run install/build once:

```bash
npm install
npm run build
```

5. Start or restart the Node.js app from the control panel.

## Plesk: seeing only the default page? (important)

If your browser shows the Plesk default page instead of this app, usually one of these is true:

1. **A static default file is being served first** (for example `index.html` in `httpdocs`).
2. **Node app is not actually running** (or crashed after start).
3. **Domain hosting type is not set to Node.js app/proxy for this domain**.

Use this checklist:

1. In **File Manager**, remove or rename `httpdocs/index.html` (Plesk default page).
2. Confirm **Application Root** points to the folder that contains this project (`package.json`, `app.js`, `app/`).
3. Confirm **Application Startup File** is `app.js`.
4. In **Run script** / terminal, run:

```bash
npm install
npm run build
npm run start
```

5. Click **Restart App** in Plesk.
6. Check **Logs** for startup errors (missing env vars, DB connection errors, etc.).
7. If needed, set **Document Root** to `httpdocs` and ensure there is no static index file shadowing the Node app.

After this, the domain root should load the Next.js starter home page.

Note: Tailwind/PostCSS packages are kept in `dependencies` (not only `devDependencies`) to avoid missing-CSS-loader issues on hosts that install production packages only.



## Plesk/Passenger error page: "We're sorry, but something went wrong"

That page means the Node app crashed before serving requests. In this starter, you should now get a plain-text startup error if boot fails, but you should still verify logs in Plesk.

Quick fix sequence:

```bash
npm install
npm run build
npm run start
```

Then in Plesk:

1. Confirm **Application Startup File** is `app.js`.
2. Confirm **Application Root** is the folder with `package.json`.
3. Confirm `.env` exists with `DATABASE_URL` and `JWT_SECRET`.
4. Click **Restart App** and re-open the domain.

If `npm run build` was skipped, `app.js` now returns a clear startup error page that tells you to build first (instead of attempting a broken fallback).

## API endpoints

### `POST /api/auth/signup`

Request body:

```json
{
  "email": "user@example.com",
  "password": "strongpassword"
}
```

- Validates input
- Hashes password with bcrypt
- Creates user in PostgreSQL via Prisma

### `POST /api/auth/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "strongpassword"
}
```

- Validates credentials
- Returns signed JWT token on success

## Security notes

- Passwords are never stored in plaintext
- JWT secret is loaded from environment variables
- Dashboard route is protected by middleware + server-side token verification
- Password minimum length is enforced on signup

## Troubleshooting

If you see an error like `Configuring Next.js via 'next.config.ts' is not supported`, ensure your project uses `next.config.js` or `next.config.mjs`. This starter already uses `next.config.js` for compatibility with control-panel and shared-host environments.

## Custom folders in this starter

- `app/`: App Router pages and API route handlers.
- `components/`: Reusable UI building blocks (header/footer now, can grow later).
- `lib/`: Shared server/client utilities (auth helpers, Prisma singleton).
- `prisma/`: Database schema and Prisma artifacts.
- `.github/workflows/`: CI/CD automation (build/deploy workflow).

You can also add these optional folders as the project grows:

- `emails/`: Transactional email templates.
- `uploads/` or cloud adapter modules under `lib/storage/` for file handling.
- `features/` for domain modules (billing, messaging, search) if you want feature-first organization.

=============================
9) Deployment Setup
=============================

This starter supports deployment with **GitHub Actions**, a **VPS with Node 20**, and a **Plesk server**.

### GitHub Actions

A workflow is included at:

- `.github/workflows/deploy.yml`

It does:

1. Checkout code
2. Use Node.js 20
3. Install dependencies (`npm ci`)
4. Build (`npm run build`)
5. SSH deploy to your VPS/Plesk host

Set repository secrets before enabling deployment:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT`

### VPS (Node 20)

On your server:

```bash
node -v   # should show v20.x
npm -v
npm ci
npm run build
npm run start
```

### Plesk Server

In Node.js settings:

- **Application Root**: folder with `package.json`
- **Application Startup File**: `app.js`
- **Application Mode**: `production`

Then:

```bash
npm ci --omit=dev
npm run build
npm run start
```

### Environment variables (`.env`)

Required:

- `DATABASE_URL`
- `JWT_SECRET`

Optional useful vars for hosting:

- `NODE_ENV=production`
- `PORT` (if host requires custom port)
- `HOST=0.0.0.0`

### Tailwind CSS configuration

Tailwind is configured through:

- `tailwind.config.ts`
- `postcss.config.js`
- `app/globals.css`

To avoid host issues, `tailwindcss`, `postcss`, and `autoprefixer` are in runtime `dependencies`.

=============================
10) Additional Features (Optional)
=============================

Possible upgrades you can add next:

- **Email verification** (verify account after signup)
- **Password reset** (token-based reset flow)
- **Stripe subscriptions** (billing plans, webhook handling)
- **Multi-role auth** (Admin / Provider / Customer)
- **File uploads** (S3/Cloudinary + signed upload URLs)
- **Messaging system** (inbox/chat with real-time updates)
- **Search & filters** (full-text search + indexed filters)

