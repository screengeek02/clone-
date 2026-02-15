const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const USERS_DB_PATH = path.join(DATA_DIR, 'users.json');

const sessions = new Map();

const demoProfiles = [
  { id: 'u1', name: 'Sofia', age: 26, city: 'Santo Domingo', tags: ['Nightlife', 'Friends'], bio: 'Bachata, beach sunsets, and good vibes.', likedYou: true, photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80' },
  { id: 'u2', name: 'Andrés', age: 29, city: 'Santiago', tags: ['Relationship', 'Casual'], bio: 'Coffee, gym, and weekend road trips.', likedYou: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
  { id: 'u3', name: 'Camila', age: 24, city: 'Punta Cana', tags: ['Tour guide', 'Nightlife'], bio: 'I know every beach and best party spots.', likedYou: true, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
  { id: 'u4', name: 'Miguel', age: 31, city: 'La Romana', tags: ['Friends'], bio: 'Baseball fan and foodie explorer.', likedYou: false, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' }
];

const swipes = [];
const matches = [];
const chats = {};

function ensureUsersDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_DB_PATH)) {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

function readUsersDb() {
  ensureUsersDb();
  const raw = fs.readFileSync(USERS_DB_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.users) ? parsed : { users: [] };
}

function writeUsersDb(db) {
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify(db, null, 2));
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

function getBearerToken(req) {
  const value = req.headers.authorization || '';
  if (!value.startsWith('Bearer ')) return null;
  return value.replace('Bearer ', '').trim();
}

function getAuthenticatedUser(req) {
  const token = getBearerToken(req);
  if (!token) return null;
  return sessions.get(token) || null;
}

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
      resolve(JSON.parse(data));
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

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    try {
      const body = await parseBody(req);
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');

      if (!name || !email || !password) {
        return json(res, 400, { error: 'name, email and password are required.' });
      }

      const db = readUsersDb();
      const exists = db.users.some((u) => u.email === email);
      if (exists) {
        return json(res, 409, { error: 'Email already registered.' });
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(password, salt);
      const user = {
        id: crypto.randomUUID(),
        name,
        email,
        salt,
        passwordHash,
        createdAt: new Date().toISOString()
      };

      db.users.push(user);
      writeUsersDb(db);

      const token = crypto.randomBytes(24).toString('hex');
      const safeUser = sanitizeUser(user);
      sessions.set(token, safeUser);
      return json(res, 201, { token, user: safeUser });
    } catch (_err) {
      return json(res, 400, { error: 'Invalid JSON body.' });
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    try {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');

      if (!email || !password) {
        return json(res, 400, { error: 'email and password are required.' });
      }

      const db = readUsersDb();
      const user = db.users.find((u) => u.email === email);
      if (!user) {
        return json(res, 401, { error: 'Invalid credentials.' });
      }

      const incoming = hashPassword(password, user.salt);
      if (incoming !== user.passwordHash) {
        return json(res, 401, { error: 'Invalid credentials.' });
      }

      const token = crypto.randomBytes(24).toString('hex');
      const safeUser = sanitizeUser(user);
      sessions.set(token, safeUser);
      return json(res, 200, { token, user: safeUser });
    } catch (_err) {
      return json(res, 400, { error: 'Invalid JSON body.' });
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return json(res, 401, { error: 'Unauthorized.' });
    }

    return json(res, 200, { user });
  }

  if (req.method === 'GET' && url.pathname === '/api/profiles') {
    const city = (url.searchParams.get('city') || '').trim().toLowerCase();
    const profiles = city ? demoProfiles.filter((u) => u.city.toLowerCase().includes(city)) : demoProfiles;
    return json(res, 200, { profiles });
  }

  if (req.method === 'POST' && url.pathname === '/api/swipe') {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return json(res, 401, { error: 'Sign in first.' });
    }

    try {
      const body = await parseBody(req);
      const { userId, action } = body;

      if (!userId || !['like', 'pass', 'super_like'].includes(action)) {
        return json(res, 400, { error: 'Invalid swipe payload.' });
      }

      const profile = demoProfiles.find((u) => u.id === userId);
      if (!profile) return json(res, 404, { error: 'Profile not found.' });

      swipes.push({ actor: authUser.id, userId, action, at: Date.now() });

      if (action === 'like' || action === 'super_like') {
        const matchExists = matches.some((m) => m.userId === userId && m.ownerId === authUser.id);
        if (!matchExists && profile.likedYou) {
          const match = {
            id: `m-${Date.now()}`,
            ownerId: authUser.id,
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
    } catch (_err) {
      return json(res, 400, { error: 'Invalid JSON body.' });
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/matches') {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return json(res, 401, { error: 'Sign in first.' });
    }

    return json(res, 200, { matches: matches.filter((m) => m.ownerId === authUser.id) });
  }

  const chatGet = url.pathname.match(/^\/api\/chats\/([^/]+)$/);
  if (chatGet && req.method === 'GET') {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return json(res, 401, { error: 'Sign in first.' });
    }

    const matchId = chatGet[1];
    const match = matches.find((m) => m.id === matchId && m.ownerId === authUser.id);
    if (!match) return json(res, 404, { error: 'Chat not found.' });
    return json(res, 200, { messages: chats[matchId] || [] });
  }

  const chatPost = url.pathname.match(/^\/api\/chats\/([^/]+)$/);
  if (chatPost && req.method === 'POST') {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return json(res, 401, { error: 'Sign in first.' });
    }

    const matchId = chatPost[1];
    const match = matches.find((m) => m.id === matchId && m.ownerId === authUser.id);
    if (!match) return json(res, 404, { error: 'Chat not found.' });

    try {
      const body = await parseBody(req);
      if (!body.body || !String(body.body).trim()) {
        return json(res, 400, { error: 'Message body is required.' });
      }

      const msg = { id: `msg-${Date.now()}`, from: 'You', body: String(body.body).trim(), at: Date.now() };
      chats[matchId].push(msg);
      return json(res, 201, { message: msg });
    } catch (_err) {
      return json(res, 400, { error: 'Invalid JSON body.' });
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
