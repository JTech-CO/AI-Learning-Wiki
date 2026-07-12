(() => {
  const match = location.pathname.match(/^\/course\/([^/]+)\/?$/);
  if (!match) return;
  const key = `aiwiki-course-v2:${match[1]}`;
  let completed = new Set();
  try { completed = new Set(JSON.parse(localStorage.getItem(key) ?? '[]')); } catch {}
  const links = [...document.querySelectorAll('main ol li a[href^="/wiki/"]')];
  for (const link of links) {
    const li = link.closest('li');
    if (!li) continue;
    const label = document.createElement('label');
    label.className = 'wiki-course-check';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed.has(link.getAttribute('href'));
    checkbox.setAttribute('aria-label', `${link.textContent} 완료`);
    const update = () => li.classList.toggle('wiki-course-checked', checkbox.checked);
    checkbox.addEventListener('change', () => {
      const href = link.getAttribute('href');
      checkbox.checked ? completed.add(href) : completed.delete(href);
      localStorage.setItem(key, JSON.stringify([...completed]));
      update();
    });
    update(); label.append(checkbox); li.prepend(label, ' ');
  }
})();
