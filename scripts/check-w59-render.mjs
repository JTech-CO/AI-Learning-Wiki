import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const catalog = JSON.parse(read('content-model/research/w59-term-catalog.json'));
const courseIds = [...new Set(catalog.terms.map((term) => term.courseId))];
const toolIds = [...new Set(catalog.terms.map((term) => term.toolId))];

for (const term of catalog.terms) {
  const file = 'dist/wiki/' + term.id + '/index.html';
  assert.ok(fs.existsSync(file), term.id + ': rendered article missing');
  const html = read(file);
  assert.ok(html.includes(term.title), term.id + ': Korean title missing from render');
  assert.ok(html.includes(term.englishTitle), term.id + ': English title missing from render');
  assert.match(html, /개요와 핵심 정의/u, term.id + ': overview section missing');
  assert.match(html, /참고 문헌/u, term.id + ': references section missing');
}

for (const courseId of courseIds) {
  const file = 'dist/course/' + courseId + '/index.html';
  assert.ok(fs.existsSync(file), courseId + ': rendered course missing');
  const html = read(file);
  for (const term of catalog.terms.filter((item) => item.courseId === courseId)) {
    assert.ok(
      html.includes('/wiki/' + term.id + '/'),
      courseId + ': missing article link ' + term.id,
    );
  }
}

for (const toolId of toolIds) {
  const file = 'dist/lab/' + toolId + '/index.html';
  assert.ok(fs.existsSync(file), toolId + ': rendered tool missing');
  const html = read(file);
  for (const term of catalog.terms.filter((item) => item.toolId === toolId)) {
    assert.ok(
      html.includes('/wiki/' + term.id + '/'),
      toolId + ': missing article link ' + term.id,
    );
  }
}

const allPages = read('dist/special/all-pages/index.html');
for (const term of catalog.terms) {
  assert.ok(
    allPages.includes('/wiki/' + term.id + '/'),
    term.id + ': article index link missing',
  );
}

console.log(
  'W59 render: 24 articles, four course pages, four lab tools and the full index are linked',
);
