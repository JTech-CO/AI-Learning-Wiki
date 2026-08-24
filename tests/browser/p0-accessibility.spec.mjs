import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const representativeRoutes = [
  '/',
  '/wiki/hypothesis/',
  '/prompt-explorer/',
  '/snippet-explorer/',
  '/search/?q=LLM',
];

for (const route of representativeRoutes) {
  test(`${route}에 심각한 접근성 위반이 없다`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
    expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
  });
}

test('고정 헤더가 본문을 가리지 않고 색인 링크를 키보드로 열 수 있다', async ({ page }) => {
  await page.goto('/wiki/hypothesis/');
  const header = page.locator('header.header');
  const main = page.locator('main');
  const indexLink = page.getByRole('link', { name: '전체 문서(색인)' }).first();
  await expect(header).toBeVisible();
  await expect(main).toBeVisible();
  await expect(indexLink).toBeVisible();

  const [headerBox, mainBox] = await Promise.all([header.boundingBox(), main.boundingBox()]);
  expect(headerBox).not.toBeNull();
  expect(mainBox).not.toBeNull();
  expect(mainBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 1);

  await indexLink.focus();
  await expect(indexLink).toBeFocused();
  await indexLink.press('Enter');
  await expect(page).toHaveURL(/\/special\/all-pages\/$/);
});

test('백과 문서 목차의 일반 항목이 본문 앵커로 이동한다', async ({ page }) => {
  await page.goto('/wiki/hypothesis/');
  const tocLink = page.locator('.wiki-toc-list a[data-wiki-toc-link]').first();
  await expect(tocLink).toHaveAttribute('href', /^#[^#]+$/);
  const href = await tocLink.getAttribute('href');

  await tocLink.evaluate((link) => link.click());
  expect(await page.evaluate(() => window.location.hash)).toBe(href);
  await expect(page.locator(href)).toHaveCount(1);
});
test('프롬프트 영구 주소에서 대상과 목록 복귀가 동작한다', async ({ page }) => {
  const id = 'p17i-diagnose';
  await page.goto(`/prompt-explorer/?id=${id}#prompt-${id}`);
  const card = page.locator(`#prompt-${id}`);
  await expect(card).toBeVisible();
  await expect(card).toBeFocused();
  await expect(page.getByText('공유된 프롬프트 1개')).toBeVisible();
  await page.getByRole('link', { name: '전체 프롬프트 목록으로 돌아가기' }).click();
  await expect(page).not.toHaveURL(/\bid=/);
  await expect(page.locator('.prompt-card')).toHaveCount(40);
});

test('코드·설정 영구 주소에서 대상과 목록 복귀가 동작한다', async ({ page }) => {
  const id = 'ai-engineer-prompt-caching-p24-cache-1h';
  await page.goto(`/snippet-explorer/?id=${id}#snippet-${id}`);
  const card = page.locator(`#snippet-${id}`);
  await expect(card).toBeVisible();
  await expect(card).toBeFocused();
  await expect(page.getByText('공유된 코드·설정 자료 1개')).toBeVisible();
  await page.getByRole('link', { name: '전체 자료 목록으로 돌아가기' }).click();
  await expect(page).not.toHaveURL(/\bid=/);
  await expect(page.locator('.snippet-card')).toHaveCount(20);
});

test('통합 검색은 진입 시 자료를 내려받지 않고 초성 검색 때 필요한 색인을 불러온다', async ({ page }) => {
  const dataRequests = [];
  page.on('request', (request) => {
    if (/\/data\/(wiki-index|prompts|snippets)\.json$/.test(new URL(request.url()).pathname)) dataRequests.push(request.url());
  });
  await page.goto('/search/');
  await page.waitForLoadState('networkidle');
  expect(dataRequests).toEqual([]);

  await page.getByRole('searchbox', { name: '백과·프롬프트·코드 검색' }).fill('ㄷㄱㅁ');
  await expect(page.getByRole('link', { name: /대규모 언어 모델/ }).first()).toBeVisible();
  expect(dataRequests.length).toBeGreaterThan(0);
});

