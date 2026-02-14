const track = document.getElementById('carousel-track');
const slides = track ? Array.from(track.children) : [];
let current = 0;

function renderSlide(index) {
  if (!track || !slides.length) return;
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
}

document.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
  renderSlide(current + 1);
});

document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
  renderSlide(current - 1);
});

setInterval(() => {
  if (slides.length > 1) renderSlide(current + 1);
}, 5000);

const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const requiredFields = Array.from(form.querySelectorAll('[required]'));
  const invalidField = requiredFields.find((field) => !field.value.trim());

  if (invalidField) {
    statusEl.textContent = 'Please complete all required fields.';
    statusEl.style.color = '#b91c1c';
    invalidField.focus();
    return;
  }

  const email = form.elements.email.value;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    statusEl.textContent = 'Please enter a valid email address.';
    statusEl.style.color = '#b91c1c';
    form.elements.email.focus();
    return;
  }

  statusEl.textContent = 'Thanks! Your request was received. A coordinator will contact you shortly.';
  statusEl.style.color = '#166534';
  form.reset();
});

Array.from(document.querySelectorAll('.faq-q')).forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
