import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  loadEditorQualityManifest,
  resolveBuildClock,
  sha256,
} from './editor-quality-runtime.mjs';

const argv = process.argv.slice(2);
const argumentValue = (name) => {
  const inline = argv.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
};
const readText = (file) => readFile(file, 'utf8');
const readJson = async (file) => JSON.parse(await readText(file));
const outputPath = argumentValue('--output') ?? 'artifacts/maintenance/maintenance-report.json';
const refreshedVerificationPath = argumentValue('--source-verification');
const canonicalVerificationPath = 'content-model/evidence/source-verification.json';
const policyPath = 'content-model/taxonomy/quality-policy.json';
const manifest = loadEditorQualityManifest();
const clock = resolveBuildClock({ argv, manifest });
const asOfTime = new Date(`${clock.asOf}T00:00:00.000Z`).getTime();
const day = 24 * 60 * 60 * 1000;

const policy = await readJson(policyPath);
const canonicalVerification = await readJson(canonicalVerificationPath);
const articleFiles = (await readdir('content-model/articles'))
  .filter((file) => file.endsWith('.article.json'))
  .sort();
const articles = await Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file))));
const reviewDays = {
  evergreen: policy.review.evergreenReviewDays,
  periodic: policy.review.periodicReviewDays,
  'fast-changing': policy.review.fastChangingReviewDays,
};
const dueCounts = { overdue: 0, dueWithin30Days: 0, dueWithin90Days: 0, current: 0 };
const freshnessQueue = [];

for (const article of articles) {
  const reviewedTime = new Date(`${article.reviewedAt}T00:00:00.000Z`).getTime();
  const dueTime = reviewedTime + reviewDays[article.volatility] * day;
  const daysRemaining = Math.ceil((dueTime - asOfTime) / day);
  let band = 'current';
  if (daysRemaining < 0) {
    band = 'overdue';
    dueCounts.overdue += 1;
  } else if (daysRemaining <= 30) {
    band = 'due-30';
    dueCounts.dueWithin30Days += 1;
  } else if (daysRemaining <= 90) {
    band = 'due-90';
    dueCounts.dueWithin90Days += 1;
  } else dueCounts.current += 1;
  if (band !== 'current') {
    freshnessQueue.push({
      id: article.id,
      title: article.title,
      englishTitle: article.englishTitle,
      categoryId: article.categories[0],
      volatility: article.volatility,
      reviewedAt: article.reviewedAt,
      dueAt: new Date(dueTime).toISOString().slice(0, 10),
      daysRemaining,
      band,
    });
  }
}
const bandOrder = { overdue: 0, 'due-30': 1, 'due-90': 2 };
freshnessQueue.sort((left, right) => (
  bandOrder[left.band] - bandOrder[right.band]
  || left.dueAt.localeCompare(right.dueAt)
  || left.title.localeCompare(right.title, 'ko')
));

const summarizeVerification = (verification) => ({
  checkedAt: verification.checkedAt,
  totals: verification.totals,
});
let sourceDelta = {
  status: 'not-refreshed',
  canonical: summarizeVerification(canonicalVerification),
  refreshed: null,
  counts: { added: 0, removed: 0, stateChanged: 0, metadataChanged: 0 },
  changes: [],
};
if (refreshedVerificationPath) {
  const refreshed = await readJson(refreshedVerificationPath);
  const canonicalByUrl = new Map(canonicalVerification.sources.map((source) => [source.url, source]));
  const refreshedByUrl = new Map(refreshed.sources.map((source) => [source.url, source]));
  const urls = new Set([...canonicalByUrl.keys(), ...refreshedByUrl.keys()]);
  const changes = [];
  const counts = { added: 0, removed: 0, stateChanged: 0, metadataChanged: 0 };
  for (const url of [...urls].sort()) {
    const before = canonicalByUrl.get(url);
    const after = refreshedByUrl.get(url);
    if (!before) {
      counts.added += 1;
      changes.push({ url, kind: 'added', before: null, after: { state: after.state, status: after.status } });
      continue;
    }
    if (!after) {
      counts.removed += 1;
      changes.push({ url, kind: 'removed', before: { state: before.state, status: before.status }, after: null });
      continue;
    }
    if (before.state !== after.state || before.status !== after.status) {
      counts.stateChanged += 1;
      changes.push({
        url,
        kind: 'state-changed',
        before: { state: before.state, status: before.status },
        after: { state: after.state, status: after.status },
      });
    } else if (
      before.finalUrl !== after.finalUrl
      || before.etag !== after.etag
      || before.lastModified !== after.lastModified
      || before.contentType !== after.contentType
    ) {
      counts.metadataChanged += 1;
      changes.push({
        url,
        kind: 'metadata-changed',
        before: { finalUrl: before.finalUrl, etag: before.etag, lastModified: before.lastModified, contentType: before.contentType },
        after: { finalUrl: after.finalUrl, etag: after.etag, lastModified: after.lastModified, contentType: after.contentType },
      });
    }
  }
  sourceDelta = {
    status: 'compared',
    canonical: summarizeVerification(canonicalVerification),
    refreshed: summarizeVerification(refreshed),
    counts,
    changes,
  };
}

const report = {
  schemaVersion: '1.0',
  generatedAt: clock.generatedAt,
  asOf: clock.asOf,
  status: dueCounts.overdue > 0
    || sourceDelta.refreshed?.totals?.unavailable > 0
    || sourceDelta.counts.stateChanged > 0 ? 'attention' : 'current',
  reviewPolicyDays: reviewDays,
  articleCounts: {
    total: articles.length,
    ...dueCounts,
    queued: freshnessQueue.length,
  },
  freshnessQueue,
  sourceDelta,
  provenance: {
    policySha256: sha256(await readText(policyPath)),
    canonicalVerificationSha256: sha256(await readText(canonicalVerificationPath)),
    refreshedVerificationSha256: refreshedVerificationPath ? sha256(await readText(refreshedVerificationPath)) : null,
  },
};
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  `Maintenance report (${clock.asOf}): ${articles.length} articles, ${freshnessQueue.length} queued, `
  + `${sourceDelta.counts.stateChanged} source state changes; output ${outputPath}`,
);
