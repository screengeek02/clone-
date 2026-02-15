# ConectaRD Web App (MVP)

This repo contains a runnable **web-first MVP** for ConectaRD.

- Backend: Node.js (`http` module) with simple persistent JSON database
- Frontend: static HTML/CSS/JS in `public/`
- Features: customer register/sign-in, swipe cards, like/pass/super-like, match list, basic chat, EN/ES toggle, city filter

> Full product spec is preserved in `docs/PRD.md`.

## 1) Quick start (local)

### Requirements
- Node.js 18+
- npm 9+

### Run
```bash
npm install
npm run dev
```

Open `http://localhost:3000`

### Health check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"ok":true,"app":"ConectaRD Web MVP"}
```

---

## 2) New: Customer sign-in + database

This version adds a real customer auth flow and persistent storage:

- Register with `name + email + password`
- Sign in with `email + password`
- Session token auth for protected actions
- Persistent user database in `data/users.json`
- Passwords are stored as `scrypt` hash + salt (no plain text)

### Auth endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (requires `Authorization: Bearer <token>`)

### Protected endpoints (require sign-in)
- `POST /api/swipe`
- `GET /api/matches`
- `GET /api/chats/:matchId`
- `POST /api/chats/:matchId`

---

## 3) Project structure

```txt
.
├── data/
│   └── users.json
├── docs/
│   └── PRD.md
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── package.json
├── server.js
└── README.md
```

---

## 4) Plesk + GitHub deployment (step-by-step)

### Important
If you are on **Extensions → Node.js Manager** and see versions like `25.x`, `24.x`, `22.x`, `20.x`, that page only confirms Node runtimes are installed globally.

You **cannot run your app from that page**.

Use your domain-level app page:

`Websites & Domains → your-domain.com → Node.js`

### If you do NOT see a Node.js icon in your domain dashboard
1. Go to **Tools & Settings → Updates and Upgrades → Add/Remove Components**.
2. Install **Node.js support** if missing.
3. Go to **Extensions** and install/update **Node.js Toolkit**.
4. Ensure your subscription/service plan allows Node.js management.
5. Ensure the domain uses **Web Hosting** (not forwarding-only).
6. Refresh `Websites & Domains`.

### Configure Node.js for this app
Set these values:
- **Node.js version**: `20.x` or `22.x`
- **Application Root**: `/httpdocs` (or `/httpdocs/conectard` if deployed in subfolder)
- **Document Root**: `/httpdocs/public` (or `/httpdocs/conectard/public`)
- **Application Startup File**: `server.js`
- **Application mode**: `production`

Then click:
1. **NPM Install**
2. **Restart App**

### Fix for `startup file /httpdocs/app.js is not found`
Change **Application Startup File** from `app.js` to:
```txt
server.js
```

### Fix for `EADDRINUSE` on port 3000
If Plesk log shows `EADDRINUSE` on `3000`:
1. Open Node.js settings for the domain.
2. Open **Custom environment variables**.
3. Remove `PORT=3000`.
4. Save and restart app.

Let Plesk provide/manage the app port when possible.

---

## 5) Scripts

```bash
npm run dev      # start app
npm run start    # start app
npm run check    # syntax check server.js
```
