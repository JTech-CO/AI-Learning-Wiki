export const CATEGORY_META = {
  foundations: ['AI·머신러닝 기초', '인공지능의 범위와 기본 학습 방식', 'https://www.deeplearningbook.org/', 'Deep Learning Book', 'book'],
  mathematics: ['수학·통계 기초', '모델을 이해하는 데 필요한 수학과 확률', 'https://www.deeplearningbook.org/contents/linear_algebra.html', 'Deep Learning Book: Linear Algebra', 'book'],
  neural: ['신경망과 딥러닝', '신경망의 구성 요소와 학습 원리', 'https://www.deeplearningbook.org/contents/mlp.html', 'Deep Learning Book: Deep Feedforward Networks', 'book'],
  transformer: ['트랜스포머와 모델 구조', '현대 언어 모델을 이루는 핵심 아키텍처', 'https://arxiv.org/abs/1706.03762', 'Attention Is All You Need', 'paper'],
  llm: ['LLM과 토큰 처리', '언어 모델의 입력·문맥·생성 단위', 'https://arxiv.org/abs/2005.14165', 'Language Models are Few-Shot Learners', 'paper'],
  training: ['학습과 사후학습', '사전학습부터 정렬·경량화까지의 방법', 'https://arxiv.org/abs/2203.02155', 'Training language models to follow instructions with human feedback', 'paper'],
  inference: ['추론·서빙·최적화', '학습된 모델이 출력을 생성하고 서비스되는 방식', 'https://arxiv.org/abs/2309.06180', 'Efficient Memory Management for Large Language Model Serving with PagedAttention', 'paper'],
  retrieval: ['임베딩·검색·RAG', '외부 지식을 검색해 생성에 결합하는 기술', 'https://arxiv.org/abs/2005.11401', 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', 'paper'],
  api: ['API·SDK·도구 호출', '모델을 소프트웨어와 연결하는 인터페이스', 'https://developer.mozilla.org/en-US/docs/Web/HTTP', 'MDN Web Docs: HTTP', 'documentation'],
  agents: ['에이전트·자동화·MCP', '모델이 도구를 사용해 여러 단계를 수행하는 구조', 'https://arxiv.org/abs/2210.03629', 'ReAct: Synergizing Reasoning and Acting in Language Models', 'paper'],
  multimodal: ['멀티모달 AI', '텍스트와 이미지·음성·영상을 함께 다루는 모델', 'https://arxiv.org/abs/2103.00020', 'Learning Transferable Visual Models From Natural Language Supervision', 'paper'],
  evaluation: ['평가·관측성·벤치마크', '모델과 시스템의 품질을 측정하는 방법', 'https://arxiv.org/abs/2211.09110', 'Holistic Evaluation of Language Models', 'paper'],
  safety: ['안전·보안·윤리', 'AI 시스템의 위험을 식별하고 통제하는 방법', 'https://www.nist.gov/itl/ai-risk-management-framework', 'NIST AI Risk Management Framework', 'standard'],
  ecosystem: ['모델·서비스 생태계', '모델 공개와 배포 생태계의 기본 개념', 'https://opensource.org/osd', 'The Open Source Definition', 'standard']
};

const groups = {
  foundations: [
    ['artificial-intelligence','인공지능','Artificial Intelligence','컴퓨터 시스템이 지각·추론·학습·행동과 같은 지능적 과제를 수행하도록 만드는 연구와 기술의 총칭이다.'],
    ['machine-learning','머신러닝','Machine Learning','명시적으로 모든 규칙을 작성하지 않고 데이터에서 패턴을 학습해 예측이나 결정을 수행하는 인공지능의 한 분야다.'],
    ['deep-learning','딥러닝','Deep Learning','여러 층의 신경망으로 데이터의 표현을 단계적으로 학습하는 머신러닝 방법이다.'],
    ['generative-ai','생성형 인공지능','Generative AI','학습 데이터의 분포를 바탕으로 텍스트·이미지·음성·코드 같은 새로운 결과물을 생성하는 인공지능이다.'],
    ['supervised-learning','지도학습','Supervised Learning','입력과 정답이 함께 있는 데이터로 입력에서 정답으로의 관계를 학습하는 방식이다.'],
    ['unsupervised-learning','비지도학습','Unsupervised Learning','정답 표지 없이 데이터 내부의 구조·군집·표현을 찾는 학습 방식이다.'],
    ['self-supervised-learning','자기지도학습','Self-Supervised Learning','데이터 자체에서 학습 목표를 만들어 대규모 비표지 데이터로 표현을 익히는 방식이다.'],
    ['reinforcement-learning','강화학습','Reinforcement Learning','에이전트가 환경과 상호작용하며 누적 보상을 높이는 행동 정책을 학습하는 방식이다.'],
    ['training-data','학습 데이터','Training Data','모델이 파라미터를 조정하며 패턴을 배우는 데 사용하는 예시와 기록의 집합이다.'],
    ['dataset','데이터셋','Dataset','특정 분석이나 학습 목적에 맞춰 구조화하고 관리하는 데이터의 모음이다.'],
    ['model','모델','Model','입력을 출력으로 변환하도록 데이터에서 학습된 수학적 함수와 파라미터의 집합이다.'],
    ['algorithm','알고리즘','Algorithm','문제를 해결하기 위해 입력을 처리하는 유한하고 명확한 절차다.']
  ],
  mathematics: [
    ['vector','벡터','Vector','크기와 방향 또는 순서가 있는 수치 목록으로, 모델에서 데이터와 파라미터를 표현하는 기본 단위다.'],
    ['matrix','행렬','Matrix','수치를 행과 열로 배열한 구조로, 신경망의 선형 변환과 배치 계산에 사용된다.'],
    ['tensor','텐서','Tensor','스칼라·벡터·행렬을 일반화한 다차원 수치 배열이다.'],
    ['probability','확률','Probability','불확실한 사건이 일어날 가능성을 수치로 표현하는 체계다.'],
    ['probability-distribution','확률분포','Probability Distribution','가능한 값마다 확률을 대응시켜 불확실성을 나타내는 함수다.'],
    ['conditional-probability','조건부확률','Conditional Probability','어떤 사건이 주어졌을 때 다른 사건이 발생할 확률이다.'],
    ['gradient','기울기','Gradient','여러 변수에 대한 함수 변화율을 모은 벡터로, 손실을 줄이는 방향을 알려준다.'],
    ['derivative','미분','Derivative','입력의 작은 변화에 따라 함수 값이 얼마나 변하는지를 나타내는 연산이다.'],
    ['optimization','최적화','Optimization','목적 함수를 최소화하거나 최대화하는 파라미터를 찾는 과정이다.'],
    ['cosine-similarity','코사인 유사도','Cosine Similarity','두 벡터 사이 각도의 코사인으로 방향의 유사성을 측정하는 값이다.']
  ],
  neural: [
    ['neural-network','신경망','Neural Network','연결된 계산 단위와 가중치를 층으로 쌓아 복잡한 함수를 학습하는 모델이다.'],
    ['neuron','인공 뉴런','Artificial Neuron','입력의 가중합에 활성화 함수를 적용해 출력을 만드는 신경망의 계산 단위다.'],
    ['layer','신경망 층','Neural Network Layer','같은 단계에서 입력을 변환하는 여러 계산 단위의 묶음이다.'],
    ['weight','가중치','Weight','입력 신호가 출력에 미치는 상대적 크기를 조절하며 학습되는 파라미터다.'],
    ['bias','편향 항','Bias Term','선형 변환의 기준점을 이동시키기 위해 더하는 학습 가능한 값이다.'],
    ['activation-function','활성화 함수','Activation Function','신경망에 비선형성을 부여해 복잡한 관계를 표현하게 하는 함수다.'],
    ['loss-function','손실 함수','Loss Function','모델의 예측과 목표 사이 차이를 하나의 수치로 측정하는 함수다.'],
    ['backpropagation','역전파','Backpropagation','출력의 손실에서 각 파라미터의 기여도를 연쇄 법칙으로 계산하는 알고리즘이다.'],
    ['gradient-descent','경사하강법','Gradient Descent','손실 함수의 기울기 반대 방향으로 파라미터를 반복 갱신하는 최적화 방법이다.'],
    ['learning-rate','학습률','Learning Rate','한 번의 최적화 단계에서 파라미터를 얼마나 크게 변경할지 정하는 값이다.'],
    ['epoch','에포크','Epoch','학습 알고리즘이 전체 학습 데이터셋을 한 번 처리한 주기다.'],
    ['batch','배치','Batch','한 번의 순전파와 역전파에서 함께 처리하는 데이터 예시의 묶음이다.']
  ],
  transformer: [
    ['transformer','트랜스포머','Transformer','어텐션을 중심으로 시퀀스의 관계를 병렬 계산하는 신경망 아키텍처다.'],
    ['attention','어텐션','Attention','현재 표현을 만들 때 입력의 각 부분에 서로 다른 중요도를 부여해 정보를 결합하는 연산이다.'],
    ['self-attention','셀프 어텐션','Self-Attention','하나의 시퀀스 안에서 각 위치가 다른 위치의 정보를 참조하는 어텐션이다.'],
    ['cross-attention','크로스 어텐션','Cross-Attention','한 시퀀스의 질의가 다른 시퀀스의 키와 값을 참조하는 어텐션이다.'],
    ['query-key-value','쿼리·키·값','Query, Key, Value','어텐션에서 참조할 정보의 관련도를 계산하고 내용을 모으는 세 표현이다.'],
    ['multi-head-attention','멀티헤드 어텐션','Multi-Head Attention','여러 어텐션 헤드가 서로 다른 관계를 병렬로 학습하도록 구성한 연산이다.'],
    ['positional-encoding','위치 인코딩','Positional Encoding','어텐션 모델에 토큰의 순서와 상대 위치 정보를 주입하는 표현이다.'],
    ['encoder','인코더','Encoder','입력 시퀀스를 문맥이 반영된 내부 표현으로 변환하는 구성 요소다.'],
    ['decoder','디코더','Decoder','이전 출력과 문맥을 이용해 다음 출력을 순차적으로 생성하는 구성 요소다.'],
    ['encoder-decoder','인코더-디코더','Encoder-Decoder','입력을 인코딩한 뒤 별도의 디코더가 출력을 생성하는 모델 구조다.'],
    ['decoder-only-model','디코더 전용 모델','Decoder-Only Model','인과적 어텐션을 사용하는 디코더 블록만으로 다음 토큰을 생성하는 모델이다.'],
    ['feed-forward-network','피드포워드 네트워크','Feed-Forward Network','각 토큰 위치에 독립적으로 적용되는 비선형 완전연결 변환 블록이다.'],
    ['residual-connection','잔차 연결','Residual Connection','블록의 입력을 출력에 더해 깊은 신경망의 학습을 안정화하는 연결이다.'],
    ['layer-normalization','레이어 정규화','Layer Normalization','한 샘플 내부 특성의 분포를 정규화해 학습과 추론을 안정화하는 연산이다.'],
    ['causal-mask','인과 마스크','Causal Mask','현재 위치가 미래 토큰을 참조하지 못하게 어텐션 점수를 제한하는 마스크다.']
  ],
  llm: [
    ['language-model','언어 모델','Language Model','토큰 시퀀스의 확률 분포를 학습해 다음 토큰이나 누락된 토큰을 예측하는 모델이다.'],
    ['large-language-model','대규모 언어 모델','Large Language Model','대규모 데이터와 많은 파라미터로 학습해 다양한 언어 과제를 수행하는 언어 모델이다.'],
    ['small-language-model','소규모 언어 모델','Small Language Model','제한된 자원과 특정 환경에서 효율적으로 동작하도록 규모를 줄인 언어 모델이다.'],
    ['parameter','파라미터','Parameter','학습 과정에서 조정되어 모델의 입력-출력 변환을 결정하는 수치다.'],
    ['hyperparameter','하이퍼파라미터','Hyperparameter','학습 전에 사람이 정하거나 탐색하며 학습 과정과 모델 구조를 제어하는 값이다.'],
    ['token','토큰','Token','언어 모델이 텍스트를 처리하기 위해 나눈 기본 기호 단위다.'],
    ['tokenization','토큰화','Tokenization','문자열을 모델의 어휘 집합에 있는 토큰 ID 시퀀스로 변환하는 과정이다.'],
    ['tokenizer','토크나이저','Tokenizer','텍스트와 토큰 ID 사이의 분할·변환 규칙을 구현한 구성 요소다.'],
    ['vocabulary','어휘 집합','Vocabulary','토크나이저와 모델이 구분해 처리할 수 있는 토큰의 전체 목록이다.'],
    ['byte-pair-encoding','바이트 페어 인코딩','Byte Pair Encoding','자주 함께 나타나는 기호 쌍을 반복 병합해 서브워드 어휘를 만드는 방식이다.'],
    ['context-window','컨텍스트 윈도우','Context Window','모델이 한 번의 요청에서 참조할 수 있는 토큰 범위다.'],
    ['prompt','프롬프트','Prompt','모델에 과제·문맥·제약·출력 형식을 전달하는 입력이다.'],
    ['completion','컴플리션','Completion','프롬프트와 이전 토큰을 조건으로 모델이 생성한 후속 토큰 시퀀스다.'],
    ['next-token-prediction','다음 토큰 예측','Next-Token Prediction','이전 토큰들이 주어졌을 때 다음 토큰의 확률 분포를 예측하는 학습 목표다.'],
    ['mixture-of-experts','전문가 혼합','Mixture of Experts','입력마다 일부 전문가 네트워크만 선택해 계산량 대비 모델 용량을 늘리는 구조다.']
  ],
  training: [
    ['pretraining','사전학습','Pretraining','대규모 데이터로 일반적인 표현과 패턴을 먼저 학습하는 단계다.'],
    ['fine-tuning','미세조정','Fine-Tuning','사전학습 모델을 특정 데이터와 목적에 맞게 추가 학습하는 과정이다.'],
    ['supervised-fine-tuning','지도 미세조정','Supervised Fine-Tuning','지시와 모범 응답 쌍으로 모델이 원하는 응답 형식을 따르도록 학습하는 단계다.'],
    ['instruction-tuning','지시 튜닝','Instruction Tuning','다양한 자연어 지시 데이터로 여러 과제를 지시 형식에 맞게 수행하도록 만드는 학습이다.'],
    ['rlhf','인간 피드백 기반 강화학습','Reinforcement Learning from Human Feedback','사람의 선호 신호를 이용해 모델 응답 정책을 조정하는 사후학습 방법이다.'],
    ['reward-model','보상 모델','Reward Model','여러 모델 출력 중 사람의 선호에 가까운 출력을 점수화하도록 학습된 모델이다.'],
    ['dpo','직접 선호 최적화','Direct Preference Optimization','별도 강화학습 루프 없이 선호 응답과 비선호 응답으로 정책을 직접 최적화하는 방법이다.'],
    ['lora','LoRA','Low-Rank Adaptation','기존 가중치를 고정하고 저랭크 행렬만 학습하는 파라미터 효율적 미세조정 기법이다.'],
    ['peft','파라미터 효율적 미세조정','Parameter-Efficient Fine-Tuning','전체 가중치 대신 일부 작은 파라미터만 학습해 비용을 줄이는 기법들의 총칭이다.'],
    ['knowledge-distillation','지식 증류','Knowledge Distillation','큰 교사 모델의 출력이나 표현을 작은 학생 모델이 모방하도록 학습하는 방법이다.'],
    ['quantization','양자화','Quantization','가중치와 활성값을 낮은 정밀도로 표현해 메모리와 계산 비용을 줄이는 기법이다.'],
    ['data-augmentation','데이터 증강','Data Augmentation','기존 예시를 변형하거나 합성해 학습 데이터의 다양성을 높이는 방법이다.'],
    ['synthetic-data','합성 데이터','Synthetic Data','실제 수집 대신 규칙·시뮬레이션·생성 모델로 만든 데이터다.'],
    ['checkpoint','체크포인트','Checkpoint','특정 학습 시점의 모델 가중치와 최적화 상태를 저장한 파일 집합이다.'],
    ['alignment','AI 정렬','AI Alignment','모델의 행동이 사람의 의도·가치·안전 제약과 일치하도록 만드는 연구와 과정이다.']
  ],
  inference: [
    ['inference','추론','Inference','학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다.'],
    ['logit','로짓','Logit','확률 변환 전에 모델이 각 후보 토큰에 부여하는 정규화되지 않은 점수다.'],
    ['softmax','소프트맥스','Softmax','여러 로짓을 합이 1인 확률 분포로 변환하는 함수다.'],
    ['temperature','생성 온도','Temperature','로짓의 크기를 조정해 생성 확률 분포의 평탄함과 무작위성을 제어하는 값이다.'],
    ['top-k-sampling','Top-k 샘플링','Top-k Sampling','확률이 높은 상위 k개 후보만 남겨 다음 토큰을 선택하는 방법이다.'],
    ['top-p-sampling','Top-p 샘플링','Top-p Sampling','누적 확률이 p에 도달하는 최소 후보 집합에서 다음 토큰을 선택하는 방법이다.'],
    ['greedy-decoding','그리디 디코딩','Greedy Decoding','매 단계에서 확률이 가장 높은 토큰을 선택하는 결정적 생성 방식이다.'],
    ['beam-search','빔 탐색','Beam Search','여러 후보 시퀀스를 동시에 유지하며 전체 점수가 높은 출력을 찾는 탐색 방법이다.'],
    ['kv-cache','KV 캐시','Key-Value Cache','이전 토큰의 어텐션 키와 값을 저장해 자동회귀 생성의 중복 계산을 줄이는 캐시다.'],
    ['batching','배칭','Batching','여러 추론 요청을 묶어 하드웨어 사용률과 처리량을 높이는 기법이다.'],
    ['latency','지연 시간','Latency','요청을 보낸 뒤 첫 토큰 또는 전체 응답을 받을 때까지 걸리는 시간이다.'],
    ['throughput','처리량','Throughput','단위 시간에 시스템이 처리하거나 생성할 수 있는 요청 또는 토큰 수다.']
  ],
  retrieval: [
    ['embedding','임베딩','Embedding','문장·이미지·항목의 의미나 특성을 연속적인 벡터 공간에 표현한 값이다.'],
    ['embedding-model','임베딩 모델','Embedding Model','입력을 의미 비교와 검색에 사용할 고정 길이 벡터로 변환하는 모델이다.'],
    ['vector-database','벡터 데이터베이스','Vector Database','고차원 벡터와 메타데이터를 저장하고 유사도 검색을 제공하는 데이터 시스템이다.'],
    ['semantic-search','의미 검색','Semantic Search','문자열의 정확한 일치보다 질의와 문서의 의미 유사성을 이용하는 검색 방식이다.'],
    ['nearest-neighbor-search','최근접 이웃 검색','Nearest Neighbor Search','벡터 공간에서 질의 벡터와 가장 가까운 항목을 찾는 문제다.'],
    ['approximate-nearest-neighbor','근사 최근접 이웃 검색','Approximate Nearest Neighbor','정확도를 일부 양보하고 대규모 벡터 검색 속도를 높이는 알고리즘 계열이다.'],
    ['rag','검색 증강 생성','Retrieval-Augmented Generation','외부 자료를 검색해 그 결과를 생성 모델의 문맥으로 제공하는 구조다.'],
    ['retriever','검색기','Retriever','질의와 관련된 문서나 청크 후보를 저장소에서 찾는 구성 요소다.'],
    ['reranker','리랭커','Reranker','초기 검색 후보를 질의 관련성 기준으로 다시 정렬하는 모델이나 규칙이다.'],
    ['chunking','청킹','Chunking','긴 문서를 검색과 문맥 구성에 적합한 작은 단위로 나누는 과정이다.'],
    ['grounding','근거화','Grounding','모델 출력을 제공된 자료나 검증 가능한 외부 사실에 연결하는 방법이다.'],
    ['citation','인용','Citation','주장이나 생성 결과가 근거로 삼은 자료의 위치와 출처를 표시하는 정보다.']
  ],
  api: [
    ['api','API','Application Programming Interface','소프트웨어 구성 요소가 정해진 규약으로 기능과 데이터를 요청·교환하는 인터페이스다.'],
    ['rest-api','REST API','REST API','HTTP 자원과 메서드를 중심으로 상태를 주고받도록 설계한 웹 API 방식이다.'],
    ['sdk','SDK','Software Development Kit','특정 플랫폼이나 API를 쉽게 사용하도록 제공하는 라이브러리·도구·문서의 묶음이다.'],
    ['http-request','HTTP 요청','HTTP Request','클라이언트가 서버에 메서드·주소·헤더·본문을 보내는 메시지다.'],
    ['json','JSON','JavaScript Object Notation','키-값과 배열 구조로 데이터를 표현하는 경량 텍스트 형식이다.'],
    ['api-key','API 키','API Key','API 요청의 프로젝트나 사용자를 식별하고 권한을 확인하는 비밀 문자열이다.'],
    ['rate-limit','요청 한도','Rate Limit','일정 시간 동안 허용하는 요청이나 토큰 사용량을 제한하는 정책이다.'],
    ['streaming-response','스트리밍 응답','Streaming Response','전체 결과가 완성되기 전에 생성된 일부 데이터를 순차적으로 전송하는 방식이다.'],
    ['structured-output','구조화 출력','Structured Output','모델 출력을 미리 정의한 JSON 스키마나 데이터 구조에 맞추는 기능이다.'],
    ['tool-calling','도구 호출','Tool Calling','모델이 정해진 함수 스키마를 선택하고 인수를 생성해 외부 기능 실행을 요청하는 방식이다.']
  ],
  agents: [
    ['ai-agent','AI 에이전트','AI Agent','목표를 바탕으로 상태를 관찰하고 도구를 선택해 여러 단계의 작업을 수행하는 시스템이다.'],
    ['agent-loop','에이전트 루프','Agent Loop','관찰·추론·행동·결과 반영을 목표 달성까지 반복하는 실행 구조다.'],
    ['planning','계획','Planning','목표를 하위 단계와 실행 순서로 분해하고 필요에 따라 계획을 수정하는 과정이다.'],
    ['agent-memory','에이전트 메모리','Agent Memory','에이전트가 이전 상호작용과 작업 상태를 저장하고 이후 판단에 사용하는 구조다.'],
    ['state-management','상태 관리','State Management','여러 단계에 걸쳐 입력·중간 결과·진행 상황을 일관되게 유지하는 방법이다.'],
    ['workflow-orchestration','워크플로 오케스트레이션','Workflow Orchestration','여러 작업·모델·도구의 실행 순서와 조건을 제어하는 과정이다.'],
    ['multi-agent-system','멀티 에이전트 시스템','Multi-Agent System','역할이 다른 여러 에이전트가 협력하거나 경쟁하며 문제를 해결하는 시스템이다.'],
    ['human-in-the-loop','인간 참여형 제어','Human in the Loop','중요한 판단이나 실행 단계에 사람의 검토·승인·교정을 포함하는 설계다.'],
    ['mcp','모델 컨텍스트 프로토콜','Model Context Protocol','AI 애플리케이션이 외부 도구와 데이터 소스를 표준 방식으로 연결하도록 정의한 프로토콜이다.'],
    ['webhook','웹훅','Webhook','특정 이벤트가 발생했을 때 다른 시스템의 URL로 데이터를 보내는 자동 통지 방식이다.']
  ],
  multimodal: [
    ['multimodal-model','멀티모달 모델','Multimodal Model','텍스트·이미지·음성·영상 등 둘 이상의 데이터 양식을 함께 처리하는 모델이다.'],
    ['vision-language-model','비전-언어 모델','Vision-Language Model','이미지와 텍스트의 관계를 학습해 이해와 생성을 수행하는 멀티모달 모델이다.'],
    ['image-generation','이미지 생성','Image Generation','텍스트나 다른 조건을 바탕으로 새로운 이미지를 합성하는 생성 과제다.'],
    ['diffusion-model','확산 모델','Diffusion Model','데이터에 노이즈를 더하고 제거하는 역과정을 학습해 샘플을 생성하는 모델이다.'],
    ['speech-recognition','음성 인식','Automatic Speech Recognition','음성 신호를 텍스트나 언어 단위로 변환하는 기술이다.'],
    ['text-to-speech','음성 합성','Text-to-Speech','텍스트를 자연스러운 음성 파형으로 변환하는 기술이다.'],
    ['ocr','광학 문자 인식','Optical Character Recognition','이미지 속 글자의 위치와 내용을 판독해 텍스트로 변환하는 기술이다.'],
    ['multimodal-embedding','멀티모달 임베딩','Multimodal Embedding','서로 다른 데이터 양식을 비교 가능한 하나의 벡터 공간에 배치한 표현이다.']
  ],
  evaluation: [
    ['evaluation','모델 평가','Model Evaluation','정해진 데이터·기준·절차로 모델이나 시스템의 품질과 위험을 측정하는 과정이다.'],
    ['benchmark','벤치마크','Benchmark','여러 모델이나 시스템을 비교하기 위해 고정한 과제·데이터·평가 지표의 묶음이다.'],
    ['metric','평가 지표','Evaluation Metric','성능이나 품질의 특정 측면을 수치로 요약하는 측정 기준이다.'],
    ['accuracy','정확도','Accuracy','전체 평가 예시 중 모델이 정답을 맞힌 비율이다.'],
    ['precision-recall','정밀도와 재현율','Precision and Recall','양성 예측의 신뢰성과 실제 양성을 찾아낸 비율을 각각 나타내는 지표다.'],
    ['llm-as-a-judge','LLM 심사자','LLM as a Judge','언어 모델을 사용해 다른 모델 출력의 품질을 판정하거나 비교하는 평가 방식이다.'],
    ['observability','관측성','Observability','로그·메트릭·추적 정보로 시스템 내부 상태와 실패 원인을 이해할 수 있는 정도다.'],
    ['tracing','추적','Tracing','한 요청이 여러 모델·도구·단계를 거치는 실행 흐름과 시간을 기록하는 방법이다.']
  ],
  safety: [
    ['hallucination','환각','Hallucination','모델이 근거가 없거나 사실과 다른 내용을 그럴듯하게 생성하는 현상이다.'],
    ['prompt-injection','프롬프트 인젝션','Prompt Injection','악의적 입력이 기존 지시를 무시하거나 비밀을 노출하도록 모델 행동을 조작하는 공격이다.'],
    ['jailbreak','탈옥 공격','Jailbreak','모델의 안전 정책과 행동 제한을 우회하도록 입력을 구성하는 공격 기법이다.'],
    ['guardrail','가드레일','Guardrail','모델 입력·출력·도구 실행을 검사하고 위험 행동을 제한하는 정책과 기술이다.'],
    ['content-moderation','콘텐츠 조정','Content Moderation','유해하거나 정책을 위반하는 콘텐츠를 탐지·분류·처리하는 과정이다.'],
    ['bias-fairness','편향과 공정성','Bias and Fairness','모델의 결과가 집단이나 특성에 따라 체계적으로 불리하게 달라지는지를 다루는 개념이다.'],
    ['privacy','개인정보 보호','Privacy','AI 시스템이 개인 데이터를 수집·처리·저장·공개할 때 권리와 위험을 관리하는 원칙이다.'],
    ['ai-governance','AI 거버넌스','AI Governance','AI의 개발과 사용을 조직의 정책·책임·통제·감사 체계로 관리하는 활동이다.']
  ],
  ecosystem: [
    ['open-source-model','오픈소스 모델','Open-Source Model','가중치·코드·학습 정보 중 일부를 공개 라이선스나 이용 조건과 함께 배포하는 모델이다.'],
    ['model-license','모델 라이선스','Model License','모델 가중치와 출력의 사용·수정·재배포 조건을 정한 법적 약정이다.'],
    ['model-hub','모델 허브','Model Hub','모델·데이터셋·데모·평가 정보를 검색하고 배포하는 공유 플랫폼이다.']
  ]
};

export const ARTICLE_SEEDS = Object.entries(groups).flatMap(([category, rows]) => rows.map((row, index) => ({ category, index, slug: row[0], title: row[1], englishTitle: row[2], definition: row[3] })));

const course = (id, title, audience, description, refs) => ({ id, title, audience, description, steps: refs.map((ref, index) => ({ ref, required: index < Math.ceil(refs.length * 0.75), reason: index === 0 ? '과정의 공통 언어와 출발점을 먼저 확립한다.' : '앞 단계의 개념을 확장해 다음 주제를 이해하기 위한 연결 고리를 만든다.' })) });

export const WIKI_PATHS = [
  course('ai-foundations','AI 기초','AI를 처음 체계적으로 이해하려는 학습자','용어와 원리부터 언어 모델의 기본 작동까지 이해하는 백과 중심 과정이다.',['artificial-intelligence','machine-learning','deep-learning','generative-ai','model','training-data','neural-network','parameter','language-model','large-language-model','token','next-token-prediction','prompt','hallucination']),
  course('llm-internals','LLM 내부 구조','언어 모델의 내부 원리를 이해하려는 학습자','토큰 처리에서 트랜스포머와 생성 파라미터까지 순서대로 연결한다.',['vector','matrix','neural-network','embedding','tokenization','vocabulary','transformer','attention','self-attention','query-key-value','positional-encoding','decoder-only-model','context-window','logit','softmax','temperature','top-k-sampling','top-p-sampling']),
  course('model-training','모델 학습과 튜닝','모델 학습·튜닝 업무를 준비하는 학습자','학습의 수학적 기초부터 사후학습과 경량화까지 다루는 백과 과정이다.',['probability','gradient','optimization','loss-function','backpropagation','gradient-descent','learning-rate','pretraining','fine-tuning','supervised-fine-tuning','instruction-tuning','rlhf','reward-model','dpo','lora','peft','knowledge-distillation','quantization']),
  course('rag-search','임베딩과 RAG','문서 검색과 지식 기반 AI를 설계하려는 학습자','벡터 표현, 검색, 재정렬, 근거화의 관계를 순서대로 이해한다.',['vector','cosine-similarity','embedding','embedding-model','semantic-search','nearest-neighbor-search','approximate-nearest-neighbor','vector-database','chunking','retriever','reranker','rag','grounding','citation']),
  course('api-development','AI API 개발','모델 API를 애플리케이션에 연결하려는 개발자','웹 API 기초와 모델 호출, 구조화 출력, 추론 운영 개념을 연결한다.',['api','http-request','json','rest-api','sdk','api-key','rate-limit','streaming-response','structured-output','tool-calling','inference','latency','throughput','observability','tracing']),
  course('agent-systems','AI 에이전트 시스템','도구 사용형 자동화를 설계하려는 개발자','도구 호출부터 상태·메모리·오케스트레이션·안전 제어까지 다룬다.',['tool-calling','ai-agent','agent-loop','planning','state-management','agent-memory','workflow-orchestration','webhook','mcp','human-in-the-loop','multi-agent-system','prompt-injection','guardrail','observability']),
  course('responsible-ai','안전하고 신뢰할 수 있는 AI','AI 품질·보안·정책을 담당하는 학습자','평가와 관측성에서 안전·개인정보·거버넌스까지 연결한다.',['evaluation','benchmark','metric','accuracy','precision-recall','llm-as-a-judge','observability','hallucination','prompt-injection','jailbreak','guardrail','content-moderation','bias-fairness','privacy','ai-governance']),
  course('multimodal-ai','멀티모달 AI','이미지·음성·텍스트 모델을 함께 이해하려는 학습자','멀티모달 표현과 주요 생성·인식 기술의 관계를 설명한다.',['multimodal-model','embedding','multimodal-embedding','vision-language-model','ocr','image-generation','diffusion-model','speech-recognition','text-to-speech','evaluation','model-license'])
];
