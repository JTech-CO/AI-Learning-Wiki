import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ORIGIN = 'https://jtech-co.github.io';
const BASE_PATH = '/AI-Learning-Wiki';
const [promptPage, snippetPage, searchPage, prompts, snippets] = await Promise.all([
  readFile('dist/prompt-explorer/index.html', 'utf8'),
  readFile('dist/snippet-explorer/index.html', 'utf8'),
  readFile('dist/search/index.html', 'utf8'),
  readFile('dist/data/prompts.json', 'utf8').then(JSON.parse),
  readFile('dist/data/snippets.json', 'utf8').then(JSON.parse),
]);
const attribute = (html, name) => html.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
const resolvesTo = (value, pagePath, expectedPath) => value && new URL(value, `${ORIGIN}${pagePath}`).pathname === expectedPath;

assert.equal(prompts.prompts.length, 1500);
assert.equal(snippets.snippets.length, 25);
assert.ok(resolvesTo(attribute(promptPage, 'data-prompts-url'), `${BASE_PATH}/prompt-explorer/`, `${BASE_PATH}/data/prompts.json`));
assert.ok(resolvesTo(attribute(snippetPage, 'data-snippets-url'), `${BASE_PATH}/snippet-explorer/`, `${BASE_PATH}/data/snippets.json`));
assert.ok(resolvesTo(attribute(searchPage, 'data-prompts-url'), `${BASE_PATH}/search/`, `${BASE_PATH}/data/prompts.json`));
assert.ok(resolvesTo(attribute(searchPage, 'data-snippets-url'), `${BASE_PATH}/search/`, `${BASE_PATH}/data/snippets.json`));
assert.ok(resolvesTo(attribute(searchPage, 'data-wiki-url'), `${BASE_PATH}/search/`, `${BASE_PATH}/data/wiki-index.json`));
assert.ok(!/fetch\((['"`])\/data\//.test(promptPage + snippetPage + searchPage));

console.log(`W28 library route validation: ${prompts.prompts.length} prompts and ${snippets.snippets.length} snippets resolve under ${BASE_PATH}`);
