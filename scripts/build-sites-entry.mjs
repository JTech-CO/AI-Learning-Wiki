import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', `export default {
  async fetch(request, env) {
    if (!env.ASSETS?.fetch) return new Response('Static asset binding is unavailable.', { status: 503 });
    return env.ASSETS.fetch(request);
  },
};
`, 'utf8');
console.log('Sites static asset worker entry created');
