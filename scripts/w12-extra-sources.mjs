const paper = (title, url) => ({ title, url, type: 'paper' });
const standard = (title, url) => ({ title, url, type: 'standard' });
const documentation = (title, url) => ({ title, url, type: 'documentation' });
const book = (title, url) => ({ title, url, type: 'book' });

const groups = [
  [['computer-use-agent', 'browser-use-agent'], paper('OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments', 'https://arxiv.org/abs/2404.07972')],
  [['code-execution-tool', 'api-action-tool', 'tool-side-effect'], paper('ToolEmu: Identifying the Risks of LM Agents with an LM-Emulated Sandbox', 'https://arxiv.org/abs/2309.15817')],
  [['human-approval-gate'], standard('NIST AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework')],
  [['working-memory', 'short-term-agent-memory', 'long-term-agent-memory'], paper('MemGPT: Towards LLMs as Operating Systems', 'https://arxiv.org/abs/2310.08560')],
  [['episodic-agent-memory'], paper('Generative Agents: Interactive Simulacra of Human Behavior', 'https://arxiv.org/abs/2304.03442')],

  [['asynchronous-api-job'], standard('RFC 7240: Prefer Header for HTTP', 'https://www.rfc-editor.org/rfc/rfc7240.html')],
  [['synchronous-api-request', 'request-response-pattern', 'stateless-api', 'stateful-api'], standard('RFC 9110: HTTP Semantics', 'https://www.rfc-editor.org/rfc/rfc9110.html')],
  [['api-pagination'], standard('RFC 8288: Web Linking', 'https://www.rfc-editor.org/rfc/rfc8288.html')],
  [['file-upload-api'], standard('RFC 7578: multipart/form-data', 'https://www.rfc-editor.org/rfc/rfc7578.html')],
  [['api-versioning'], standard('OpenAPI Specification', 'https://spec.openapis.org/oas/latest.html')],
  [['api-deprecation'], standard('RFC 8594: The Sunset HTTP Header Field', 'https://www.rfc-editor.org/rfc/rfc8594.html')],
  [['server-sent-events'], standard('RFC 8895: Incremental Updates Using Server-Sent Events', 'https://www.rfc-editor.org/rfc/rfc8895.html')],

  [['model-search', 'model-metadata', 'model-collection', 'interactive-model-demo'], paper('Model Cards for Model Reporting', 'https://arxiv.org/abs/1810.03993')],
  [['benchmark-registry'], paper('Holistic Evaluation of Language Models', 'https://arxiv.org/abs/2211.09110')],
  [['graphics-processing-unit'], documentation('CUDA C++ Programming Documentation', 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/')],
  [['tensor-processing-unit'], paper('In-Datacenter Performance Analysis of a Tensor Processing Unit', 'https://arxiv.org/abs/1704.04760')],
  [['neural-processing-unit', 'ai-accelerator'], paper('GPTPU: Accelerating Applications using Edge Tensor Processing Units', 'https://arxiv.org/abs/2107.05473')],
  [['cloud-ai-service'], standard('NIST SP 800-145: The NIST Definition of Cloud Computing', 'https://csrc.nist.gov/pubs/sp/800/145/final')],

  [['swe-bench'], paper('SWE-bench: Can Language Models Resolve Real-World GitHub Issues?', 'https://arxiv.org/abs/2310.06770')],
  [['mteb'], paper('MTEB: Massive Text Embedding Benchmark', 'https://arxiv.org/abs/2210.07316')],
  [['beir-benchmark'], paper('BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models', 'https://arxiv.org/abs/2104.08663')],
  [['imagenet'], paper('ImageNet Large Scale Visual Recognition Challenge', 'https://arxiv.org/abs/1409.0575')],
  [['mlperf'], paper('MLPerf Inference Benchmark', 'https://arxiv.org/abs/1911.02549')],
  [['benchmark-saturation', 'dynamic-benchmark'], paper('Dynabench: Rethinking Benchmarking in NLP', 'https://arxiv.org/abs/2104.14337')],
  [['benchmark-validity', 'human-evaluation', 'evaluation-rubric'], paper('Holistic Evaluation of Language Models', 'https://arxiv.org/abs/2211.09110')],

  [['model-capacity', 'hypothesis', 'hypothesis-space', 'inductive-bias', 'generalization'], book('Understanding Machine Learning: From Theory to Algorithms', 'https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/understanding-machine-learning-theory-algorithms.pdf')],
  [['train-validation-test-split'], documentation('scikit-learn Model Selection Documentation', 'https://scikit-learn.org/stable/model_selection.html')],
  [['data-distribution'], book('Deep Learning: Machine Learning Basics', 'https://www.deeplearningbook.org/contents/ml.html')],
  [['data-preprocessing', 'feature-engineering'], documentation('scikit-learn Preprocessing Documentation', 'https://scikit-learn.org/stable/modules/preprocessing.html')],
  [['data-leakage'], documentation('scikit-learn Common Pitfalls', 'https://scikit-learn.org/stable/common_pitfalls.html')],

  [['streaming-generation', 'request-queue', 'continuous-batching'], paper('Efficient Memory Management for Large Language Model Serving with PagedAttention', 'https://arxiv.org/abs/2309.06180')],
  [['time-to-first-token', 'inter-token-latency', 'prefill-phase', 'decode-phase'], paper('DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving', 'https://arxiv.org/abs/2401.09670')],
  [['admission-control'], paper('Orca: A Distributed Serving System for Transformer-Based Generative Models', 'https://arxiv.org/abs/2206.02658')],
  [['serverless-inference'], documentation('Knative Serving Documentation', 'https://knative.dev/docs/serving/')],
  [['edge-inference'], documentation('ONNX Runtime Mobile Documentation', 'https://onnxruntime.ai/docs/tutorials/mobile/')],

  [['neural-scaling-law', 'parameter-count', 'model-size', 'training-compute'], paper('Scaling Laws for Neural Language Models', 'https://arxiv.org/abs/2001.08361')],
  [['compute-optimal-training'], paper('Training Compute-Optimal Large Language Models', 'https://arxiv.org/abs/2203.15556')],
  [['inference-compute'], paper('Efficient Memory Management for Large Language Model Serving with PagedAttention', 'https://arxiv.org/abs/2309.06180')],
  [['dense-language-model', 'sparse-language-model', 'expert-routing', 'expert-capacity-factor'], paper('Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity', 'https://arxiv.org/abs/2101.03961')],

  [['convex-function', 'objective-function', 'constrained-optimization', 'lagrange-multiplier', 'line-search', 'newtons-method', 'quasi-newton-method', 'saddle-point', 'local-global-optimum'], book('Convex Optimization', 'https://web.stanford.edu/~boyd/cvxbook/')],
  [['random-variable'], book('Deep Learning: Probability and Information Theory', 'https://www.deeplearningbook.org/contents/prob.html')],

  [['mel-spectrogram'], documentation('librosa Mel-scaled Spectrogram Reference', 'https://librosa.org/doc/latest/generated/librosa.feature.melspectrogram.html')],
  [['neural-vocoder'], paper('HiFi-GAN: Generative Adversarial Networks for Efficient and High Fidelity Speech Synthesis', 'https://arxiv.org/abs/2010.05646')],
  [['text-audio-model'], paper('AudioGen: Textually Guided Audio Generation', 'https://arxiv.org/abs/2209.15352')],
  [['audio-captioning'], paper('CLAP: Learning Audio Concepts From Natural Language Supervision', 'https://arxiv.org/abs/2206.04769')],
  [['speech-language-model'], paper('AudioLM: A Language Modeling Approach to Audio Generation', 'https://arxiv.org/abs/2209.03143')],
  [['video-understanding', 'video-classification', 'temporal-modeling'], paper('Is Space-Time Attention All You Need for Video Understanding?', 'https://arxiv.org/abs/2102.05095')],
  [['video-generation'], paper('Video Diffusion Models', 'https://arxiv.org/abs/2204.03458')],
  [['action-recognition'], paper('Quo Vadis, Action Recognition? A New Model and the Kinetics Dataset', 'https://arxiv.org/abs/1705.07750')],

  [['energy-based-model'], paper('How to Train Your Energy-Based Models', 'https://arxiv.org/abs/2101.03288')],
  [['hopfield-network'], paper('Hopfield Networks is All You Need', 'https://arxiv.org/abs/2008.02217')],
  [['graph-neural-network'], paper('A Comprehensive Survey on Graph Neural Networks', 'https://arxiv.org/abs/1901.00596')],
  [['graph-convolutional-network'], paper('Semi-Supervised Classification with Graph Convolutional Networks', 'https://arxiv.org/abs/1609.02907')],
  [['graph-attention-network'], paper('Graph Attention Networks', 'https://arxiv.org/abs/1710.10903')],
  [['siamese-network'], paper('FaceNet: A Unified Embedding for Face Recognition and Clustering', 'https://arxiv.org/abs/1503.03832')],
  [['capsule-network'], paper('Dynamic Routing Between Capsules', 'https://arxiv.org/abs/1710.09829')],
  [['neural-ordinary-differential-equation'], paper('Neural Ordinary Differential Equations', 'https://arxiv.org/abs/1806.07366')],
  [['spiking-neural-network'], paper('Spiking Neural Networks: A Survey', 'https://arxiv.org/abs/2010.06979')],
  [['memory-network'], paper('Memory Networks', 'https://arxiv.org/abs/1410.3916')],

  [['distance-metric-selection', 'index-building', 'incremental-index-update', 'index-sharding', 'index-replication', 'metadata-filtering'], paper('Billion-scale Similarity Search with GPUs', 'https://arxiv.org/abs/1702.08734')],
  [['recall-latency-tradeoff'], paper('ANN-Benchmarks: A Benchmarking Tool for Approximate Nearest Neighbor Algorithms', 'https://arxiv.org/abs/1807.05614')],
  [['keyword-search', 'bm25', 'lexical-retrieval'], book('Introduction to Information Retrieval', 'https://nlp.stanford.edu/IR-book/')],

  [['ai-control-problem'], paper('AI Control: Improving Safety Despite Intentional Subversion', 'https://arxiv.org/abs/2312.06942')],
  [['emergent-misalignment'], paper('Emergent Misalignment: Narrow Finetuning Can Produce Broadly Misaligned LLMs', 'https://arxiv.org/abs/2502.17424')],
  [['alignment-tax'], paper('Constitutional AI: Harmlessness from AI Feedback', 'https://arxiv.org/abs/2212.08073')],
  [['personally-identifiable-information', 'anonymization', 'pseudonymization', 'data-minimization', 'data-retention'], standard('NIST Privacy Framework', 'https://www.nist.gov/privacy-framework')],
  [['differential-privacy'], standard('NIST SP 800-226: Guidelines for Evaluating Differential Privacy Guarantees', 'https://csrc.nist.gov/pubs/sp/800/226/final')],
  [['right-to-deletion'], standard('Regulation (EU) 2016/679', 'https://eur-lex.europa.eu/eli/reg/2016/679/oj')],

  [['distillation-loss'], paper('Distilling the Knowledge in a Neural Network', 'https://arxiv.org/abs/1503.02531')],
  [['preference-loss'], paper('Direct Preference Optimization: Your Language Model is Secretly a Reward Model', 'https://arxiv.org/abs/2305.18290')],
  [['policy-objective', 'value-function-loss'], paper('Proximal Policy Optimization Algorithms', 'https://arxiv.org/abs/1707.06347')],
  [['reconstruction-loss'], paper('Auto-Encoding Variational Bayes', 'https://arxiv.org/abs/1312.6114')],
  [['diffusion-training-objective'], paper('Denoising Diffusion Probabilistic Models', 'https://arxiv.org/abs/2006.11239')],
  [['full-parameter-fine-tuning'], paper('Universal Language Model Fine-tuning for Text Classification', 'https://arxiv.org/abs/1801.06146')],
  [['domain-adaptation'], paper('A Survey on Transfer Learning', 'https://ieeexplore.ieee.org/document/5288526')],
  [['task-adaptation'], paper('An Embarrassingly Simple Approach to Multi-Sentence Reasoning', 'https://arxiv.org/abs/1811.01088')],
  [['continued-pretraining'], paper("Don't Stop Pretraining: Adapt Language Models to Domains and Tasks", 'https://arxiv.org/abs/2004.10964')],

  [['token-embedding-layer', 'output-projection', 'language-modeling-head', 'key-value-projection', 'transformer-block'], paper('Attention Is All You Need', 'https://arxiv.org/abs/1706.03762')],
  [['padding-mask', 'attention-mask'], documentation('PyTorch MultiheadAttention Reference', 'https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html')],
  [['normalization-placement'], paper('On Layer Normalization in the Transformer Architecture', 'https://arxiv.org/abs/2002.04745')],
  [['encoder-only-transformer'], paper('BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 'https://arxiv.org/abs/1810.04805')],
  [['prefix-language-model'], paper('UniLM: Unified Language Model Pre-training for Natural Language Understanding and Generation', 'https://arxiv.org/abs/1905.03197')],
];

export const topicPrimarySources = {};
for (const [ids, source] of groups) {
  for (const id of ids) {
    topicPrimarySources[id] ??= [];
    topicPrimarySources[id].push(source);
  }
}
