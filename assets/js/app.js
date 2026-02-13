const navGroups = {
  Product: [['How it works', '/how-it-works/'], ['What we test', '/what-we-test/'], ['Gift', '/gift/']],
  Learn: [['FAQs', '/faqs/'], ['Reviews', '/reviews/'], ['Blog', '/blog/']],
  Other: [['For teams', '/for-teams/'], ['Our why', '/our-why/']]
};

function headerTemplate(){
  const groups = Object.entries(navGroups).map(([title, links]) => `
    <div class="nav-group">
      <button aria-haspopup="true" aria-expanded="false">${title}</button>
      <div class="dropdown panel">${links.map(([n,h]) => `<a href="${h}">${n}</a>`).join('')}</div>
    </div>`).join('');

  const mobileGroups = Object.entries(navGroups).map(([title, links]) => `
    <div><p class="small">${title}</p>${links.map(([n,h])=>`<a class="btn btn-secondary" style="display:block;margin:6px 0" href="${h}">${n}</a>`).join('')}</div>`).join('');

  return `<header class="header"><div class="container header-inner"><a class="brand" href="/" aria-label="Black Pearl Gift Shop Punta Cana home"><img class="brand-logo" src="/public/logo-black-pearl.svg" alt="Black Pearl Gift Shop Punta Cana" /></a><nav class="nav-desktop">${groups}</nav><button id="openMenu" class="menu-toggle">Menu</button></div></header>
  <div id="mobileMenu" class="mobile-menu panel" role="dialog" aria-modal="true" aria-label="Mobile navigation"><div style="display:flex;justify-content:space-between"><strong>Navigate</strong><button id="closeMenu" class="menu-toggle" style="display:block">Close</button></div><div style="margin-top:8px">${mobileGroups}</div></div>`;
}

function footerTemplate(){
  return `<footer class="footer"><div class="container cols"><div><h3>VitalSpring</h3><p class="small">Proactive biomarker intelligence with clinician-guided action plans.</p></div><div><strong>Product</strong><p class="small"><a href="/how-it-works/">How it works</a><br><a href="/what-we-test/">What we test</a></p></div><div><strong>Company</strong><p class="small"><a href="/our-why/">Our why</a><br><a href="/for-teams/">For teams</a></p></div><div><strong>Legal</strong><p class="small"><a href="/legal/privacy/">Privacy</a><br><a href="/legal/terms/">Terms</a><br><a href="/legal/consent/">Consent</a></p></div></div></footer>`;
}

function mountShell(){
  document.body.insertAdjacentHTML('afterbegin', headerTemplate());
  document.body.insertAdjacentHTML('beforeend', footerTemplate());

  const mobile = document.getElementById('mobileMenu');
  const open = document.getElementById('openMenu');
  const close = document.getElementById('closeMenu');
  const desktopGroups = document.querySelectorAll('.nav-group');

  function trap(e){
    if(!mobile.classList.contains('open')) return;
    const f = mobile.querySelectorAll('a,button');
    const first = f[0], last = f[f.length-1];
    if(e.key === 'Escape') mobile.classList.remove('open');
    if(e.key === 'Tab'){
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  open?.addEventListener('click', ()=>{ mobile.classList.add('open'); mobile.querySelector('button,a')?.focus(); });
  close?.addEventListener('click', ()=>mobile.classList.remove('open'));
  document.addEventListener('keydown', trap);

  desktopGroups.forEach((group) => {
    let timer;
    const trigger = group.querySelector('button');

    const openGroup = () => {
      clearTimeout(timer);
      desktopGroups.forEach((g) => {
        g.classList.remove('open');
        g.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      group.classList.add('open');
      trigger?.setAttribute('aria-expanded', 'true');
    };

    const closeGroup = () => {
      timer = setTimeout(() => {
        group.classList.remove('open');
        trigger?.setAttribute('aria-expanded', 'false');
      }, 280);
    };

    group.addEventListener('mouseenter', openGroup);
    group.addEventListener('mouseleave', closeGroup);
    trigger?.addEventListener('focus', openGroup);
  });

  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element) || !e.target.closest('.nav-group')) {
      desktopGroups.forEach((group) => {
        group.classList.remove('open');
        group.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

function initFAQ(){
  document.querySelectorAll('.faq-item button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
      btn.setAttribute('aria-expanded', item.classList.contains('open'));
    });
  });
}

function initPricing(){
  const out = document.getElementById('priceOutput');
  document.querySelectorAll('[data-price]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('[data-price]').forEach(n=>n.classList.remove('active'));
      btn.classList.add('active');
      out.textContent = `$${btn.dataset.price}/year · ${btn.dataset.savings}`;
    });
  });
}

function initBiomarkers(){
  const tabs = document.querySelectorAll('.tab[data-category]');
  const search = document.getElementById('bioSearch');
  const cards = document.querySelectorAll('.bio-card');
  const modal = document.getElementById('bioModal');

  function filter(){
    const active = document.querySelector('.tab.active')?.dataset.category || 'All';
    const q = (search?.value || '').toLowerCase();
    cards.forEach(c=>{
      const okCategory = active === 'All' || c.dataset.category === active;
      const okText = c.dataset.name.toLowerCase().includes(q);
      c.style.display = okCategory && okText ? 'block' : 'none';
    });
  }

  tabs.forEach(tab=>tab.addEventListener('click', ()=>{
    tabs.forEach(t=>t.classList.remove('active')); tab.classList.add('active'); filter();
  }));
  search?.addEventListener('input', filter);

  cards.forEach(card=>card.addEventListener('click', ()=>{
    modal.innerHTML = `<button class="btn btn-secondary" id="closeBio">Close</button><h3>${card.dataset.name}</h3><p>Meaning: ${card.dataset.meaning}</p><p class="small">Optimal range: placeholder and context-dependent.</p><p class="small">How to improve: nutrition, movement progression, sleep consistency, and targeted support.</p>`;
    modal.classList.add('open');
    document.getElementById('closeBio').addEventListener('click', ()=>modal.classList.remove('open'));
  }));
}

document.addEventListener('DOMContentLoaded', ()=>{
  mountShell();
  initFAQ();
  initPricing();
  initBiomarkers();
});
