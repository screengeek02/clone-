# Plesk Node.js Deployment Guide (AfriScienceNet Platform)

This guide deploys the standalone **Next.js + Prisma** platform on a server managed with **Plesk Node.js**.

---

## 1) Prerequisites

- Plesk with Node.js extension enabled.
- A domain/subdomain in Plesk (recommended: `platform.afrisciencenet.org`).
- PostgreSQL database (local or external) reachable from server.
- SSH access to the Plesk subscription (recommended).
- Node.js 20+ selected in Plesk.

---

## 2) Upload project

Upload the `afrisciencenet-platform` folder to your Plesk domain root, for example:

- `/httpdocs/afrisciencenet-platform`

> Keep this app standalone. Do not install it into WordPress directories.

---

## 3) Configure Node.js in Plesk

Open: **Websites & Domains → your domain → Node.js**

Set:

- **Node.js version**: `20.x` (or newer LTS)
- **Application mode**: `production`
- **Document root**: `/httpdocs/afrisciencenet-platform`
- **Application root**: `/httpdocs/afrisciencenet-platform`
- **Application startup file**: `server.js`

### Why startup file is `server.js`

Plesk Node.js expects a JS entrypoint. Next.js production runtime is launched by a small custom entry file (`server.js`) that starts Next in production mode.

---

## 4) Create startup file

Create `server.js` at the root of `afrisciencenet-platform` with:

```js
const { createServer } = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = false;
const app = next({ dev, hostname: '0.0.0.0', port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, '0.0.0.0', () => {
    console.log(`AfriScienceNet running on port ${port}`);
  });
});
```

---

## 5) Environment variables in Plesk

In Plesk Node.js panel, set environment variables:

- `NODE_ENV=production`
- `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB`
- `NEXTAUTH_SECRET=...`
- `NEXTAUTH_URL=https://platform.afrisciencenet.org`
- `EMAIL_FROM=noreply@afrisciencenet.org`
- `UPLOAD_DIR=./uploads`
- `MAP_PROVIDER=leaflet`
- `ENABLE_ELASTIC_ADAPTER=false`
- `ENABLE_S3_STORAGE=false`

Then click **Save**.

---

## 6) Install dependencies and build

Via SSH in app root:

```bash
cd httpdocs/afrisciencenet-platform
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run build
```

> Use `prisma migrate deploy` in production (not `migrate dev`).

---

## 7) Start/restart app in Plesk

Back to Node.js panel:

- Click **Restart App** (or **Enable Node.js** if first run).

Plesk proxies external traffic to internal Node `PORT` automatically.

---

## 8) File uploads (local MVP)

For local upload strategy:

- Ensure `UPLOAD_DIR` exists, e.g. `./uploads` under app root.
- Ensure filesystem permissions allow the web user to write there.
- For multi-server scaling later, switch to S3-compatible adapter.

---

## 9) Database and Prisma operational checks

Run on deploy:

```bash
npx prisma migrate deploy
npx prisma generate
```

Optional health checks:

- Open homepage: `https://platform.afrisciencenet.org`
- Test auth pages: `/login`, `/register`
- Test core modules: `/equipment`, `/researchers`, `/funding`, `/collaborations`, `/projects`, `/datasets`, `/map`

---

## 10) Common Plesk issues and fixes

### App does not start

- Confirm startup file is exactly `server.js`.
- Ensure `npm run build` finished successfully.
- Check Plesk Node.js logs for missing env vars.

### Prisma errors on startup

- Verify `DATABASE_URL` is valid and reachable.
- Run `npx prisma migrate deploy`.
- Run `npx prisma generate` after dependency updates.

### 502 / Bad Gateway

- App crashed or wrong startup file.
- Restart Node app in Plesk and inspect logs.

### Auth callback mismatch

- Set `NEXTAUTH_URL` to exact public HTTPS URL.

---

## 11) Production hardening checklist

- Enable HTTPS in Plesk (Let’s Encrypt).
- Use strong `NEXTAUTH_SECRET`.
- Restrict DB access by IP/security group/firewall.
- Schedule DB backups.
- Add monitoring for process restarts and error rates.
- Use CDN/WAF if needed.

---

## 12) Summary: startup file answer

For Plesk Node.js, the **startup file should be `server.js`** (placed in `afrisciencenet-platform/` root), which boots the Next.js production server.
