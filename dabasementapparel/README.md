# Da Basement Apparel (Next.js App Router)

Premium, static-first streetwear storefront concept with curated affiliate products, editorial journal content, and email capture.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Static content files in `/content`

## Run locally
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Full install/deploy guide for a VPS with Plesk (GitHub + Node.js)

This section walks you through deploying this project on a **VPS running Plesk** using GitHub for source control and the Plesk Node.js extension for runtime.

### 1) Prerequisites
- A VPS with Plesk installed and root/sudo access
- Plesk extensions installed:
  - **Git** extension installed
  - **Node.js** extension installed
  - Node.js 18+ available (recommended: Node 20 LTS)
- A domain or subdomain already added in Plesk (example: `dabasementapparel.com` or `shop.yourdomain.com`)
- A GitHub repo containing this project
- SSH access to the server (recommended for troubleshooting)

### 1.1) Initial VPS hardening + platform checks (recommended)
Run these once after provisioning the VPS:

```bash
sudo apt update && sudo apt upgrade -y
sudo timedatectl set-timezone UTC
sudo hostnamectl set-hostname <your-hostname>
```

Then verify Plesk + required components:

```bash
plesk version
plesk ext list | grep -E 'git|nodejs'
node -v
npm -v
```

If firewall is enabled on the VPS, allow web + ssh traffic:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2) Push this project to GitHub
From your local machine:

```bash
git init
git add .
git commit -m "Initial Da Basement Apparel build"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

If repo already exists, just push updates to your main branch.

### 3) Create/select domain in Plesk
1. In Plesk, go to **Websites & Domains**.
2. Select your target domain/subdomain.
3. Confirm document root exists (for example: `httpdocs`).
4. Ensure your DNS A record points to the VPS public IP.

### 4) Deploy code from GitHub using Plesk Git extension
1. Open **Git** under your selected domain.
2. Click **Add Repository**.
3. Repository URL:
   - HTTPS: `https://github.com/<your-user>/<your-repo>.git`
   - SSH (recommended for private repos)
4. Set branch to `main`.
5. Set **Deployment path** to a folder under the domain (example):
   - `/httpdocs/dabasementapparel`
6. Click **OK** and then **Pull Updates**.

> For private repos with HTTPS, use a GitHub Personal Access Token if prompted.

### 5) Configure Node.js app in Plesk
1. Go to **Websites & Domains → Node.js**.
2. Enable Node.js for this domain.
3. Set:
   - **Node.js version**: 18+ (preferably 20)
   - **Application mode**: `production`
   - **Application root**: `httpdocs/dabasementapparel`
   - **Document root**: `httpdocs/dabasementapparel` (or keep domain doc root and proxy to Node app)
   - **Application startup file**: `node_modules/next/dist/bin/next`
4. Add application environment variables:
   - `NODE_ENV=production`
   - `PORT=3000` (or let Plesk manage port if your setup requires)

### 6) Install dependencies and build on server
Use one of these methods:

#### Option A (Plesk Node.js UI)
- Use **NPM install** in the Node.js panel.
- Then open server terminal/SSH and run:

```bash
cd /var/www/vhosts/<domain>/httpdocs/dabasementapparel
npm run build
```

#### Option B (SSH only)
```bash
cd /var/www/vhosts/<domain>/httpdocs/dabasementapparel
npm install
npm run build
```

### 7) Set production startup command in Plesk
In **Node.js** app settings, configure startup to run Next in production.

Recommended startup parameters:
- **Application startup file**: `node_modules/next/dist/bin/next`
- **Application parameters**: `start -p 3000`

Then click **Restart App**.

### 8) Reverse proxy / web server notes
Typical Plesk setups place Nginx/Apache in front of Node.js. Ensure proxying is enabled so your domain routes traffic to the Node app.

For VPS deployments, also verify Nginx and Apache are running:

```bash
sudo systemctl status nginx --no-pager
sudo systemctl status apache2 --no-pager
```

If pages return 502/503:
- confirm app is running in Node.js panel,
- confirm `npm run build` completed,
- confirm startup file and parameters are correct,
- check logs (see section 11).

### 9) Automatic deploy on git push (recommended)
In the Plesk **Git** repository settings, configure an additional deploy action (post-deploy command), for example:

```bash
cd /var/www/vhosts/<domain>/httpdocs/dabasementapparel && npm install && npm run build && plesk ext nodejs --restart-app <domain>
```

If your server doesn’t support `plesk ext nodejs --restart-app`, restart manually from the Node.js panel after each pull.

### 10) SSL and domain
- Enable Let’s Encrypt SSL in Plesk for your domain.
- Force HTTPS redirect.
- Verify site works at `https://your-domain`.
- Confirm domain DNS is fully propagated to your VPS before requesting SSL.

### 11) Logs and troubleshooting
Check in Plesk:
- **Websites & Domains → Logs**
- **Node.js → application logs**

Common issues:
- `next: command not found` → use startup file `node_modules/next/dist/bin/next`
- build fails → run `npm install` and `npm run build` in app root
- blank page or 5xx → incorrect app root/document root or startup parameters
- permission errors → ensure deployment directory ownership/permissions are correct for web user
- domain not reachable → verify DNS A record points to VPS and ports 80/443 are open
- app restarts under memory pressure → increase VPS RAM/swap and rebuild

### 12) Updating after future GitHub pushes
1. Push changes to GitHub.
2. In Plesk Git panel, click **Pull Updates**.
3. Re-run:
   - `npm install` (if dependencies changed)
   - `npm run build`
4. Restart Node.js app.

---

## Content editing guide

### Add or edit products
File: `content/products.ts`

Each product supports:
- `slug` (used in `/product/[slug]`)
- `title`
- `category` (must match a category slug)
- `description`
- `whyWePickedThis`
- `howToStyle`
- `affiliateUrl` **(paste your Amazon affiliate URL here)**
- `image`, `gallery`
- Optional: `priceMin`, `priceMax`, `badges`, `trending`

### Add or edit categories
File: `content/categories.ts`

Each category supports:
- `slug` (used in `/category/[slug]`)
- `name`, `description`, `image`

### Add or edit journal posts
File: `content/posts.ts`

Each post supports:
- `slug`, `title`, `excerpt`, `date`, `coverImage`, `tags`
- `content` as markdown-like plain text:
  - `# Heading`
  - `## Subheading`
  - plain paragraphs separated by blank lines

## SEO included
- Global metadata in `lib/seo.ts`
- Route metadata on shop/category/product/journal/legal pages
- JSON-LD:
  - Product pages (`Product` schema)
  - Journal article pages (`Article` schema)
- `app/sitemap.ts`
- `app/robots.ts`

## Newsletter capture
Current implementation uses a simple `mailto:` form in `components/NewsletterCard.tsx` with a TODO to swap in ConvertKit/Beehiiv/etc.

## Notes
- This scaffold is static-first and optimized for easy migration to a headless CMS later (Sanity/Contentful) without redesigning UI components.
