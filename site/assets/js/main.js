(function () {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-main-nav]');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const forms = document.querySelectorAll('[data-validate-form]');

  forms.forEach((form) => {
    const status = form.querySelector('.form-status');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) {
          status.textContent = 'Please complete all required fields correctly.';
          status.classList.add('visible');
        }
        return;
      }

      if (status) {
        status.textContent = 'Thanks! Your request was submitted successfully. We will follow up soon.';
        status.classList.add('visible');
      }

      form.reset();
    });
  });
})();
