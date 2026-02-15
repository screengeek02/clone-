# ConectaRD Web App (MVP)

This repo contains a runnable **web-first MVP** for ConectaRD.

- Backend: Node.js (built-in `http`, no external runtime dependency required)
- Frontend: static HTML/CSS/JS in `public/`
- Features: swipe cards, like/pass/super-like, match list, basic chat, EN/ES toggle, city filter

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

## 2) Project structure

```txt
.
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

## 3) Plesk + GitHub deployment (step-by-step)

### Important (based on your screenshot)
If you are on **Extensions → Node.js Manager** and see versions like `25.x`, `24.x`, `22.x`, `20.x`, that page only confirms Node runtimes are installed globally.

You **cannot run your app from that page**.

To run `npm install`, go to your **domain-level Node.js page**:

`Websites & Domains → your-domain.com → Node.js`

### If you do NOT see a Node.js icon in your domain dashboard (your latest screenshot)
Do this first:
1. Go to **Tools & Settings → Updates and Upgrades → Add/Remove Components**.
2. Install **Node.js support** (Plesk component) if it is missing.
3. Go to **Extensions** and install/update **Node.js Toolkit**.
4. Open your subscription/service plan permissions and ensure Node.js management is allowed for that domain.
5. Confirm the domain is using **Web Hosting** (not Forwarding only).
6. Return to **Websites & Domains** and refresh. The **Node.js** card should appear under Dev Tools.

If Node.js still does not appear, this is a server-level permission/license issue; ask your VPS admin/host to enable Node.js for the subscription.

### A) Connect GitHub repository
1. Go to `Websites & Domains → your-domain.com → Git`.
2. Add your GitHub repository URL.
3. Set deployment path (example): `httpdocs/conectard`.
4. Enable auto-deploy on push (optional but recommended).

### B) Configure Node.js for that domain
1. Go to `Websites & Domains → your-domain.com → Node.js`.
2. Set:
   - **Node.js version**: choose `20.x` or `22.x` (LTS preferred)
   - **Application root**: `httpdocs/conectard`
   - **Document root**: `httpdocs/conectard/public`
   - **Application startup file**: `server.js`
   - **Application mode**: `production`
3. Click **Enable Node.js**.

### C) Run npm install in Plesk
In that same Node.js page:
1. Click **NPM Install**.
2. Wait for completion.
3. Click **Restart App**.

That button is the Plesk equivalent of:
```bash
npm install
```

### D) Optional post-deploy command for Git pulls
In Git deployment actions, add:
```bash
npm install --production
```

### E) Verify deployment
- Open: `https://your-domain.com`
- Check API: `https://your-domain.com/api/health`

---

## 4) If `npm install` fails in Plesk

Check these in order:
1. **Wrong app root** (must be folder containing `package.json`).
2. **Wrong startup file** (must be `server.js`).
3. **Node version mismatch** (use LTS 20/22).
4. **Server outbound firewall/proxy blocks npm registry**.
5. **File permissions** on deployment directory.

### SSH fallback (server admin)
If needed, install via SSH from app root:
```bash
cd /var/www/vhosts/<domain>/httpdocs/conectard
npm install --production
```

If `npm` is not in PATH, use full Plesk path from your screenshot, e.g.:
```bash
/opt/plesk/node/20/bin/npm install --production
```

---

## 5) Scripts

```bash
npm run dev      # start app
npm run start    # start app
npm run check    # syntax check server.js
```
