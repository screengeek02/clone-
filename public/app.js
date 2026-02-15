const texts = {
  en: {
    swipeTitle: 'Swipe Discovery',
    matchTitle: 'Matches',
    chatTitle: 'Chat',
    emptyState: 'No profiles available. Try another city.',
    chatHint: 'Select a match to open chat.',
    cityPlaceholder: 'City filter',
    pass: 'Pass',
    like: 'Like',
    superLike: 'Super Like',
    apply: 'Apply',
    send: 'Send'
  },
  es: {
    swipeTitle: 'Descubrimiento por Swipe',
    matchTitle: 'Matches',
    chatTitle: 'Chat',
    emptyState: 'No hay perfiles disponibles. Intenta otra ciudad.',
    chatHint: 'Selecciona un match para abrir el chat.',
    cityPlaceholder: 'Filtrar por ciudad',
    pass: 'Pasar',
    like: 'Me gusta',
    superLike: 'Súper Like',
    apply: 'Aplicar',
    send: 'Enviar'
  }
};

let profiles = [];
let index = 0;
let currentMatchId = null;
let lang = 'en';

const langSelect = document.getElementById('langSelect');
const cityFilter = document.getElementById('cityFilter');
const filterBtn = document.getElementById('filterBtn');
const passBtn = document.getElementById('passBtn');
const likeBtn = document.getElementById('likeBtn');
const superBtn = document.getElementById('superBtn');
const emptyState = document.getElementById('emptyState');
const card = document.getElementById('card');
const cardPhoto = document.getElementById('cardPhoto');
const cardName = document.getElementById('cardName');
const cardBio = document.getElementById('cardBio');
const cardMeta = document.getElementById('cardMeta');
const cardTags = document.getElementById('cardTags');
const matchBanner = document.getElementById('matchBanner');
const matchesList = document.getElementById('matchesList');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const messages = document.getElementById('messages');

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Request failed');
  }
  return response.json();
}

function setLanguage(nextLang) {
  lang = nextLang;
  const t = texts[lang];
  document.getElementById('swipeTitle').textContent = t.swipeTitle;
  document.getElementById('matchTitle').textContent = t.matchTitle;
  document.getElementById('chatTitle').textContent = t.chatTitle;
  document.getElementById('chatHint').textContent = t.chatHint;
  emptyState.textContent = t.emptyState;
  cityFilter.placeholder = t.cityPlaceholder;
  passBtn.textContent = t.pass;
  likeBtn.textContent = t.like;
  superBtn.textContent = t.superLike;
  filterBtn.textContent = t.apply;
  chatForm.querySelector('button').textContent = t.send;
}

function renderCard() {
  const profile = profiles[index];
  if (!profile) {
    card.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  card.classList.remove('hidden');
  cardPhoto.src = profile.photo;
  cardName.textContent = `${profile.name}, ${profile.age}`;
  cardBio.textContent = profile.bio;
  cardMeta.textContent = `${profile.city} • ${profile.likedYou ? 'Liked you' : 'Discovering'} `;

  cardTags.innerHTML = '';
  profile.tags.forEach((tag) => {
    const el = document.createElement('span');
    el.textContent = tag;
    cardTags.appendChild(el);
  });
}

async function loadProfiles() {
  const city = cityFilter.value.trim();
  const query = city ? `?city=${encodeURIComponent(city)}` : '';
  const data = await fetchJson(`/api/profiles${query}`);
  profiles = data.profiles;
  index = 0;
  renderCard();
}

async function handleSwipe(action) {
  const profile = profiles[index];
  if (!profile) return;

  const data = await fetchJson('/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ userId: profile.id, action })
  });

  if (data.matched) {
    matchBanner.textContent = `🎉 It's a match with ${data.match.name}!`;
    matchBanner.classList.remove('hidden');
    setTimeout(() => matchBanner.classList.add('hidden'), 2800);
    await loadMatches();
  }

  index += 1;
  renderCard();
}

async function loadMatches() {
  const data = await fetchJson('/api/matches');
  matchesList.innerHTML = '';

  data.matches.forEach((match, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${match.name}</strong><br/><small>${match.city}</small>`;
    li.addEventListener('click', () => openChat(match.id, li));
    if (i === 0 && !currentMatchId) {
      openChat(match.id, li);
    }
    matchesList.appendChild(li);
  });
}

function markSelected(selectedLi) {
  document.querySelectorAll('#matchesList li').forEach((li) => li.classList.remove('active'));
  selectedLi.classList.add('active');
}

async function openChat(matchId, selectedLi) {
  currentMatchId = matchId;
  if (selectedLi) markSelected(selectedLi);

  const data = await fetchJson(`/api/chats/${matchId}`);
  messages.innerHTML = '';
  data.messages.forEach((m) => {
    const row = document.createElement('div');
    row.className = `msg ${m.from === 'You' ? 'you' : ''}`;
    row.innerHTML = `<strong>${m.from}</strong><br/>${m.body}`;
    messages.appendChild(row);
  });

  messages.scrollTop = messages.scrollHeight;
  chatForm.classList.remove('hidden');
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = chatInput.value.trim();
  if (!body || !currentMatchId) return;

  await fetchJson(`/api/chats/${currentMatchId}`, {
    method: 'POST',
    body: JSON.stringify({ body })
  });

  chatInput.value = '';
  await openChat(currentMatchId);
});

langSelect.addEventListener('change', () => setLanguage(langSelect.value));
filterBtn.addEventListener('click', loadProfiles);
passBtn.addEventListener('click', () => handleSwipe('pass'));
likeBtn.addEventListener('click', () => handleSwipe('like'));
superBtn.addEventListener('click', () => handleSwipe('super_like'));

setLanguage('en');
loadProfiles();
loadMatches();
