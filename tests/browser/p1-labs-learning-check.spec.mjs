import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const learningStateKey = 'ai-learning-wiki:learning-state:v1';

async function expectNoBlockingA11y(page, selector) {
  const results = await new AxeBuilder({ page })
    .include(selector)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = results.violations.filter(({ impact }) => ['serious', 'critical'].includes(impact));
  expect(blocking, blocking.map(({ id, help }) => `${id}: ${help}`).join('\n')).toEqual([]);
}

test('토큰·문맥 계산기는 메시지 계층과 비용 상한을 브라우저 안에서 계산한다', async ({ page }) => {
  await page.goto('/lab/token-context/');
  const lab = page.locator('[data-token-context-calculator]');
  await lab.getByLabel('시스템 지시').fill('URL에 포함되면 안 되는 내부 지시');
  await lab.getByLabel('도구 정의·결과').fill('{"name":"search","result":"근거 3건"}');
  await lab.getByLabel('검색 문맥').fill('검색 문서 A, B, C');
  await lab.getByLabel('배치 크기').fill('4');
  await lab.getByLabel('반복 호출 수').fill('3');
  await lab.getByRole('button', { name: '문맥 예산 계산하기' }).click();

  await expect(lab.locator('[data-token-context-result]')).toBeVisible();
  await expect(lab.locator('[data-token-segment-rows] tr')).toHaveCount(4);
  await expect(lab.locator('[data-token-cost-rows] tr')).toHaveCount(2);
  await expect(lab.locator('[data-token-risk]')).not.toHaveText('-');
  expect(page.url()).not.toContain('URL%EC%97%90');
  expect(page.url()).not.toContain('search');
  await expectNoBlockingA11y(page, '[data-token-context-calculator]');
});

test('RAG 평가 실험실은 검색 전후의 여섯 지표를 함께 비교한다', async ({ page }) => {
  const offsiteRequests = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) offsiteRequests.push(url.href);
  });

  await page.goto('/lab/rag-evaluation/');
  const lab = page.locator('[data-rag-evaluation-lab]');
  await lab.getByRole('button', { name: 'RAG 지표 계산하기' }).click();

  await expect(lab.locator('[data-rag-result]')).toBeVisible();
  await expect(lab.locator('[data-rag-metric-rows] tr')).toHaveCount(6);
  await expect(lab.locator('[data-rag-query-rows] tr')).toHaveCount(4);
  await expect(lab.locator('[data-rag-query-count]')).toHaveText('2개');
  await expect(lab.getByRole('button', { name: 'JSON 내보내기' })).toBeEnabled();
  await expect(lab.getByRole('button', { name: 'CSV 내보내기' })).toBeEnabled();
  await expectNoBlockingA11y(page, '[data-rag-evaluation-lab]');
  expect(offsiteRequests).toEqual([]);
});

test('문서 학습 체크 결과는 내 학습의 통합 상태에 반영된다', async ({ page }) => {
  await page.goto('/wiki/accuracy/');
  await page.evaluate((key) => localStorage.removeItem(key), learningStateKey);
  await page.reload();
  const check = page.locator('[data-learning-check]');
  await expect(check).toBeVisible();
  await check.locator('input[type="radio"]').first().check();
  await check.getByRole('button', { name: '정답 확인' }).click();
  await expect(check.locator('[data-learning-check-feedback]')).toBeVisible();

  const assessment = await page.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key) ?? '{}');
    return state.assessments?.find((item) => item.articleId === 'accuracy');
  }, learningStateKey);
  expect(assessment).toEqual(expect.objectContaining({ articleId: 'accuracy' }));

  await page.goto('/learning-progress/');
  await expect(page.locator('[data-learning-assessment-count]')).toHaveText('1');
  await expectNoBlockingA11y(page, '.wiki-learning-dashboard');
});
