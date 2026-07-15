class WikiTableOfContents extends HTMLElement {
  private initialized = false;

  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    const groups = [...this.querySelectorAll<HTMLDetailsElement>('[data-wiki-toc-group]')];
    const toggle = this.querySelector<HTMLButtonElement>('[data-wiki-toc-toggle-all]');
    const links = [...this.querySelectorAll<HTMLAnchorElement>('a[data-wiki-toc-link]')];
    const mobilePanel = this.querySelector<HTMLDetailsElement>('[data-wiki-mobile-panel]');
    const currentLabel = this.querySelector<HTMLElement>('[data-wiki-toc-current]');

    const updateToggle = () => {
      if (!toggle || groups.length === 0) return;
      const allOpen = groups.every((group) => group.open);
      toggle.textContent = allOpen ? '모두 접기' : '모두 펼치기';
      toggle.setAttribute('aria-expanded', String(allOpen));
    };

    toggle?.addEventListener('click', () => {
      const open = !groups.every((group) => group.open);
      groups.forEach((group) => { group.open = open; });
      updateToggle();
    });
    groups.forEach((group) => group.addEventListener('toggle', updateToggle));

    links.forEach((link) => {
      if (link.closest('summary')) {
        link.addEventListener('click', (event) => event.stopPropagation());
      }
      link.addEventListener('click', () => {
        if (mobilePanel) mobilePanel.open = false;
      });
    });

    if (mobilePanel) {
      window.addEventListener('click', (event) => {
        if (mobilePanel.open && !this.contains(event.target as Node)) mobilePanel.open = false;
      });
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobilePanel.open) {
          mobilePanel.open = false;
          mobilePanel.querySelector('summary')?.focus();
        }
      });
    }

    const candidates = links.map((link) => {
      const id = decodeURIComponent(new URL(link.href, window.location.href).hash.slice(1));
      return { link, heading: document.getElementById(id) };
    }).filter((item): item is { link: HTMLAnchorElement; heading: HTMLElement } => Boolean(item.heading));

    let frame = 0;
    const updateCurrent = () => {
      frame = 0;
      const threshold = (document.querySelector('body > .page > header')?.getBoundingClientRect().height ?? 0) + 36;
      let current = candidates[0];
      for (const candidate of candidates) {
        if (candidate.heading.getBoundingClientRect().top <= threshold) current = candidate;
        else break;
      }
      links.forEach((link) => link.removeAttribute('aria-current'));
      if (current) {
        current.link.setAttribute('aria-current', 'true');
        if (currentLabel) currentLabel.textContent = current.link.textContent?.trim() || '처음 위치';
      }
    };
    const scheduleCurrentUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateCurrent);
    };

    window.addEventListener('scroll', scheduleCurrentUpdate, { passive: true });
    window.addEventListener('resize', scheduleCurrentUpdate);
    updateToggle();
    scheduleCurrentUpdate();
  }
}

if (!customElements.get('wiki-table-of-contents')) {
  customElements.define('wiki-table-of-contents', WikiTableOfContents);
}
