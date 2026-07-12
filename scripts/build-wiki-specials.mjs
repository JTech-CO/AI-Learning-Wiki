import { writeFile } from 'node:fs/promises';

await writeFile('src/content/docs/special/random.mdx', `---
title: 무작위 문서
description: 검토 완료 백과 문서 중 하나를 무작위로 엽니다
---

import RandomArticle from '../../../components/wiki/RandomArticle.astro';


<RandomArticle />
`, 'utf8');
console.log('wiki special pages created');
