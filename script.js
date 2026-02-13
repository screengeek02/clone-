const roleData = {
  client: {
    title: 'Client App',
    description: 'Built for homeowners, Airbnb hosts, expats, and property managers.',
    features: [
      'Book instantly or schedule in advance',
      'Get instant quotes based on home details',
      'Track cleaner arrival on live map',
      'Message cleaner in-app and pay securely',
      'Rate and rebook preferred cleaners',
    ],
  },
  cleaner: {
    title: 'Cleaner App',
    description: 'For independent cleaners, teams, and agencies.',
    features: [
      'Accept or decline requests in real time',
      'See payout before accepting a job',
      'Navigate with GPS and update job status',
      'Upload before/after photos for proof',
      'Track weekly earnings and availability',
    ],
  },
  admin: {
    title: 'Admin Dashboard',
    description: 'Command center for operations and quality control.',
    features: [
      'Approve cleaner profiles and ID verification',
      'Manage commissions, pricing, and promos',
      'Resolve disputes and monitor reviews',
      'Analyze revenue and demand heatmaps',
      'Trigger push notifications and campaigns',
    ],
  },
};

const rolePanel = document.getElementById('rolePanel');
const tabs = document.querySelectorAll('.tab');

function renderRole(role) {
  const item = roleData[role];
  rolePanel.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <ul>
      ${item.features.map((feature) => `<li>${feature}</li>`).join('')}
    </ul>
  `;
}

renderRole('client');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((btn) => btn.classList.remove('active'));
    tab.classList.add('active');
    renderRole(tab.dataset.role);
  });
});

const estimateForm = document.getElementById('estimate-form');
const estimateResult = document.getElementById('estimateResult');

const serviceMultipliers = {
  standard: 1,
  deep: 1.4,
  move: 1.55,
  airbnb: 1.2,
  office: 1.3,
};

estimateForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const serviceType = document.getElementById('serviceType').value;
  const bedrooms = Number(document.getElementById('bedrooms').value);
  const bathrooms = Number(document.getElementById('bathrooms').value);
  const sqft = Number(document.getElementById('sqft').value);
  const urgent = document.getElementById('urgent').checked;

  let total = 30 + bedrooms * 12 + bathrooms * 10 + (sqft / 100) * 2.5;
  total *= serviceMultipliers[serviceType] ?? 1;

  if (urgent) {
    total *= 1.2;
  }

  const finalPrice = Math.round(total);
  estimateResult.innerHTML = `Estimated total: <strong>$${finalPrice}</strong>`;
});
