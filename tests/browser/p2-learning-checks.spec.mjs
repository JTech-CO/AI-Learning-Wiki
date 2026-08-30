import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const learningChecks = JSON.parse(await readFile('public/data/learning-checks.json', 'utf8'));
const p2Catalog = JSON.parse(await readFile('content-model/research/p2-content-catalog.json', 'utf8'));
const p2Ids = p2Catalog.groups.flatMap((group) => group.articleIds);
const byArticleId = new Map(learningChecks.assessments.map((assessment) => [assessment.articleId, assessment]));
const representatives = [
  'korean-morphological-analysis',
  'korean-ai-basic-act',
  'a2a-protocol',
];

async function expectNoBlockingA11y(page, selector) {
  const results = await new AxeBuilder({ page })
    .include(selector)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = results.violations.filter(({ impact }) => ['serious', 'critical'].includes(impact));
  expect(blocking, blocking.map(({ id, help }) => `${id}: ${help}`).join('\n')).toEqual([]);
}

test('P2 신규 문서 52개는 모두 구조화 학습 체크 데이터에 포함된다', async () => {
  expect(p2Ids).toHaveLength(52);
  expect(new Set(p2Ids).size).toBe(52);
  for (const articleId of p2Ids) {
    expect(byArticleId.has(articleId), `${articleId} 학습 체크 누락`).toBe(true);
  }
});

test('P2 세 전문 분야의 대표 문서에서 학습 체크가 노출된다', async ({ page }) => {
  for (const articleId of representatives) {
    await page.goto(`/wiki/${articleId}/`);
    const check = page.locator('[data-learning-check]');
    await expect(check).toBeVisible();
    await expect(check).toHaveAttribute('data-article-id', articleId);
    await expect(check.locator('input[type="radio"]')).toHaveCount(4);
    await expect(check.locator('[data-learning-check-feedback] a')).toHaveCount(1);
    await expectNoBlockingA11y(page, '[data-learning-check]');
  }
});

test('P2 학습 체크는 오답·정답 해설과 복습 링크를 구분하고 결과를 로컬에 기록한다', async ({ page }) => {
  const articleId = 'a2a-protocol';
  const assessment = byArticleId.get(articleId);
  const item = assessment.items[0];
  await page.goto(`/wiki/${articleId}/`);
  await page.evaluate(() => localStorage.removeItem('ai-learning-wiki:learning-state:v1'));
  await page.reload();

  const form = page.locator('[data-learning-check-form]');
  const wrongChoice = item.choices.find((choice) => choice.id !== item.answer);
  await form.locator(`input[value="${wrongChoice.id}"]`).check();
  await form.getByRole('button', { name: '정답 확인' }).click();
  await expect(form.locator('[data-learning-check-result]')).toHaveText('다시 확인할 부분이 있다.');
  await expect(form.locator('[data-learning-check-reason]')).toHaveText(`${item.incorrectReason} ${item.explanation}`);
  await expect(form.getByRole('link', { name: '관련 부분 다시 읽기' })).toHaveAttribute('href', item.reviewUrl);

  await form.getByRole('button', { name: '다시 풀기' }).click();
  await form.locator(`input[value="${item.answer}"]`).check();
  await form.getByRole('button', { name: '정답 확인' }).click();
  await expect(form.locator('[data-learning-check-result]')).toHaveText('정답이다.');
  await expect(form.locator('[data-learning-check-reason]')).toHaveText(item.explanation);

  const saved = await page.evaluate((id) => {
    const state = JSON.parse(localStorage.getItem('ai-learning-wiki:learning-state:v1') ?? '{}');
    return state.assessments?.find((assessmentResult) => assessmentResult.articleId === id);
  }, articleId);
  expect(saved).toEqual(expect.objectContaining({ articleId, correct: true }));
});
