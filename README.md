# ConectaRD Web App (MVP)

This repository now includes a **working web app first** (as requested), plus the original long-form product spec.

- Web app (Node.js + Express + static frontend): swipe discovery, match creation, and basic chat.
- Bilingual UI toggle (English / Español).
- City filter for local discovery simulation.
- API endpoints for profiles, swipe actions, matches, and chats.

> Original detailed PRD is preserved in: `docs/PRD.md`.

## 1) Quick Start (Local)

### Requirements
- Node.js 18+
- npm 9+

### Install and run
```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

### Health check
```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{"ok":true,"app":"ConectaRD Web MVP"}
```

---

## 2) What is implemented

### Frontend
- Swipe-style card UI
- Actions: Pass / Like / Super Like
- Match banner on mutual like
- Matches list
- Chat panel with simple message send
- Language switch (EN/ES)
- City filter input

### Backend (in-memory for MVP demo)
- `GET /api/health`
- `GET /api/profiles?city=`
- `POST /api/swipe`
- `GET /api/matches`
- `GET /api/chats/:matchId`
- `POST /api/chats/:matchId`

> Note: Data is currently in-memory and resets on restart. This is intentional for fast MVP validation.

---

## 3) Project Structure

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

## 4) Deploy to VPS with Plesk + GitHub Extension

This section is optimized for your plan to use the **Plesk GitHub extension**.

### A. Prepare your server
1. In Plesk, install:
   - **Git** extension
   - **Node.js** support (if not preinstalled)
2. Make sure your domain/subdomain is created (example: `app.yourdomain.com`).
3. Enable SSL (Let's Encrypt) in Plesk before going live.

### B. Connect GitHub repository in Plesk
1. Open your domain in Plesk.
2. Go to **Git**.
3. Click **Add Repository**.
4. Use your GitHub repo URL.
5. Set deployment path, e.g.:
   - `/httpdocs/conectard` (or the default Plesk path for the domain)
6. Enable **Automatic deployment on push**.

### C. Configure Node.js app in Plesk
1. Go to **Node.js** for the same domain.
2. Set:
   - **Document root**: `httpdocs/conectard/public`
   - **Application root**: `httpdocs/conectard`
   - **Application startup file**: `server.js`
   - **Application mode**: `production`
3. Click **NPM Install** in Plesk Node.js panel.
4. Add environment variable:
   - `PORT=3000` (or let Plesk manage internal port)
5. Click **Enable Node.js** and then **Restart App**.

### D. Auto-deploy command (post-pull)
In Plesk Git deployment settings, add this deploy action:
```bash
npm install --production
```
Then restart app from Node.js panel.

### E. Verify deployment
After deployment:
- Visit: `https://app.yourdomain.com`
- Test health endpoint:
  - `https://app.yourdomain.com/api/health`

If it fails:
- Check Plesk logs (Node.js logs + domain logs)
- Confirm startup file is `server.js`
- Confirm app root/document root paths

---

## 5) Production hardening next steps

For real production use, implement next:
1. PostgreSQL for persistent users/matches/messages
2. Auth with phone OTP (Twilio/MessageBird)
3. Session/auth tokens (JWT + refresh)
4. File storage for profile photos (S3 compatible)
5. Redis for rate limits + queueing
6. Abuse prevention + moderation queue
7. Payment integration (Stripe + app-store billing for mobile)

---

## 6) Scripts

```bash
npm run dev      # start app
npm run start    # start app
npm run check    # syntax check server.js
```
