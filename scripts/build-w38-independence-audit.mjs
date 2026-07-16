import { mkdir, writeFile } from 'node:fs/promises';
import { buildW38IndependenceAudit } from './w38-independence-lib.mjs';

const audit = await buildW38IndependenceAudit();
await mkdir('content-model/quality', { recursive: true });
await writeFile('content-model/quality/w38-independence-audit.json', `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
console.log(`W38 independence audit: ${audit.baseline.legacyModules} legacy modules, ${audit.baseline.publicPrompts} prompts, ${audit.baseline.publicArtifacts} artifacts; ${audit.legacyDependency.activeConsumers.length} active legacy consumers`);
