import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const definitions = [
  {
    id: 'ai-mathematics-statistics', title: 'AI를 위한 수학·통계', level: 'intermediate', prerequisiteCourses: ['ai-foundations'],
    audience: 'AI 모델의 수식과 평가 지표를 원리부터 이해하려는 학습자',
    description: '선형대수·확률·통계·정보이론·미분·최적화를 AI 모델 이해 순서에 맞춰 연결한 중급 과정이다.',
    refs: 'scalar,vector,vector-space,basis-vector,vector-norm,dot-product,orthogonality,vector-projection,matrix,matrix-transpose,linear-transformation,eigenvalue-eigenvector,eigendecomposition,tensor,probability,probability-distribution,joint-probability-distribution,conditional-probability,marginal-probability,prior-probability,bayes-theorem,posterior-probability,expected-value,variance,covariance,correlation,law-of-large-numbers,central-limit-theorem,likelihood,maximum-likelihood-estimation,confidence-interval,hypothesis-testing,entropy,joint-entropy,conditional-entropy,mutual-information,information-gain,cross-entropy,kullback-leibler-divergence,jensen-shannon-divergence,data-processing-inequality,derivative,chain-rule,gradient,jacobian-matrix,multivariable-calculus,automatic-differentiation,objective-function,convex-function,convex-optimization',
  },
  {
    id: 'neural-model-architectures', title: '현대 신경망과 모델 아키텍처', level: 'intermediate', prerequisiteCourses: ['ai-foundations', 'ai-mathematics-statistics'],
    audience: '신경망의 계산 구조와 주요 아키텍처 계보를 체계적으로 익히려는 학습자',
    description: '뉴런과 계산 그래프에서 합성곱·순환·그래프·생성 모델까지 신경망 구조의 발전을 연결한 중급 과정이다.',
    refs: 'neuron,neural-network,weight,bias,layer,input-layer,hidden-layer,output-layer,linear-layer,dense-layer,activation-function,forward-pass,computational-graph,loss-function,backpropagation,parameter-initialization,network-depth,network-width,vanishing-gradient,exploding-gradient,gradient-clipping,gradient-norm,batch-normalization,group-normalization,instance-normalization,dropout,weight-decay,residual-network,convolutional-neural-network,receptive-field,recurrent-neural-network,hidden-state,long-short-term-memory,gated-recurrent-unit,autoencoder,variational-autoencoder,generative-adversarial-network,energy-based-model,diffusion-model,siamese-network,metric-learning,graph-neural-network,graph-convolutional-network,graph-attention-network,memory-network,neural-turing-machine,neural-ordinary-differential-equation,spiking-neural-network,transformer,mechanistic-interpretability',
  },
  {
    id: 'transformer-architecture', title: '트랜스포머 아키텍처', level: 'advanced', prerequisiteCourses: ['neural-model-architectures', 'llm-internals'],
    audience: '트랜스포머 블록과 대표 언어 모델 계열을 구조 수준에서 이해하려는 학습자',
    description: '임베딩·어텐션·정규화·인코더와 디코더를 거쳐 대표 트랜스포머 아키텍처를 연결한 고급 과정이다.',
    refs: 'transformer,token-embedding-layer,segment-embedding,positional-encoding,sinusoidal-position-encoding,learned-position-embedding,absolute-position-encoding,position-id,attention,query-key-value,additive-attention,dot-product-attention,scaled-dot-product-attention,attention-score,attention-matrix,attention-head,multi-head-attention,attention-mask,padding-mask,causal-mask,encoder,decoder,encoder-decoder,cross-attention,encoder-decoder-attention,feed-forward-network,residual-connection,layer-normalization,pre-normalization,post-normalization,normalization-placement,transformer-block,output-projection,language-modeling-head,encoder-only-transformer,decoder-only-model,sequence-to-sequence-transformer,bidirectional-attention,prefix-language-model,bert-architecture,gpt-architecture,t5-architecture,bart-architecture,xlnet-architecture,conformer-architecture,vision-transformer,geglu,swiglu,rms-normalization',
  },
  {
    id: 'efficient-long-context-transformers', title: '효율적·장문맥 트랜스포머', level: 'professional', prerequisiteCourses: ['transformer-architecture', 'llm-internals'],
    audience: '장문맥과 추론 효율화 기법을 설계·비교하려는 전문 학습자',
    description: '희소·선형·메모리 효율 어텐션에서 위치 확장과 장문맥 모델 계보까지 연결한 전문 과정이다.',
    refs: 'attention-complexity,local-attention,global-attention,sliding-window-attention,block-sparse-attention,sparse-attention,sparse-transformer,linear-attention,low-rank-attention,kernelized-attention,memory-efficient-attention,flash-attention,fused-transformer-kernel,chunked-attention,multi-query-attention,grouped-query-attention,key-value-compression,key-value-projection,paged-attention,attention-sink,head-pruning,layer-dropping,early-exit-transformer,adaptive-computation-time-transformer,mixture-of-depths,switch-transformer,long-context-transformer,context-length-extension,length-extrapolation,position-interpolation,relative-position-encoding,rotary-position-embedding,alibi-position-bias,ntk-aware-scaling,yarn-scaling,transformer-xl,recurrent-memory-transformer,longformer,bigbird,performer,reformer,memory-augmented-transformer,retrieval-transformer,hierarchical-transformer,graph-transformer,universal-transformer,state-space-transformer-hybrid,diffusion-transformer,speculative-transformer-block',
  },
  {
    id: 'ai-serving-systems', title: 'AI 시스템·하드웨어·서빙', level: 'professional', prerequisiteCourses: ['llm-internals', 'api-development'],
    audience: '모델 추론 인프라의 성능·용량·신뢰성을 설계하려는 엔지니어',
    description: 'AI 가속기와 메모리 계층에서 컴파일·양자화·KV 캐시·배칭·서빙 운영까지 연결한 전문 과정이다.',
    refs: 'inference,ai-accelerator,graphics-processing-unit,tensor-processing-unit,neural-processing-unit,high-bandwidth-memory,accelerator-memory-hierarchy,accelerator-memory,memory-bandwidth,accelerator-interconnect,nvlink,infiniband,cuda,rocm,compute-cluster,ai-datacenter,roofline-model,compute-bound-workload,memory-bound-workload,graph-compilation,ahead-of-time-compilation,operator-fusion,kernel-fusion,xla-compiler,onnx-runtime,tensorrt-llm,cpu-inference,gpu-inference,tpu-inference,npu-inference,quantization,post-training-quantization,weight-only-quantization,activation-quantization,int8-inference,int4-inference,fp8-inference,kv-cache,prefill-phase,decode-phase,continuous-batching,request-scheduler,time-to-first-token,streaming-generation,service-level-objective,inference-tail-latency-debugging,model-replica,multi-model-serving,model-gateway,edge-inference',
  },
  {
    id: 'model-service-ecosystem', title: '모델·서비스 생태계', level: 'intermediate', prerequisiteCourses: ['ai-foundations'],
    audience: '모델의 라이선스·배포·버전·운영 생태계를 이해하려는 학습자',
    description: '모델 개방성과 라이선스에서 허브·아티팩트·버전 수명주기·MLOps까지 연결한 중급 과정이다.',
    refs: 'model,model-license,open-source-model,open-weight-model,source-available-model,open-source-ai-definition,research-only-license,commercial-use-restriction,software-data-model-license,permissive-license,copyleft-license,attribution-requirement,license-compatibility,responsible-ai-license,derivative-model,model-hub,model-repository,model-catalog,model-search,model-discovery,model-collection,model-weights,model-artifact-format,model-package,model-metadata,model-card,model-version,model-release,model-update,model-registry,model-lineage,model-evaluation-report,model-deployment,model-rollback,model-retirement,reproducible-model-build,dataset-hub,dataset-library,dataset-terms-of-use,dataset-license,artifact-registry,package-registry,data-version-control,feature-store,experiment-tracking,experiment-dashboard,model-monitoring-platform,mlflow,mlops,llmops',
  },
  {
    id: 'production-ai-api-systems', title: '프로덕션 AI API 시스템', level: 'advanced', prerequisiteCourses: ['api-development'],
    audience: '신뢰할 수 있는 AI API 클라이언트와 통합 계층을 구현하려는 개발자',
    description: '웹 전송 규약과 API 계약에서 스트리밍·멀티모달·도구 호출·응답 검증까지 연결한 고급 과정이다.',
    refs: 'uri,url,domain-name-system,https,transport-layer-security,http-method,http-header,http-message-body,http-status-code,http-response,content-type,mime-type,serialization,deserialization,request-response-pattern,api-endpoint,path-parameter,query-parameter,stateless-api,stateful-api,api-client,client-library,synchronous-client,asynchronous-client,synchronous-api-request,asynchronous-api-job,batch-api,realtime-api,server-sent-events,streaming-response-contract,stream-resume-protocol,server-sent-event-recovery,chat-api,completion-api,unified-response-api,embedding-api,image-generation-api,audio-api,file-upload-api,moderation-api,function-calling,tool-definition,tool-argument,tool-choice,tool-result,tool-error,parallel-tool-call,grammar-constrained-generation,typed-response,response-validation',
  },
  {
    id: 'data-training-pipelines', title: '데이터·학습 파이프라인', level: 'advanced', prerequisiteCourses: ['ai-foundations', 'model-training'],
    audience: '학습 데이터와 분산 사전학습 파이프라인을 설계하려는 엔지니어',
    description: '데이터 분할·품질·출처·혼합에서 학습 목표·패킹·체크포인트·분산 병렬화까지 연결한 고급 과정이다.',
    refs: 'dataset,label,feature,target-variable,data-distribution,data-preprocessing,train-validation-test-split,validation-set,test-set,data-leakage,out-of-distribution-data,distribution-shift,dataset-deduplication,training-data-filtering,training-data-formatting,data-documentation,training-data-consent,training-data-copyright,training-data-provenance,training-corpus,web-scale-training-data,synthetic-data,data-augmentation,data-mixture,data-curriculum,instruction-dataset,instruction-mixture,sft-data-mixture,document-packing,sequence-packing,causal-language-modeling-objective,masked-language-modeling-objective,denoising-objective,span-corruption,contrastive-objective,multi-task-objective,reconstruction-loss,auxiliary-loss,pretraining-pipeline,continued-pretraining,checkpoint,data-parallelism,model-parallelism,tensor-parallelism,pipeline-parallelism,expert-parallelism,all-reduce,fully-sharded-data-parallel,zero-redundancy-optimizer,training-reproducibility',
  },
].map((definition) => ({ ...definition, refs: definition.refs.split(',') }));

