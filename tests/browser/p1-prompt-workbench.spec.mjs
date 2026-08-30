import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('프롬프트 워크벤치는 변수·비교·로컬 테스트 기록을 영구 주소 안에서 유지한다', async ({ page }) => {
  const id = 'p17i-diagnose';
  const route = `/prompt-explorer/?id=${id}#prompt-${id}`;
  const offsiteRequests = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) offsiteRequests.push(url.href);
  });

  await page.goto(route);
  await page.evaluate((promptId) => {
    localStorage.removeItem(`ai-learning-wiki:prompt-workbench:v1:${promptId}`);
  }, id);
  await page.reload();

  const card = page.locator(`#prompt-${id}`);
  const workbench = card.locator('[data-prompt-workbench]');
  await workbench.getByText('프롬프트 워크벤치 열기').click();
  await expect(workbench.locator('.prompt-workbench-panel')).toBeVisible();
  const variables = workbench.locator('.prompt-workbench-variables textarea');
  expect(await variables.count()).toBeGreaterThan(0);
  await variables.first().fill('검색 출처를 확인하는 입문 개발자');
  await expect(workbench.locator('.prompt-workbench-compare section').nth(1)).toContainText('검색 출처를 확인하는 입문 개발자');

  await workbench.getByLabel('테스트 입력').fill('RAG 답변에 출처가 누락된 사례 3건');
  await workbench.getByRole('textbox', { name: '기대 출력', exact: true }).fill('# 결과\n\n- 누락 원인\n- 수정 우선순위');
  await workbench.locator('.prompt-workbench-validation-controls select').selectOption('markdown');
  await expect(workbench.locator('.prompt-workbench-validation')).toHaveAttribute('data-status', 'ok');
  await expect(workbench.locator('.prompt-workbench-save-status')).toContainText('자동 저장');
  await expect(page).toHaveURL(new RegExp(`/prompt-explorer/\\?id=${id}#prompt-${id}$`));

  const accessibility = await new AxeBuilder({ page })
    .include('.prompt-workbench')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = accessibility.violations.filter(({ impact }) => ['serious', 'critical'].includes(impact));
  expect(blocking, blocking.map(({ id: rule, help }) => `${rule}: ${help}`).join('\n')).toEqual([]);

  await page.reload();
  await page.locator(`#prompt-${id} [data-prompt-workbench] > summary`).click();
  const restored = page.locator(`#prompt-${id} [data-prompt-workbench]`);
  await expect(restored.getByLabel('테스트 입력')).toHaveValue('RAG 답변에 출처가 누락된 사례 3건');
  await expect(restored.getByRole('textbox', { name: '기대 출력', exact: true })).toHaveValue('# 결과\n\n- 누락 원인\n- 수정 우선순위');
  expect(offsiteRequests).toEqual([]);
});
