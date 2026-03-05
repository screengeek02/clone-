# Afrisciencenet Platform Upgrade

This repository now contains an MVP scaffold for a modular Afrisciencenet platform:

- `afrisciencenet-platform/frontend`: React homepage UI with modern 3D SaaS styling
- `afrisciencenet-platform/backend`: Node.js/Express API (equipment listing endpoints)
- `afrisciencenet-platform/database`: SQL schema + seed data
- `afrisciencenet-platform/docs`: architecture notes
- `afrisciencenet-platform/ui`: UI placeholder directory
- `afrisciencenet-platform/components`: shared component placeholder directory

## Quick start (backend)

```bash
cd afrisciencenet-platform/backend
npm install
npm run dev
```

Then open:
- `GET http://localhost:4000/api/health`
- `GET http://localhost:4000/api/equipment`
