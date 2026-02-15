const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');

const users = [
  { id: 'u1', name: 'Sofia', age: 26, city: 'Santo Domingo', tags: ['Nightlife', 'Friends'], bio: 'Bachata, beach sunsets, and good vibes.', likedYou: true, photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80' },
  { id: 'u2', name: 'Andrés', age: 29, city: 'Santiago', tags: ['Relationship', 'Casual'], bio: 'Coffee, gym, and weekend road trips.', likedYou: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
  { id: 'u3', name: 'Camila', age: 24, city: 'Punta Cana', tags: ['Tour guide', 'Nightlife'], bio: 'I know every beach and best party spots.', likedYou: true, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
  { id: 'u4', name: 'Miguel', age: 31, city: 'La Romana', tags: ['Friends'], bio: 'Baseball fan and foodie explorer.', likedYou: false, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' }
];

const swipes = [];
const matches = [];
const chats = {};

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (_err) {
        reject(new Error('Invalid JSON body'));
      }
    });
  });
}

function serveStatic(reqPath, res) {
  const safePath = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return notFound(res);
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      return notFound(res);
    }

    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8'
    };

    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return json(res, 200, { ok: true, app: 'ConectaRD Web MVP' });
  }

  if (req.method === 'GET' && url.pathname === '/api/profiles') {
    const city = (url.searchParams.get('city') || '').trim().toLowerCase();
    const profiles = city ? users.filter((u) => u.city.toLowerCase().includes(city)) : users;
    return json(res, 200, { profiles });
  }

  if (req.method === 'POST' && url.pathname === '/api/swipe') {
    try {
      const body = await parseBody(req);
      const { userId, action } = body;

      if (!userId || !['like', 'pass', 'super_like'].includes(action)) {
        return json(res, 400, { error: 'Invalid swipe payload.' });
      }

      const profile = users.find((u) => u.id === userId);
      if (!profile) return json(res, 404, { error: 'Profile not found.' });

      swipes.push({ userId, action, at: Date.now() });

      if (action === 'like' || action === 'super_like') {
        const matchExists = matches.some((m) => m.userId === userId);
        if (!matchExists && profile.likedYou) {
          const match = {
            id: `m-${Date.now()}`,
            userId,
            name: profile.name,
            city: profile.city,
            photo: profile.photo,
            createdAt: Date.now()
          };
          matches.unshift(match);
          chats[match.id] = [{ id: `msg-${Date.now()}`, from: profile.name, body: '¡Hola! Thanks for matching on ConectaRD 👋', at: Date.now() }];
          return json(res, 200, { matched: true, match });
        }
      }

      return json(res, 200, { matched: false });
    } catch (err) {
      return json(res, 400, { error: err.message });
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/matches') {
    return json(res, 200, { matches });
  }

  const chatGet = url.pathname.match(/^\/api\/chats\/([^/]+)$/);
  if (chatGet && req.method === 'GET') {
    const matchId = chatGet[1];
    if (!chats[matchId]) return json(res, 404, { error: 'Chat not found.' });
    return json(res, 200, { messages: chats[matchId] });
  }

  const chatPost = url.pathname.match(/^\/api\/chats\/([^/]+)$/);
  if (chatPost && req.method === 'POST') {
    const matchId = chatPost[1];
    if (!chats[matchId]) return json(res, 404, { error: 'Chat not found.' });

    try {
      const body = await parseBody(req);
      if (!body.body || !String(body.body).trim()) {
        return json(res, 400, { error: 'Message body is required.' });
      }

      const msg = { id: `msg-${Date.now()}`, from: 'You', body: String(body.body).trim(), at: Date.now() };
      chats[matchId].push(msg);
      return json(res, 201, { message: msg });
    } catch (err) {
      return json(res, 400, { error: err.message });
    }
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith('/api/')) {
    const handled = await handleApi(req, res, url);
    if (handled === null) {
      notFound(res);
    }
    return;
  }

  serveStatic(url.pathname, res);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(`Port ${PORT} is already in use. In Plesk, remove custom PORT=3000 and let Plesk assign the port automatically.`);
  }

  throw err;
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`ConectaRD web app running on ${HOST}:${PORT}`);
});
