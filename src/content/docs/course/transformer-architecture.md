---
title: "트랜스포머 아키텍처"
description: "임베딩·어텐션·정규화·인코더와 디코더를 거쳐 대표 트랜스포머 아키텍처를 연결한 고급 과정이다."
---

<p class="wiki-lead">임베딩·어텐션·정규화·인코더와 디코더를 거쳐 대표 트랜스포머 아키텍처를 연결한 고급 과정이다.</p>

**대상:** 트랜스포머 블록과 대표 언어 모델 계열을 구조 수준에서 이해하려는 학습자

**난이도:** 고급

**권장 선수 코스:** [현대 신경망과 모델 아키텍처](/course/neural-model-architectures/) · [LLM 내부 구조](/course/llm-internals/)

## 권장 문서 순서

1. [트랜스포머](/wiki/transformer/)
2. [토큰 임베딩층](/wiki/token-embedding-layer/)
3. [세그먼트 임베딩](/wiki/segment-embedding/)
4. [위치 인코딩](/wiki/positional-encoding/)
5. [사인파 위치 인코딩](/wiki/sinusoidal-position-encoding/)
6. [학습형 위치 임베딩](/wiki/learned-position-embedding/)
7. [절대 위치 인코딩](/wiki/absolute-position-encoding/)
8. [위치 ID](/wiki/position-id/)
9. [어텐션](/wiki/attention/)
10. [쿼리·키·값](/wiki/query-key-value/)
11. [가산 어텐션](/wiki/additive-attention/)
12. [닷프로덕트 어텐션](/wiki/dot-product-attention/)
13. [스케일드 닷프로덕트 어텐션](/wiki/scaled-dot-product-attention/)
14. [어텐션 점수](/wiki/attention-score/)
15. [어텐션 행렬](/wiki/attention-matrix/)
16. [어텐션 헤드](/wiki/attention-head/)
17. [멀티헤드 어텐션](/wiki/multi-head-attention/)
18. [어텐션 마스크](/wiki/attention-mask/)
19. [패딩 마스크](/wiki/padding-mask/)
20. [인과 마스크](/wiki/causal-mask/)
21. [인코더](/wiki/encoder/)
22. [디코더](/wiki/decoder/)
23. [인코더-디코더](/wiki/encoder-decoder/)
24. [크로스 어텐션](/wiki/cross-attention/)
25. [인코더-디코더 어텐션](/wiki/encoder-decoder-attention/)
26. [피드포워드 네트워크](/wiki/feed-forward-network/)
27. [잔차 연결](/wiki/residual-connection/)
28. [레이어 정규화](/wiki/layer-normalization/)
29. [프리 정규화](/wiki/pre-normalization/)
30. [포스트 정규화](/wiki/post-normalization/)
31. [정규화 배치](/wiki/normalization-placement/)
32. [트랜스포머 블록](/wiki/transformer-block/)
33. [출력 투영](/wiki/output-projection/)
34. [언어 모델링 헤드](/wiki/language-modeling-head/)
35. [인코더 전용 트랜스포머](/wiki/encoder-only-transformer/)
36. [디코더 전용 모델](/wiki/decoder-only-model/)
37. [시퀀스-투-시퀀스 트랜스포머](/wiki/sequence-to-sequence-transformer/)
38. [양방향 어텐션](/wiki/bidirectional-attention/)
39. [프리픽스 언어 모델](/wiki/prefix-language-model/)
40. [BERT 아키텍처](/wiki/bert-architecture/)
41. [GPT 아키텍처](/wiki/gpt-architecture/)
42. [T5 아키텍처](/wiki/t5-architecture/)
43. [BART 아키텍처](/wiki/bart-architecture/)
44. [XLNet 아키텍처](/wiki/xlnet-architecture/)
45. [Conformer 아키텍처](/wiki/conformer-architecture/)
46. [비전 트랜스포머](/wiki/vision-transformer/)
47. [GEGLU](/wiki/geglu/)
48. [SwiGLU](/wiki/swiglu/)
49. [RMS 정규화](/wiki/rms-normalization/)
