(function () {
  const animationSpeed = 500;

  const wrappers = document.querySelectorAll('.ob-menu-wrapper');
  if (!wrappers.length) {
    return;
  }

  wrappers.forEach((wrapper) => {
    const tabs = wrapper.querySelectorAll('.ob-menu-tab');
    const panels = wrapper.querySelectorAll('.ob-menu-panel');

    const activatePanel = (targetSlug) => {
      const currentPanel = wrapper.querySelector('.ob-menu-panel.is-active');
      const nextPanel = wrapper.querySelector(`.ob-menu-panel[data-panel="${targetSlug}"]`);

      if (!nextPanel || currentPanel === nextPanel) {
        return;
      }

      if (currentPanel) {
        currentPanel.classList.add('ob-flip-active');

        window.setTimeout(() => {
          currentPanel.classList.remove('is-active', 'ob-flip-active');
          nextPanel.classList.add('is-active');
        }, animationSpeed);
      } else {
        nextPanel.classList.add('is-active');
      }

      tabs.forEach((tab) => {
        const isActive = tab.dataset.target === targetSlug;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
      });
    };

    tabs.forEach((tab) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('is-active') ? 'true' : 'false');

      tab.addEventListener('click', () => {
        const targetSlug = tab.dataset.target;
        if (targetSlug) {
          activatePanel(targetSlug);
        }
      });
    });

    panels.forEach((panel) => panel.setAttribute('role', 'tabpanel'));
  });
})();
