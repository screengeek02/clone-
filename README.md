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
