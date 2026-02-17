const fs = require('fs');
const http = require('http');
const path = require('path');
const next = require('next');

const port = Number.parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';

const hasProductionBuild = fs.existsSync(path.join(process.cwd(), '.next', 'BUILD_ID'));
const shouldUseDev = process.env.NODE_ENV !== 'production' || !hasProductionBuild;

function startErrorServer(error) {
  const message = [
    'Application failed to start.',
    '',
    `Reason: ${error instanceof Error ? error.message : String(error)}`,
    '',
    'Common fixes for Plesk/Passenger:',
    '1) Run npm install',
    '2) Run npm run build',
    '3) Ensure .env contains DATABASE_URL and JWT_SECRET',
    '4) Restart the app in the control panel'
  ].join('\n');

  console.error(message);

  const server = http.createServer((req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(message);
  });

  server.listen(port, host, () => {
    console.error(`Fallback error server listening on http://${host}:${port}`);
  });
}

async function start() {
  try {
    if (process.env.NODE_ENV === 'production' && !hasProductionBuild) {
      console.warn('No .next production build found; starting Next.js in development mode.');
      console.warn('Run "npm run build" for proper production deployment.');
    }

    const app = next({ dev: shouldUseDev, hostname: host, port });
    const handle = app.getRequestHandler();

    await app.prepare();

    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(port, host, () => {
      console.log(`> Next.js server ready on http://${host}:${port} (dev=${shouldUseDev})`);
    });
  } catch (error) {
    startErrorServer(error);
  }
}

start();
