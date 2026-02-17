const fs = require('fs');
const http = require('http');
const path = require('path');
const next = require('next');

const port = Number.parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';
const isProduction = process.env.NODE_ENV === 'production';

const hasProductionBuild = fs.existsSync(path.join(process.cwd(), '.next', 'BUILD_ID'));

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
    if (isProduction && !hasProductionBuild) {
      throw new Error(
        'No production build found (.next/BUILD_ID is missing). Run "npm run build" before starting in production.'
      );
    }

    const app = next({ dev: !isProduction, hostname: host, port });
    const handle = app.getRequestHandler();

    await app.prepare();

    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(port, host, () => {
      console.log(`> Next.js server ready on http://${host}:${port} (mode=${isProduction ? 'production' : 'development'})`);
    });
  } catch (error) {
    startErrorServer(error);
  }
}

start();
