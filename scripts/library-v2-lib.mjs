import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

export async function loadLibraryV2Validators(root = process.cwd()) {
  const [promptSchema, artifactSchema] = await Promise.all([
    readJson(path.join(root, 'content-model', 'schema.prompt-library-v2.json')),
    readJson(path.join(root, 'content-model', 'schema.artifact-library-v2.json')),
  ]);
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return {
    ajv,
    promptSchema,
    artifactSchema,
    validatePrompt: ajv.compile(promptSchema),
    validateArtifact: ajv.compile(artifactSchema),
  };
}

export async function readLibraryEntries(directory, suffix) {
  let files;
  try {
    files = (await readdir(directory)).filter((file) => file.endsWith(suffix)).sort();
  } catch (cause) {
    if (cause.code === 'ENOENT') return [];
    throw cause;
  }
  return Promise.all(files.map(async (file) => ({
    file,
    value: await readJson(path.join(directory, file)),
  })));
}

export function ajvMessage(validate) {
  return validate.errors?.map((error) => `${error.instancePath || '/'} ${error.message}`).join('; ') ?? 'unknown schema error';
}
