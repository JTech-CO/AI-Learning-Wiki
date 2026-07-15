import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ORIGIN = 'https://jtech-co.github.io';
const BASE_PATH = '/AI-Learning-Wiki';
const PROMPTS_PATH = `${BASE_PATH}/data/prompts.json`;
const WIKI_PATH = `${BASE_PATH}/data/wiki-index.json`;

const [promptPage, searchPage, prompts] = await Promise.all([
  readFile('dist/prompt-explorer/index.html', 'utf8'),
  readFile('dist/search/index.html', 'utf8'),
  readFile('dist/data/prompts.json', 'utf8').then(JSON.parse),
]);

const attribute = (html, name) => html.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
const resolvesTo = (value, pagePath, expectedPath) => value && new URL(value, `${ORIGIN}${pagePath}`).pathname === expectedPath;

const promptUrl = attribute(promptPage, 'data-prompts-url');
const searchPromptUrl = attribute(searchPage, 'data-prompts-url');
const searchWikiUrl = attribute(searchPage, 'data-wiki-url');

assert.equal(prompts.prompts.length, 1173, 'prompt data count changed');
assert.ok(resolvesTo(promptUrl, `${BASE_PATH}/prompt-explorer/`, PROMPTS_PATH), 'prompt explorer data URL escapes the Pages base path');
assert.ok(resolvesTo(searchPromptUrl, `${BASE_PATH}/search/`, PROMPTS_PATH), 'search prompt URL escapes the Pages base path');
assert.ok(resolvesTo(searchWikiUrl, `${BASE_PATH}/search/`, WIKI_PATH), 'search wiki URL escapes the Pages base path');
assert.ok(!/fetch\((['"`])\/data\//.test(promptPage + searchPage), 'root-domain data fetch remains in a deployed page');

console.log(`W28 prompt route validation: ${prompts.prompts.length} prompts and search data resolve under ${BASE_PATH}`);
