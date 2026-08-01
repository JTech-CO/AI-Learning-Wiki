import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const snapshot = JSON.parse(read('content-model/quality/w60-editor-quality.json'));
const dashboardPath = 'dist/special/editor-quality/index.html';
const dashboardDataPath = 'dist/data/editor-quality.json';

assert.ok(fs.existsSync(dashboardPath), 'editor quality dashboard route missing');
assert.ok(fs.existsSync(dashboardDataPath), 'editor quality dashboard data missing');
const html = read(dashboardPath);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'dashboard must render exactly one H1');
assert.match(html, /편집 품질 대시보드/u);
assert.match(html, /출시 게이트/u);
assert.match(html, /검토 대기열/u);
assert.match(html, /분야별 현황/u);
assert.match(html, /집계 기준/u);
assert.match(html, /data-editor-quality-dashboard/);
assert.match(html, /data-editor-quality-row/);
assert.match(html, /data-quality-filter/);
assert.match(html, /aria-live="polite"/);
assert.ok(html.includes('/data/editor-quality.json'));

for (const route of [
  'dist/index.html',
  'dist/special/all-pages/index.html',
  'dist/prompt-explorer/index.html',
  'dist/snippet-explorer/index.html',
  'dist/lab/index.html',
  'dist/lab/learning-path/index.html',
  'dist/lab/evaluation-metrics/index.html',
  'dist/lab/model-memory/index.html',
  'dist/lab/prompt-schema/index.html',
]) assert.ok(fs.existsSync(route), `${route}: stabilized route missing`);

const home = read('dist/index.html');
assert.ok(home.includes('/special/editor-quality/'), 'home dashboard link missing');
assert.ok(read('dist/special/all-pages/index.html').includes('/special/editor-quality/'), 'sidebar dashboard link missing');
assert.equal(snapshot.release.status, 'complete');
assert.ok(snapshot.release.htmlPages >= 1672);
assert.ok(snapshot.release.internalLinkReferences > 82965);
assert.equal(snapshot.release.brokenInternalLinks, 0);

console.log(
  `W60 render: editor dashboard, ${snapshot.release.htmlPages} pages and `
  + `${snapshot.release.internalLinkReferences} internal links stabilized`,
);