const articleIds = new Set((await readdir('content-model/articles'))
  .filter((file) => file.endsWith('.article.json'))
  .map((file) => file.replace(/\.article\.json$/, '')));
const existingCourseIds = new Set((await readdir('content-model/paths'))
  .filter((file) => file.endsWith('.path.json'))
  .map((file) => file.replace(/\.path\.json$/, '')));
const plannedIds = new Set(definitions.map((course) => course.id));

for (const course of definitions) {
  if (new Set(course.refs).size !== course.refs.length) throw new Error(`${course.id}: 경로 안에 중복 문서가 있다`);
  const missing = course.refs.filter((ref) => !articleIds.has(ref));
  if (missing.length) throw new Error(`${course.id}: 없는 문서 ${missing.join(', ')}`);
  for (const prerequisite of course.prerequisiteCourses) {
    if (!existingCourseIds.has(prerequisite) && !plannedIds.has(prerequisite)) throw new Error(`${course.id}: 없는 선수 코스 ${prerequisite}`);
  }
  const requiredUntil = Math.ceil(course.refs.length * 0.7);
  const value = {
    id: course.id,
    title: course.title,
    audience: course.audience,
    description: course.description,
    level: course.level,
    prerequisiteCourses: course.prerequisiteCourses,
    steps: course.refs.map((ref, index) => ({
      ref,
      required: index < requiredUntil,
      reason: index === 0
        ? '분야의 공통 언어와 출발점을 먼저 확립한다.'
        : '앞 단계의 개념을 확장해 다음 주제를 이해하기 위한 연결 고리를 만든다.',
    })),
  };
  await mkdir('content-model/paths', { recursive: true });
  await writeFile(path.join('content-model/paths', `${course.id}.path.json`), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

console.log(`P0 course expansion: ${definitions.length} paths and ${definitions.reduce((sum, course) => sum + course.refs.length, 0)} ordered steps written`);

