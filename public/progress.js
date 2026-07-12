(() => {
  const KEY = 'aiwiki-progress-v1';
  const path = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  const parts = path.split('/').filter(Boolean);
  if (parts[0] !== 'courses' || parts.length < 3) return;
  let completed;
  try { completed = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { completed = new Set(); }
  localStorage.setItem('aiwiki-last-module-v1', path);
  const bar = document.createElement('aside'); bar.className = 'page-progress-action'; bar.setAttribute('aria-label', '학습 진도 저장');
  const label = document.createElement('span'); label.textContent = '이 레슨의 학습 상태';
  const button = document.createElement('button'); button.type = 'button';
  const update = () => { const done = completed.has(path); button.textContent = done ? '완료됨 ✓' : '학습 완료로 표시'; button.setAttribute('aria-pressed', String(done)); bar.classList.toggle('is-complete', done); };
  button.addEventListener('click', () => { completed.has(path) ? completed.delete(path) : completed.add(path); localStorage.setItem(KEY, JSON.stringify([...completed])); update(); });
  bar.append(label, button); document.body.append(bar); update();
})();
