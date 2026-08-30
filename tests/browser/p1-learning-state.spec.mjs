import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const storageKey = 'ai-learning-wiki:learning-state:v1';


test('문서의 북마크·읽음 표시와 내 학습 이어보기가 같은 브라우저에서 유지된다', async ({ page }) => {
  await page.goto('/wiki/transformer/');
  const dock = page.locator('[data-learning-state-bridge]');
  await expect(dock).toBeVisible();
  await page.getByRole('button', { name: '북마크 추가' }).click();
  await page.getByRole('button', { name: '읽음으로 표시' }).click();
  await expect(page.getByRole('button', { name: '북마크 해제' })).toBeVisible();
  await expect(page.getByRole('button', { name: '읽음 취소' })).toBeVisible();

  await page.goto('/learning-progress/');
  await expect(page.locator('[data-learning-read-count]')).toHaveText('1');
  await expect(page.locator('[data-learning-bookmark-count]')).toHaveText('1');
  await expect(page.locator('[data-learning-continue-title]')).toHaveText('트랜스포머');
  await expect(page.locator('[data-learning-recent-list]').getByRole('link', { name: '트랜스포머' })).toBeVisible();
  await expect(page.locator('[data-learning-bookmark-list]').getByRole('link', { name: '트랜스포머' })).toBeVisible();
});

test('마지막 확인 뒤 재검토된 문서와 저장한 맞춤 경로를 표시한다', async ({ page }) => {
  await page.addInitScript(({ key }) => {
    localStorage.setItem(key, JSON.stringify({
      schemaVersion: 1,
      updatedAt: '2026-01-01T00:00:00.000Z',
      recent: [{ url: '/wiki/transformer/', title: '트랜스포머', kind: 'article', visitedAt: '2026-01-01T00:00:00.000Z' }],
      bookmarks: [],
      read: [],
      assessments: [{ articleId: 'transformer', correct: true, answeredAt: '2026-01-01T00:00:00.000Z' }],
      savedPaths: [{
        id: 'transformer:entry:balanced:math:10',
        goalId: 'transformer',
        title: '트랜스포머까지의 추천 학습 경로',
        savedAt: '2026-01-01T00:00:00.000Z',
        settings: { level: 'entry', focus: 'balanced', maxDocuments: 10, includeMathematics: true },
        steps: [{ url: '/wiki/attention/', title: '어텐션' }, { url: '/wiki/transformer/', title: '트랜스포머' }],
      }],
    }));
  }, { key: storageKey });
  await page.goto('/learning-progress/');
  await expect(page.locator('.wiki-learning-update-label')).toHaveText('업데이트됨');
  await expect(page.locator('[data-learning-assessment-count]')).toHaveText('1');
  await expect(page.locator('[data-learning-correct-count]')).toHaveText('1');
  const savedPath = page.locator('.wiki-learning-saved-path-card');
  await expect(savedPath).toContainText('트랜스포머까지의 추천 학습 경로');
  await expect(savedPath.getByRole('link', { name: /이어보기/ })).toHaveAttribute('href', /\/wiki\/transformer\/$/);
});

test('모바일에서도 학습 기록 조작부가 화면 폭을 벗어나지 않는다', async ({ page }) => {
  await page.goto('/wiki/transformer/');
  const box = await page.locator('[data-learning-state-bridge]').boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual((await page.viewportSize()).width + 1);
});

test('내 학습 화면에 심각한 접근성 위반이 없다', async ({ page }) => {
  await page.goto('/learning-progress/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
});