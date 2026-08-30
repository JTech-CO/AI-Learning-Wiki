import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const samples = [
  { course: 'korean-multilingual-ai', courseTitle: '한국어·다국어 AI', article: 'klue-benchmark' },
  { course: 'ai-regulation-literacy', courseTitle: 'AI 규제와 리터러시', article: 'korea-ai-basic-act' },
  { course: 'agent-interoperability', courseTitle: '에이전트 상호운용과 실행 계약', article: 'a2a-protocol' },
];

for (const sample of samples) {
  test(`${sample.courseTitle} 코스는 신규 문서와 다음 학습 링크를 연결한다`, async ({ page }) => {
    await page.goto(`/course/${sample.course}/`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(sample.courseTitle);
    const firstArticle = page.locator('main ol a').first();
    await expect(firstArticle).toBeVisible();
    await firstArticle.click();
    await expect(page.locator('.wiki-document-meta')).toBeVisible();
    await expect(page.getByRole('heading', { name: '참고 문헌' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '이 문서를 포함하는 코스' })).toBeVisible();
  });
}

test('P2 대표 문서와 코스에 심각한 접근성 위반이 없다', async ({ page }) => {
  for (const route of ['/course/korean-multilingual-ai/', '/course/ai-regulation-literacy/', '/course/agent-interoperability/']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .include('main')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blocking = results.violations.filter(({ impact }) => ['serious', 'critical'].includes(impact));
    expect(blocking, `${route}\n${blocking.map(({ id, help }) => `${id}: ${help}`).join('\n')}`).toEqual([]);
  }
});
