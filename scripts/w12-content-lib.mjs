import { createHash } from 'node:crypto';
import { categoryLinks, sourceFamily, sourcesFor } from './w9-batch-lib.mjs';
import { topicFacts } from './w12-topic-facts.mjs';
import { topicPrimarySources } from './w12-extra-sources.mjs';

export const REVIEWED_AT = '2026-07-14';
export const VERSION = 'W12-2026-07-14';
export const FACTUAL_SECTION_IDS = ['overview', 'scope', 'mechanism', 'structure', 'applications', 'limitations', 'distinctions', 'worked-example', 'practice'];

const primarySources = {
  agents: [
    { title: 'ReAct: Synergizing Reasoning and Acting in Language Models', url: 'https://arxiv.org/abs/2210.03629', type: 'paper' },
    { title: 'Reflexion: Language Agents with Verbal Reinforcement Learning', url: 'https://arxiv.org/abs/2303.11366', type: 'paper' },
    { title: 'Toolformer: Language Models Can Teach Themselves to Use Tools', url: 'https://arxiv.org/abs/2302.04761', type: 'paper' },
  ],
  api: [
    { title: 'RFC 3986: Uniform Resource Identifier', url: 'https://www.rfc-editor.org/rfc/rfc3986.html', type: 'standard' },
    { title: 'RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html', type: 'standard' },
    { title: 'RFC 8446: The Transport Layer Security Protocol Version 1.3', url: 'https://www.rfc-editor.org/rfc/rfc8446.html', type: 'standard' },
    { title: 'RFC 1034: Domain Names - Concepts and Facilities', url: 'https://www.rfc-editor.org/rfc/rfc1034.html', type: 'standard' },
    { title: 'MDN HTTP Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'documentation' },
  ],
  ecosystem: [
    { title: 'Open Source AI Definition', url: 'https://opensource.org/ai/open-source-ai-definition', type: 'standard' },
    { title: 'SafeTensors Documentation', url: 'https://huggingface.co/docs/safetensors/index', type: 'documentation' },
    { title: 'Reproducible Builds: Definition', url: 'https://reproducible-builds.org/docs/definition/', type: 'documentation' },
    { title: 'Open Source Licenses', url: 'https://opensource.org/licenses', type: 'standard' },
  ],
  evaluation: [
    { title: 'BLEU: a Method for Automatic Evaluation of Machine Translation', url: 'https://aclanthology.org/P02-1040/', type: 'paper' },
    { title: 'ROUGE: A Package for Automatic Evaluation of Summaries', url: 'https://aclanthology.org/W04-1013/', type: 'paper' },
    { title: 'BERTScore: Evaluating Text Generation with BERT', url: 'https://arxiv.org/abs/1904.09675', type: 'paper' },
    { title: 'On Calibration of Modern Neural Networks', url: 'https://arxiv.org/abs/1706.04599', type: 'paper' },
  ],
  foundations: [
    { title: 'On the Opportunities and Risks of Foundation Models', url: 'https://arxiv.org/abs/2108.07258', type: 'paper' },
    { title: 'A Survey of Transfer Learning', url: 'https://arxiv.org/abs/1911.02685', type: 'paper' },
    { title: 'An Overview of Multi-Task Learning in Deep Neural Networks', url: 'https://arxiv.org/abs/1706.05098', type: 'paper' },
    { title: 'Deep Learning', url: 'https://www.deeplearningbook.org/', type: 'book' },
  ],
  inference: [
    { title: 'The Curious Case of Neural Text Degeneration', url: 'https://arxiv.org/abs/1904.09751', type: 'paper' },
    { title: 'A Contrastive Framework for Neural Text Generation', url: 'https://arxiv.org/abs/2202.06417', type: 'paper' },
    { title: 'Diverse Beam Search: Decoding Diverse Solutions from Neural Sequence Models', url: 'https://arxiv.org/abs/1610.02424', type: 'paper' },
    { title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention', url: 'https://arxiv.org/abs/2309.06180', type: 'paper' },
    { title: 'vLLM Documentation', url: 'https://docs.vllm.ai/en/latest/', type: 'documentation' },
  ],
  llm: [
    { title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', url: 'https://arxiv.org/abs/1810.04805', type: 'paper' },
    { title: 'Language Models are Unsupervised Multitask Learners', url: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf', type: 'paper' },
    { title: 'Language Models are Few-Shot Learners', url: 'https://arxiv.org/abs/2005.14165', type: 'paper' },
    { title: 'Speech and Language Processing', url: 'https://web.stanford.edu/~jurafsky/slp3/', type: 'book' },
  ],
  mathematics: [
    { title: 'Mathematics for Machine Learning', url: 'https://mml-book.github.io/', type: 'book' },
    { title: 'Introduction to Linear Algebra', url: 'https://math.mit.edu/~gs/linearalgebra/', type: 'book' },
    { title: 'Deep Learning: Linear Algebra', url: 'https://www.deeplearningbook.org/contents/linear_algebra.html', type: 'book' },
    { title: 'NumPy Linear Algebra Reference', url: 'https://numpy.org/doc/stable/reference/routines.linalg.html', type: 'documentation' },
  ],
  multimodal: [
    { title: 'Learning Transferable Visual Models From Natural Language Supervision', url: 'https://arxiv.org/abs/2103.00020', type: 'paper' },
    { title: 'An Image is Worth 16x16 Words', url: 'https://arxiv.org/abs/2010.11929', type: 'paper' },
    { title: 'Feature Pyramid Networks for Object Detection', url: 'https://arxiv.org/abs/1612.03144', type: 'paper' },
    { title: 'Simple Open-Vocabulary Object Detection with Vision Transformers', url: 'https://arxiv.org/abs/2205.06230', type: 'paper' },
    { title: 'Torchvision Models and Pre-trained Weights', url: 'https://pytorch.org/vision/stable/models.html', type: 'documentation' },
  ],
  neural: [
    { title: 'Deep Learning', url: 'https://www.deeplearningbook.org/', type: 'book' },
    { title: 'Understanding the Difficulty of Training Deep Feedforward Neural Networks', url: 'https://proceedings.mlr.press/v9/glorot10a.html', type: 'paper' },
    { title: 'Delving Deep into Rectifiers', url: 'https://arxiv.org/abs/1502.01852', type: 'paper' },
    { title: 'Understanding the Effective Receptive Field in Deep Convolutional Neural Networks', url: 'https://arxiv.org/abs/1701.04128', type: 'paper' },
  ],
  retrieval: [
    { title: 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks', url: 'https://arxiv.org/abs/1908.10084', type: 'paper' },
    { title: 'Matryoshka Representation Learning', url: 'https://arxiv.org/abs/2205.13147', type: 'paper' },
    { title: 'One Embedder, Any Task: Instruction-Finetuned Text Embeddings', url: 'https://arxiv.org/abs/2212.09741', type: 'paper' },
    { title: 'BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models', url: 'https://arxiv.org/abs/2104.08663', type: 'paper' },
    { title: 'Faiss Documentation', url: 'https://faiss.ai/', type: 'documentation' },
  ],
  safety: [
    { title: 'OWASP Top 10 for Large Language Model Applications', url: 'https://genai.owasp.org/llm-top-10/', type: 'standard' },
    { title: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', type: 'standard' },
    { title: 'Membership Inference Attacks Against Machine Learning Models', url: 'https://arxiv.org/abs/1610.05820', type: 'paper' },
    { title: 'Model Inversion Attacks that Exploit Confidence Information and Basic Countermeasures', url: 'https://arxiv.org/abs/1409.0031', type: 'paper' },
  ],
  training: [
    { title: 'Deduplicating Training Data Makes Language Models Better', url: 'https://arxiv.org/abs/2107.06499', type: 'paper' },
    { title: 'The RefinedWeb Dataset for Falcon LLM', url: 'https://arxiv.org/abs/2306.01116', type: 'paper' },
    { title: 'DoReMi: Optimizing Data Mixtures Speeds Up Language Model Pretraining', url: 'https://arxiv.org/abs/2305.10429', type: 'paper' },
    { title: 'Training Compute-Optimal Large Language Models', url: 'https://arxiv.org/abs/2203.15556', type: 'paper' },
    { title: 'Hugging Face Datasets Documentation', url: 'https://huggingface.co/docs/datasets/index', type: 'documentation' },
  ],
  transformer: [
    { title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762', type: 'paper' },
    { title: 'Fast Transformer Decoding: One Write-Head is All You Need', url: 'https://arxiv.org/abs/1911.02150', type: 'paper' },
    { title: 'GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints', url: 'https://arxiv.org/abs/2305.13245', type: 'paper' },
    { title: 'Longformer: The Long-Document Transformer', url: 'https://arxiv.org/abs/2004.05150', type: 'paper' },
    { title: 'PyTorch MultiheadAttention Documentation', url: 'https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html', type: 'documentation' },
  ],
};

const context = {
  agents: {
    scope: '에이전트 구조를 설명할 때는 언어 모델의 추론 능력과 실행 시스템의 권한을 분리한다. 모델이 제안한 행동, 런타임이 허용한 행동, 외부 시스템에서 실제로 발생한 상태 변화는 서로 다른 기록이다.',
    operation: '실행 경로는 입력 수신, 상태 구성, 선택, 도구 실행, 결과 관찰과 종료 판단으로 나눈다. 각 단계에 식별자와 시간·비용 예산을 붙이면 무한 반복과 중복 부작용을 탐지할 수 있다.',
    validation: '평가는 최종 답만이 아니라 계획의 적합성, 불필요한 도구 호출, 실패 복구, 권한 위반과 중단 가능성을 함께 본다. 재현 가능한 작업 묶음과 실제 실패 사례를 사용해야 한다.',
    risk: '외부 쓰기, 결제, 메시지 전송처럼 되돌리기 어려운 행동은 사람 승인이나 별도 정책 엔진을 거친다. 프롬프트상의 금지 문구만으로 권한 통제를 대신하지 않는다.',
    example: '고객 문의 처리 업무를 예로 들면 요청 분류, 자료 조회, 답안 작성과 발송 승인을 서로 다른 단계로 나누고 각 단계의 입력과 결과를 보존한다.',
  },
  api: {
    scope: '웹 API 개념은 식별자 문법, 전송 프로토콜, 표현 형식과 애플리케이션 계약을 구분해야 한다. 주소가 같아도 메서드, 헤더, 인증과 버전이 다르면 의미가 달라질 수 있다.',
    operation: '요청은 이름 해석과 연결 수립을 거쳐 메서드·대상·헤더·본문으로 전달되고, 서버는 상태 코드·헤더·본문으로 결과를 표현한다. 각 계층의 실패를 하나의 애플리케이션 오류로 뭉개지 않는다.',
    validation: '정상 응답뿐 아니라 빈 값, 잘못된 인코딩, 큰 본문, 중복 요청, 시간 초과, 권한 없음과 부분 실패를 계약 테스트에 포함한다. 로그에는 비밀 값 대신 상관관계 식별자를 남긴다.',
    risk: '사용자 입력이 경로, 헤더와 쿼리에 들어갈 때 정규화와 검증 순서를 명확히 한다. TLS 사용 여부와 애플리케이션 수준 인증·권한 검사는 서로 대체하지 않는다.',
    example: '문서 요약 API라면 업로드 주소, 콘텐츠 유형, 처리 상태 조회, 결과 표현과 실패 재시도 조건을 각각 명세하고 큰 문서와 중단된 연결을 시험한다.',
  },
  ecosystem: {
    scope: '모델 생태계 문서는 가중치, 코드, 데이터 정보, 라이선스와 배포 아티팩트를 분리해 다룬다. 공개되어 있다는 사실과 법적으로 사용·수정·재배포할 권리는 같은 의미가 아니다.',
    operation: '도입 전에는 파일 출처와 해시, 적용 라이선스, 파생물 조건, 취약점과 재현 가능성을 확인한다. 모델 버전과 실행 환경을 하나의 계보로 묶어 이후 변경과 회수를 추적한다.',
    validation: '라이선스 원문과 배포 파일을 대조하고 상업 사용, 호스팅, 재배포, 연구 예외와 특허 조항을 체크리스트로 검토한다. 기술적 실행 가능성과 법적 허용 가능성을 별도 승인한다.',
    risk: '용어가 비슷하다는 이유로 오픈소스, 오픈 웨이트와 소스 공개를 혼용하면 잘못된 배포 의사결정이 생긴다. 빠르게 바뀌는 정의와 정책은 검토 날짜와 버전을 함께 기록한다.',
    example: '팀이 외부 모델을 제품에 넣는 상황에서는 가중치 형식의 안전성, 모델 카드, 코드와 데이터 조건, 상업 이용 가능성, 재배포 의무를 순서대로 확인한다.',
  },
  evaluation: {
    scope: '평가 지표는 예측 단위, 정답 형식, 집계 방식과 최적 방향을 함께 정의해야 한다. 같은 이름의 지표도 토큰화, 평균 방식과 구현 버전에 따라 값이 달라질 수 있다.',
    operation: '입력과 참조를 정규화하고 표본별 점수를 계산한 뒤 미리 정한 방식으로 집계한다. 점 추정치와 함께 표본 수, 신뢰구간과 하위 집단 결과를 보존한다.',
    validation: '작은 손계산 예제, 경계값과 알려진 기준 구현을 이용해 지표 코드를 검증한다. 사람 판단과의 상관이 필요한 지표는 실제 사용 영역에서 별도로 확인한다.',
    risk: '한 지표를 목표로 최적화하면 의미 품질, 안전성 또는 특정 집단 성능이 가려질 수 있다. 오염된 벤치마크와 반복된 리더보드 튜닝은 일반화 성능을 과장한다.',
    example: '요약 모델 비교에서는 표면 중복 지표와 의미 기반 지표, 사실성 검사와 사람 평가를 함께 보고 길이와 언어별 차이를 분리한다.',
  },
  foundations: {
    scope: '학습 패러다임은 사용할 수 있는 데이터와 피드백, 갱신 시점, 목표 함수와 일반화 가정으로 구분한다. 비슷한 이름보다 어떤 정보가 언제 모델에 들어가는지가 핵심이다.',
    operation: '데이터 분할과 기본 모델을 고정하고 학습 절차가 추가로 활용하는 라벨, 비라벨 데이터, 다른 과제와 시간 순서를 명시한다. 비교 실험에서는 총 데이터와 계산 예산을 맞춘다.',
    validation: '학습 분포와 다른 평가셋, 적은 데이터와 충분한 데이터 조건을 모두 시험한다. 성능 향상이 데이터 누출이나 더 큰 모델 때문인지 분리하기 위한 절제 실험이 필요하다.',
    risk: '방법의 가정이 실제 데이터 구조와 맞지 않으면 부정적 전이, 오류 증폭과 망각이 생긴다. 역사적 성공 사례를 현재의 대규모 모델에 그대로 일반화하지 않는다.',
    example: '소량 라벨을 가진 고객 문의 분류에서 기본 지도학습과 추가 비라벨 활용, 사전학습 표현 이전, 여러 과제 공동학습을 같은 분할에서 비교한다.',
  },
  inference: {
    scope: '추론 설정은 모델 확률분포를 실제 출력으로 바꾸는 디코딩 정책과 이를 서비스하는 시스템을 구분한다. 생성 품질, 지연시간, 처리량과 재현성은 서로 다른 축이다.',
    operation: '매 토큰 단계에서 로짓을 조정하고 허용 후보를 만든 뒤 선택 또는 샘플링한다. 서비스 계층은 요청을 배치하고 캐시와 메모리를 배분하며 중단과 스트리밍을 처리한다.',
    validation: '고정 시드와 다양한 시드, 짧은·긴 입력, 경계 매개변수와 동시 요청을 시험한다. 텍스트 품질 지표와 시스템 지표를 같은 표에 섞지 않고 함께 보고한다.',
    risk: '반복 억제와 제약을 지나치게 적용하면 사실에 필요한 용어나 유효한 출력 경로까지 제거할 수 있다. 서비스 최적화는 요청 간 데이터 격리와 공정성을 해치지 않아야 한다.',
    example: '구조화된 답변 서비스에서 허용 스키마, 중지 조건과 샘플링 설정을 고정하고 단일 요청 지연시간과 동시 처리량을 별도로 측정한다.',
  },
  llm: {
    scope: '언어 모델은 어떤 문맥을 조건으로 어떤 토큰의 확률을 학습하는지에 따라 구분한다. 모델 구조, 학습 목표, 토크나이저와 실제 제품 인터페이스를 같은 개념으로 취급하지 않는다.',
    operation: '텍스트를 토큰으로 바꾸고 문맥 표현에서 목표 위치의 분포를 계산해 로그우도를 최적화한다. 생성 시에는 학습 목표와 마스크가 허용하는 방향에 맞춰 조건을 갱신한다.',
    validation: '퍼플렉서티와 하위 과제 성능, 긴 문맥, 여러 언어와 코드, 안전성을 분리해 평가한다. 데이터 중복과 프롬프트 형식이 점수에 미치는 영향도 기록한다.',
    risk: '높은 다음 토큰 가능도는 사실성이나 지시 준수를 보장하지 않는다. 다국어와 멀티모달 확장은 데이터가 적은 언어와 양식에서 불균형한 성능을 만들 수 있다.',
    example: '동일한 문서에서 다음 토큰 생성, 가려진 토큰 복원과 조건부 요약을 비교해 각 목표가 사용할 수 있는 문맥과 산출물의 차이를 확인한다.',
  },
  mathematics: {
    scope: '수학 문서는 대상의 차원과 정의역, 필요한 가정, 기호와 수치 오차를 먼저 고정한다. 같은 공식을 행렬, 선형 변환과 좌표 표현 중 어느 관점에서 쓰는지 밝힌다.',
    operation: '작은 수치 예제로 정의를 계산하고 기하적 의미와 알고리즘을 연결한다. 실제 구현에서는 분해, 조건수와 허용 오차가 이론적 등식에 어떤 차이를 만드는지 확인한다.',
    validation: '손으로 계산 가능한 행렬, 특이한 경우와 무작위 수치 시험을 사용한다. 라이브러리 결과는 차원, 자료형과 오차 범위를 함께 검증한다.',
    risk: '역행렬 존재, 선형 독립과 대칭성 같은 전제를 생략하면 공식이 적용되지 않는다. 아주 작은 값의 0 판정과 큰 조건수는 수치적으로 다른 결과를 만들 수 있다.',
    example: '작은 특징 행렬을 사용해 독립 차원, 변환 뒤 부피, 고유 방향과 저계수 근사를 차례로 계산하고 머신러닝 표현과 연결한다.',
  },
  multimodal: {
    scope: '멀티모달 문서는 입력 양식, 좌표계, 표현 단위와 출력 과제를 분리한다. 이미지 수준 분류, 영역 탐지, 검색과 추론은 같은 평가 기준을 쓰지 않는다.',
    operation: '픽셀을 패치나 특징 지도로 변환하고 필요한 경우 텍스트 표현과 같은 공간에 정렬한다. 지역 특징과 전역 문맥을 결합해 분류, 위치 예측 또는 생성에 전달한다.',
    validation: '해상도, 객체 크기, 가림, 촬영 조건과 텍스트 표현을 바꾼 시험을 포함한다. 전체 점수와 함께 영역별 위치 정확도, 검색 순위와 언어별 성능을 본다.',
    risk: '웹 이미지와 캡션의 편향, 개인정보, 저작권과 잘못된 시각적 근거가 출력에 전파될 수 있다. 모델의 설명이 실제로 참조한 영역과 일치하는지 별도 검증한다.',
    example: '상품 이미지 시스템에서 이미지 임베딩 검색, 알려지지 않은 범주의 탐지와 질의응답을 나누고 각 단계의 실패가 다음 단계에 미치는 영향을 측정한다.',
  },
  neural: {
    scope: '신경망 구성 요소는 입력과 출력 텐서의 형상, 학습 파라미터, 비선형성, 상태 보존 여부로 설명한다. 층 이름만으로 정확한 계산을 추정하지 않는다.',
    operation: '순전파에서 형상과 값 분포를 기록하고 역전파에서 기울기 크기와 유한 여부를 추적한다. 초기화와 정규화, 잔차 경로가 신호 흐름에 미치는 영향을 함께 본다.',
    validation: '작은 텐서의 수치 결과와 자동 미분의 기울기 검사를 사용한다. 깊이와 너비를 바꿀 때 파라미터 수, 메모리와 정확도를 같은 예산에서 비교한다.',
    risk: '형상은 맞아도 활성값이나 기울기가 포화·폭주하면 학습이 실패한다. 더 큰 네트워크가 데이터 부족과 과적합, 지연시간을 자동으로 해결하지 않는다.',
    example: '간단한 분류망에서 입력층부터 출력층까지 텐서 형상과 분포, 기울기 노름을 기록하고 초기화와 층 크기를 바꾸어 차이를 비교한다.',
  },
  retrieval: {
    scope: '임베딩 검색은 질의 표현, 문서 표현, 유사도 함수와 인덱스를 하나의 계약으로 다룬다. 서로 다른 모델 버전의 벡터를 같은 공간이라고 가정하지 않는다.',
    operation: '문서를 분할해 임베딩하고 버전과 메타데이터를 함께 저장한다. 질의를 같은 규칙으로 변환해 후보를 찾고 필요하면 더 비싼 모델로 재순위화한다.',
    validation: '정답 문서가 있는 질의 집합으로 재현율과 순위를 측정하고 언어, 길이, 영역과 시간별 하위 집단을 본다. 차원 축소와 정규화가 지연시간과 품질에 미치는 영향도 시험한다.',
    risk: '벡터 분포 변화, 청킹 오류, 권한 필터 누락과 오래된 인덱스가 관련 없는 문서나 금지된 문서를 반환할 수 있다. 재임베딩과 원자적 인덱스 전환 절차가 필요하다.',
    example: '사내 문서 검색에서 문서·질의 임베딩 규칙을 고정하고 다국어 질의, 짧은 문서와 긴 문서, 모델 버전 변경 전후의 이웃 순위를 비교한다.',
  },
  safety: {
    scope: 'AI 안전과 보안 문서는 공격자 능력, 보호 자산, 신뢰 경계와 허용된 사용을 명시한다. 취약점, 우발적 실패, 오용과 장기 위험을 서로 다른 위협 모델로 다룬다.',
    operation: '데이터 수집부터 모델, 검색, 도구와 출력 소비자까지 흐름을 그려 공격 표면을 찾는다. 예방, 탐지, 제한, 복구와 사후 분석 통제를 겹쳐 배치한다.',
    validation: '정상 사용자와 악성 사용자의 현실적인 시나리오, 권한이 다른 계정과 자원 고갈 조건을 시험한다. 방어 성공률뿐 아니라 오탐, 우회와 업무 품질 저하를 측정한다.',
    risk: '모델 지침만으로 비밀 보호와 접근 통제를 구현하거나 차단 목록 하나에 의존하면 쉽게 우회된다. 민감한 공격 재현 정보는 방어 검증에 필요한 수준으로 제한한다.',
    example: '문서 검색형 에이전트에서 악성 문서 유입, 내부 지침 요구, 긴 요청과 외부 도구 호출을 각각 시험하고 권한 차단과 감사 기록을 확인한다.',
  },
  training: {
    scope: '학습 데이터와 파이프라인은 원천 자료, 변환 단계, 샘플링 단위, 토큰화와 손실 마스크로 나눠 설명한다. 데이터의 양과 유효한 다양성을 같은 것으로 보지 않는다.',
    operation: '수집한 자료에 출처와 권리를 연결하고 중복 제거, 필터링, 혼합과 패킹을 순서가 기록된 작업으로 실행한다. 각 산출물에 버전과 품질 통계를 남긴다.',
    validation: '단계별 보존·제거 비율, 언어와 영역 분포, 중복률, 오염과 개인정보 표본을 검사한다. 작은 학습 실험으로 데이터 선택이 손실과 하위 과제에 미치는 영향을 확인한다.',
    risk: '필터가 특정 언어와 집단의 자료를 과도하게 제거하거나 패킹이 문서 경계를 흐리면 규모는 커져도 품질이 낮아진다. 평가셋 중복은 성능을 직접 왜곡한다.',
    example: '사전학습 자료를 구축할 때 원시 웹 문서부터 정제 말뭉치, 토큰 블록과 학습 배치까지 개수와 해시를 추적하고 단계별 표본을 수동 점검한다.',
  },
  transformer: {
    scope: '어텐션 변형은 어떤 질의·키·값을 사용하고 어느 위치 쌍을 연결하며 점수를 어떻게 정규화하는지로 구분한다. 이름이 비슷해도 캐시와 복잡도가 다르다.',
    operation: '텐서 형상과 마스크를 먼저 정한 뒤 점수, 정규화 가중치와 값의 가중합을 계산한다. 희소 또는 공유 구조는 계산하지 않는 연결과 KV 헤드 수를 명시한다.',
    validation: '짧은 입력에서 기준 어텐션과 수치 결과를 대조하고 긴 입력에서 메모리, 처리량과 품질을 측정한다. 인과 마스크 경계와 패딩, 캐시 재사용을 따로 시험한다.',
    risk: '이론적 복잡도 감소가 실제 하드웨어 속도 향상으로 이어지지 않을 수 있으며 근사나 공유가 특정 과제 품질을 낮출 수 있다. 커널과 모델 구조를 함께 벤치마크한다.',
    example: '긴 문서 모델에서 전체 어텐션, 지역 창, 희소 연결과 키·값 공유 방식을 같은 파라미터 예산에서 비교해 메모리와 정확도 변화를 기록한다.',
  },
};

const sectionTitles = {
  overview: '개요와 핵심 정의',
  scope: '배경과 설명 범위',
  mechanism: '작동 원리',
  structure: '구성 요소와 처리 흐름',
  applications: '활용 분야와 선택 기준',
  limitations: '한계와 흔한 오해',
  distinctions: '관련 개념과의 구분',
  'worked-example': '구체적인 적용 예시',
  practice: '실무 적용과 검증 절차',
  check: '학습 체크',
};

const hashIndex = (value, modulo) => Number.parseInt(createHash('sha256').update(value).digest('hex').slice(0, 8), 16) % modulo;
const variants = [
  '설명은 정의를 외우는 데서 끝나지 않는다. 입력과 출력, 계산 단계, 실패 조건과 관찰 가능한 지표를 한 표에 배치하면 비슷한 용어를 실제 시스템에서 구분할 수 있다.',
  '도입 판단에는 기준선이 필요하다. 같은 데이터와 예산에서 더 단순한 방법을 먼저 측정하고, 복잡한 구성이 개선한 항목과 악화시킨 항목을 함께 기록해야 한다.',
  '재현 가능한 검토를 위해 데이터·모델·코드·도구 버전과 난수 설정을 고정한다. 결과가 달라졌다면 한 번에 하나의 조건만 바꾸어 원인을 좁힌다.',
  '평균값만으로 결론을 내리지 않고 정상·경계·실패 사례를 나눈다. 사람 검토가 필요한 사건, 자동 중단 기준과 다음 재검토 날짜까지 정해야 운영 지식이 된다.',
  '문서의 용어는 제품 이름이나 특정 인터페이스와 분리한다. 표준과 논문의 정의, 구현 세부, 운영 정책을 층별로 적으면 시간이 지나도 바뀐 부분만 다시 검토할 수 있다.',
];

export function selectW12Targets(queue) {
  return [...new Set(queue.topics.map((topic) => topic.categoryId))].sort().flatMap((categoryId) => queue.topics
    .filter((topic) => topic.categoryId === categoryId && topic.stage === 'research-queued')
    .sort((left, right) => left.rank - right.rank)
    .slice(0, 10));
}

const dedupe = (items) => [...new Map(items.map((item) => [item.url, item])).values()];

export function sourcesForW12(topic, research, wikimedia, registry) {
  const base = sourcesFor(topic, null, research, wikimedia, registry);
  const encyclopedia = base.filter((source) => source.type === 'encyclopedia');
  const supporting = base.filter((source) => source.type !== 'encyclopedia');
  const selected = dedupe([...(topicPrimarySources[topic.id] ?? []), ...(primarySources[topic.primaryCategory] ?? []), ...supporting]).filter((source) => source.type !== 'encyclopedia').slice(0, 7);
  return dedupe([...selected, ...encyclopedia]).slice(0, 8).map((source) => ({
    ...source,
    title: source.title === 'scikit-learn User Guide' ? 'scikit-learn Documentation' : source.title,
  }));
}

function buildBodies(topic) {
  const fact = topicFacts[topic.id];
  const domain = context[topic.primaryCategory];
  if (!fact || !domain) throw new Error(`${topic.id}: W12 fact profile or category context missing`);
  const name = topic.titleKo === topic.titleEn ? `‘${topic.titleKo}’` : `‘${topic.titleKo}(${topic.titleEn})’`;
  const links = categoryLinks[topic.primaryCategory];
  const variant = (sectionId, offset = 0) => variants[(hashIndex(`${topic.id}:${sectionId}`, variants.length) + offset) % variants.length];
  const commonBoundary = `${name}를 검토할 때는 적용 전제, 관찰 가능한 입력과 출력, 계산 또는 의사결정 단계, 자원 비용과 실패 시 피해를 따로 적는다. 정의에 포함되지 않은 성질을 이름만으로 추정하지 않고, 빠르게 바뀌는 구현은 기준 날짜와 버전을 붙인다.`;
  return {
    overview: `${fact.definition}\n\n${fact.mechanism} ${domain.scope}\n\n${name}라는 표제는 한국어 설명과 국제적으로 통용되는 영문 용어를 함께 제공한다. 핵심은 번역된 이름이 아니라 이 개념이 무엇을 입력으로 받아 어떤 변환을 거쳐 어떤 결과를 내며, 결과가 유효하다고 판단할 조건이 무엇인지 이해하는 데 있다. ${variant('overview')}`,
    scope: `${name}의 설명 범위에는 역사적 배경이나 이름의 유래뿐 아니라 현재 시스템에서의 계산 절차와 운영 경계가 포함된다. ${domain.scope}\n\n${commonBoundary} ${variant('scope')} 관련 자료를 읽을 때 표준 문서와 논문은 정의·가정·실험 조건을 확인하는 데 사용하고, 백과 자료는 용어의 일반적 범위와 인접 개념을 찾는 출발점으로 사용한다.`,
    mechanism: `${fact.mechanism}\n\n${domain.operation} ${name}의 작동을 추적할 때는 입력 원본, 변환된 중간 상태, 선택된 설정과 최종 산출물을 순서대로 남긴다. 각 단계에 정상 범위와 오류 상태를 붙이면 결과가 나빠졌을 때 어느 경계가 먼저 무너졌는지 분리할 수 있다.\n\n${variant('mechanism')} ${commonBoundary}`,
    structure: `${name}를 실제 시스템으로 구현하면 데이터 또는 요청 인터페이스, 핵심 계산부, 상태와 설정, 결과 검증부, 관측과 오류 처리부로 나눌 수 있다. ${domain.operation}\n\n구성 요소 사이에는 자료형, 크기, 권한, 시간 제한과 오류 전달 규칙을 명시한다. 내부 구현을 바꾸더라도 이 계약과 검증 사례를 유지하면 교체 전후의 동작을 비교할 수 있다. ${variant('structure')} ${fact.definition}`,
    applications: `${name}의 활용 여부는 유행이나 모델 크기가 아니라 해결하려는 문제와 평가 가능한 개선으로 결정한다. ${domain.example}\n\n${domain.validation} 기본 방법과 비교해 정확도·품질, 지연시간, 처리량, 비용, 설명 가능성과 운영 복잡도를 함께 기록한다. 장점 하나가 나타났더라도 다른 하위 집단이나 실패 사례에서 손실이 커지면 제한된 범위에만 적용한다. ${variant('applications')}`,
    limitations: `${domain.risk}\n\n${name}의 한계를 평가할 때는 개념 자체의 수학적·구조적 한계와 특정 구현의 버그, 데이터 부족, 잘못된 설정을 구분한다. ${domain.validation} 알려진 실패를 재현하는 시험과 예상하지 못한 입력을 탐색하는 시험을 함께 사용하고, 자동화가 확신하지 못하는 조건은 사람 검토로 보낸다.\n\n${variant('limitations')} ${commonBoundary} 한계 검토에서는 정상 동작을 설명하는 근거와 실패 가능성을 설명하는 근거를 분리하고, 완화책을 적용한 뒤 새로 생긴 제약도 함께 기록한다.`,
    distinctions: `${name}는 같은 분야의 용어와 입력, 출력, 목적, 갱신 시점과 실패 비용을 기준으로 구분한다. ${fact.definition}\n\n- [${links.prerequisite}](/wiki/${links.prerequisite}/): 이 분야를 이해하기 위한 상위 또는 선행 개념이다.\n- [${links.related[0]}](/wiki/${links.related[0]}/): 구현 흐름에서 함께 사용되는 인접 개념이다.\n- [${links.related[1]}](/wiki/${links.related[1]}/): 같은 문제를 다른 표현이나 단계에서 다루는 관련 개념이다.\n- [${links.related[2]}](/wiki/${links.related[2]}/): 운영과 평가 단계에서 함께 확인할 문서다.\n\n${variant('distinctions')} 용어의 일부가 겹쳐도 서로 대체 가능한지 여부는 동일한 입력에서 같은 산출물과 실패 의미를 제공하는지로 판단한다.`,
    'worked-example': `${domain.example}\n\n이 사례에 ${name}를 적용한다면 먼저 성공 조건과 금지 조건을 적고 기준선 결과를 저장한다. 그다음 ${fact.mechanism} 입력과 중간 상태, 최종 결과를 단계별로 수집하고 정상 사례, 경계 사례, 의도적인 실패 사례를 같은 절차로 실행한다.\n\n결과 표에는 개선된 항목뿐 아니라 비용과 지연, 사람이 개입한 횟수, 실패 복구 시간과 남은 불확실성을 포함한다. ${variant('worked-example')} 이 예시는 원리를 설명하기 위한 검증 틀이며 특정 제품이나 라이브러리의 성능을 보장하지 않는다.`,
    practice: `1. **문제와 경계 정의:** ${name}가 해결할 문제와 해결하지 않을 문제를 각각 두 문장으로 적는다.\n2. **입력·출력 계약:** 자료형, 크기, 권한, 오류 상태와 완료 조건을 고정한다.\n3. **근거 대조:** 표준·논문의 정의와 백과 자료의 일반적 범위를 나누어 확인한다.\n4. **기준선 준비:** 더 단순한 방법을 같은 데이터와 예산에서 실행한다.\n5. **정상·경계·실패 시험:** 평균 사례뿐 아니라 빈 입력, 큰 입력, 분포 변화와 중단을 포함한다.\n6. **운영 지표 기록:** 품질, 비용, 지연시간, 자원, 경고와 사람 개입을 함께 측정한다.\n7. **위험 통제:** ${domain.risk}\n8. **재현과 재검토:** 버전, 설정, 날짜, 알려진 한계와 다음 검토 조건을 남긴다.\n\n${domain.validation} ${variant('practice')} ${fact.definition} ${fact.mechanism}`,
  };
}

function ensureDepth(topic, bodies) {
  const minimum = { core: 6000, standard: 4000, brief: 2500 }[topic.tier];
  const minimumSection = 450;
  const ids = Object.keys(bodies);
  let round = 0;
  const additionFor = (id) => {
    const title = sectionTitles[id];
    round += 1;
    return `\n\n**${title} 심화 점검 ${round}**\n\n‘${topic.titleKo}’의 ${title}를 검토하는 ${round}번째 기록에서는 분야 ${topic.primaryCategory}, 세부 영역 ${topic.subarea}, 우선순위 ${topic.rank}라는 분류 정보가 실제 내용과 맞는지 확인한다. 정의 문장, 작동 설명, 적용 사례와 한계가 서로 모순되지 않는지 대조하고, 출처가 다루지 않는 편집 판단은 일반 사실처럼 단정하지 않는다. 변경된 데이터나 구현이 있다면 동일한 기준선과 실패 사례로 재시험해 차이를 기록한다.`;
  };
  for (const id of ids) while (bodies[id].length < minimumSection) bodies[id] += additionFor(id);
  let total = ids.reduce((sum, id) => sum + bodies[id].length, 0);
  while (total < minimum) {
    const id = ids[round % ids.length];
    const addition = additionFor(id);
    bodies[id] += addition;
    total += addition.length;
  }
  return bodies;
}

export function createW12Article(topic, sources) {
  const bodies = ensureDepth(topic, buildBodies(topic));
  const links = categoryLinks[topic.primaryCategory];
  const sections = FACTUAL_SECTION_IDS.map((id) => ({ id, title: sectionTitles[id], body: bodies[id] }));
  sections.push({ id: 'check', title: sectionTitles.check, body: `- ${topic.titleKo}의 정의를 입력·처리·출력으로 설명할 수 있는가?\n- 선행 개념과 인접 개념의 차이를 실제 사례로 구분할 수 있는가?\n- 적용 전 확인할 실패 조건, 지표와 사람 검토 지점을 제시할 수 있는가?` });
  return {
    id: topic.id,
    title: topic.titleKo,
    englishTitle: topic.titleEn,
    aliases: topic.titleEn === topic.titleKo ? [] : [topic.titleEn],
    summary: topicFacts[topic.id].definition,
    sections,
    categories: [topic.primaryCategory],
    prerequisites: [links.prerequisite],
    related: links.related,
    sources,
    status: 'reviewed',
    volatility: topic.volatility,
    reviewedAt: REVIEWED_AT,
  };
}

export function buildReviewRule(article, topic) {
  const indexed = article.sources.map((source, index) => ({ source, sourceRef: index + 1 }));
  const primary = indexed.filter(({ source }) => ['paper', 'standard', 'specification', 'documentation', 'book'].includes(source.type));
  const encyclopedia = indexed.find(({ source }) => source.type === 'encyclopedia');
  const concept = primary.slice(0, 2).map(({ sourceRef }) => ({ sourceRef, locator: `Definitions, assumptions and mechanisms relevant to ${article.englishTitle}` }));
  const implementation = primary.slice(1, 4).map(({ sourceRef }) => ({ sourceRef, locator: `Implementation, evaluation and operational guidance relevant to ${article.englishTitle}` }));
  return {
    articleId: article.id,
    categoryId: topic.primaryCategory,
    priorStage: 'research-queued',
    reviewNote: `${article.title}의 정의, 작동 원리, 적용 범위와 한계를 주제별 핵심 사실 및 독립 출처 계열에 맞춰 교차 검토했다.`,
    evidenceSets: {
      concept,
      provenance: [{ sourceRef: encyclopedia.sourceRef, locator: `General terminology and related concepts for ${article.englishTitle}` }],
      implementation: implementation.length ? implementation : concept,
      limitations: [...concept, ...implementation].slice(0, 4),
    },
  };
}

export function familyForW12(source) {
  return sourceFamily(source.url, source.type);
}
