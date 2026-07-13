const paper = (title, url) => ({ title, url, type: 'paper' });
const standard = (title, url) => ({ title, url, type: 'standard' });
const documentation = (title, url) => ({ title, url, type: 'documentation' });
const book = (title, url) => ({ title, url, type: 'book' });

const groups = [
  [['agent-self-correction'], paper('Self-Refine: Iterative Refinement with Self-Feedback', 'https://arxiv.org/abs/2303.17651')],
  [['agent-termination-condition'], paper('ReAct: Synergizing Reasoning and Acting in Language Models', 'https://arxiv.org/abs/2210.03629')],
  [['agent-tool', 'tool-registry', 'tool-discovery', 'tool-selection', 'tool-invocation', 'tool-result-handling'], standard('Model Context Protocol Specification', 'https://modelcontextprotocol.io/specification/2025-06-18')],
  [['tool-permission', 'agent-sandbox'], standard('NIST SP 800-190: Application Container Security', 'https://csrc.nist.gov/pubs/sp/800/190/final')],

  [['transmission-control-protocol'], standard('RFC 9293: Transmission Control Protocol', 'https://www.rfc-editor.org/rfc/rfc9293.html')],
  [['completion-api', 'chat-api', 'unified-response-api', 'embedding-api', 'image-generation-api', 'audio-api', 'moderation-api', 'batch-api'], standard('OpenAPI Specification', 'https://spec.openapis.org/oas/latest.html')],
  [['realtime-api'], standard('RFC 6455: The WebSocket Protocol', 'https://www.rfc-editor.org/rfc/rfc6455.html')],

  [['software-data-model-license', 'license-compatibility', 'attribution-requirement', 'derivative-model'], standard('SPDX Specification 3.0.1', 'https://spdx.github.io/spdx-spec/v3.0.1/')],
  [['dataset-terms-of-use', 'dataset-hub'], documentation('Hugging Face Dataset Cards', 'https://huggingface.co/docs/hub/datasets-cards')],
  [['model-repository', 'artifact-registry', 'package-registry'], standard('Open Container Initiative Distribution Specification', 'https://github.com/opencontainers/distribution-spec')],
  [['model-discovery'], documentation('Hugging Face Model Cards', 'https://huggingface.co/docs/hub/model-cards')],

  [['leaderboard', 'benchmark-suite', 'task-benchmark', 'capability-benchmark', 'safety-benchmark'], paper('Holistic Evaluation of Language Models', 'https://arxiv.org/abs/2211.09110')],
  [['mmlu'], paper('Measuring Massive Multitask Language Understanding', 'https://arxiv.org/abs/2009.03300')],
  [['helm-benchmark'], paper('Holistic Evaluation of Language Models', 'https://arxiv.org/abs/2211.09110')],
  [['big-bench'], paper('Beyond the Imitation Game Benchmark', 'https://arxiv.org/abs/2206.04615')],
  [['gpqa'], paper('GPQA: A Graduate-Level Google-Proof Q&A Benchmark', 'https://arxiv.org/abs/2311.12022')],
  [['humaneval'], paper('Evaluating Large Language Models Trained on Code', 'https://arxiv.org/abs/2107.03374')],

  [['meta-learning'], paper('Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks', 'https://arxiv.org/abs/1703.03400')],
  [['few-shot-learning'], paper('Prototypical Networks for Few-shot Learning', 'https://arxiv.org/abs/1703.05175')],
  [['zero-shot-learning'], paper('Zero-Shot Learning — A Comprehensive Evaluation of the Good, the Bad and the Ugly', 'https://arxiv.org/abs/1707.00600')],
  [['curriculum-learning'], paper('Curriculum Learning: A Survey', 'https://arxiv.org/abs/2101.10382')],
  [['continual-learning'], paper('Continual Lifelong Learning with Neural Networks: A Review', 'https://arxiv.org/abs/1802.07569')],
  [['validation-set', 'test-set', 'feature', 'label', 'target-variable'], documentation('scikit-learn Model Selection and Evaluation', 'https://scikit-learn.org/stable/model_selection.html')],

  [['inference-server', 'online-inference', 'batch-inference', 'inference-endpoint', 'multi-model-serving'], documentation('NVIDIA Triton Inference Server Documentation', 'https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/')],
  [['request-scheduler', 'model-replica'], documentation('NVIDIA Triton Inference Server Documentation', 'https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/')],
  [['inference-autoscaling'], documentation('Kubernetes Horizontal Pod Autoscaling', 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/')],
  [['inference-load-balancing', 'model-gateway'], documentation('Envoy Proxy Architecture Overview', 'https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/arch_overview')],

  [['wordpiece'], paper('BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 'https://arxiv.org/abs/1810.04805')],
  [['sentencepiece'], paper('SentencePiece: A Simple and Language Independent Subword Tokenizer and Detokenizer', 'https://aclanthology.org/D18-2012/')],
  [['unigram-language-model-tokenizer', 'subword-token'], paper('Subword Regularization: Improving Neural Network Translation Models with Multiple Subword Candidates', 'https://aclanthology.org/P18-1007/')],
  [['character-tokenization', 'byte-level-tokenization', 'out-of-vocabulary-token'], paper('ByT5: Towards a Token-Free Future with Pre-trained Byte-to-Byte Models', 'https://arxiv.org/abs/2105.13626')],
  [['special-token', 'beginning-end-token', 'padding-token'], documentation('Hugging Face Tokenizers Documentation', 'https://huggingface.co/docs/tokenizers/index')],

  [['orthogonality', 'vector-projection'], book('Mathematics for Machine Learning', 'https://mml-book.github.io/')],
  [['partial-derivative', 'jacobian-matrix', 'hessian-matrix', 'chain-rule', 'taylor-expansion', 'multivariable-calculus', 'directional-derivative'], book('The Matrix Cookbook', 'https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf')],
  [['convex-optimization'], book('Convex Optimization', 'https://web.stanford.edu/~boyd/cvxbook/')],

  [['spatial-reasoning', 'pixel-representation'], paper('An Image is Worth 16x16 Words', 'https://arxiv.org/abs/2010.11929')],
  [['audio-model', 'speech-to-text', 'speech-translation'], paper('Robust Speech Recognition via Large-Scale Weak Supervision', 'https://arxiv.org/abs/2212.04356')],
  [['speaker-diarization', 'speaker-recognition', 'audio-embedding'], paper('pyannote.audio: Neural Building Blocks for Speaker Diarization', 'https://arxiv.org/abs/1911.01255')],
  [['voice-activity-detection'], documentation('Torchaudio Voice Activity Detection', 'https://docs.pytorch.org/audio/stable/generated/torchaudio.functional.vad.html')],
  [['spectrogram'], documentation('librosa Short-Time Fourier Transform', 'https://librosa.org/doc/latest/generated/librosa.stft.html')],

  [['multilayer-perceptron', 'convolutional-neural-network', 'recurrent-neural-network', 'long-short-term-memory'], book('Deep Learning', 'https://www.deeplearningbook.org/')],
  [['gated-recurrent-unit'], paper('Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation', 'https://aclanthology.org/D14-1179/')],
  [['residual-network'], paper('Deep Residual Learning for Image Recognition', 'https://arxiv.org/abs/1512.03385')],
  [['densenet'], paper('Densely Connected Convolutional Networks', 'https://arxiv.org/abs/1608.06993')],
  [['u-net'], paper('U-Net: Convolutional Networks for Biomedical Image Segmentation', 'https://arxiv.org/abs/1505.04597')],
  [['generative-adversarial-network'], paper('Generative Adversarial Networks', 'https://arxiv.org/abs/1406.2661')],
  [['variational-autoencoder'], paper('Auto-Encoding Variational Bayes', 'https://arxiv.org/abs/1312.6114')],

  [['inverted-index'], book('Introduction to Information Retrieval', 'https://nlp.stanford.edu/IR-book/')],
  [['hierarchical-navigable-small-world'], paper('Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs', 'https://arxiv.org/abs/1603.09320')],
  [['inverted-file-index', 'product-quantization'], paper('Product Quantization for Nearest Neighbor Search', 'https://inria.hal.science/inria-00514462')],
  [['locality-sensitive-hashing'], paper('Practical and Optimal LSH for Angular Distance', 'https://arxiv.org/abs/1411.3787')],
  [['flat-vector-index', 'vector-index'], documentation('Faiss Indexes', 'https://github.com/facebookresearch/faiss/wiki/Faiss-indexes')],
  [['diskann'], paper('FreshDiskANN: A Fast and Accurate Graph-Based ANN Index for Streaming Similarity Search', 'https://arxiv.org/abs/2105.09613')],
  [['scann'], paper('Accelerating Large-Scale Inference with Anisotropic Vector Quantization', 'https://arxiv.org/abs/1908.10396')],
  [['faiss'], paper('Billion-scale similarity search with GPUs', 'https://arxiv.org/abs/1702.08734')],

  [['ai-misuse', 'dual-use-ai', 'catastrophic-ai-risk', 'capability-control'], standard('NIST AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework')],
  [['deceptive-alignment'], paper('Risks from Learned Optimization in Advanced Machine Learning Systems', 'https://arxiv.org/abs/1906.01820')],
  [['goal-misgeneralization'], paper('Goal Misgeneralization in Deep Reinforcement Learning', 'https://arxiv.org/abs/2105.14111')],
  [['specification-gaming'], paper('Concrete Problems in AI Safety', 'https://arxiv.org/abs/1606.06565')],
  [['reward-tampering'], paper('Reward Tampering Problems and Solutions in Reinforcement Learning', 'https://arxiv.org/abs/1908.04734')],
  [['corrigibility'], paper('Corrigibility', 'https://arxiv.org/abs/1507.01986')],
  [['scalable-oversight'], paper('AI Safety via Debate', 'https://arxiv.org/abs/1805.00899')],

  [['training-data-provenance'], standard('W3C PROV-O: The PROV Ontology', 'https://www.w3.org/TR/prov-o/')],
  [['causal-language-modeling-objective'], paper('Language Models are Unsupervised Multitask Learners', 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf')],
  [['masked-language-modeling-objective', 'next-sentence-prediction'], paper('BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 'https://arxiv.org/abs/1810.04805')],
  [['denoising-objective'], paper('BART: Denoising Sequence-to-Sequence Pre-training for Natural Language Generation', 'https://arxiv.org/abs/1910.13461')],
  [['span-corruption', 'multi-task-objective'], paper('Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer', 'https://jmlr.org/papers/v21/20-074.html')],
  [['contrastive-objective'], paper('A Simple Framework for Contrastive Learning of Visual Representations', 'https://arxiv.org/abs/2002.05709')],
  [['sentence-order-prediction'], paper('ALBERT: A Lite BERT for Self-supervised Learning of Language Representations', 'https://arxiv.org/abs/1909.11942')],
  [['auxiliary-loss'], paper('Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity', 'https://arxiv.org/abs/2101.03961')],

  [['bidirectional-attention'], paper('BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', 'https://arxiv.org/abs/1810.04805')],
  [['encoder-decoder-attention', 'attention-score', 'attention-matrix', 'attention-head'], paper('Attention Is All You Need', 'https://arxiv.org/abs/1706.03762')],
  [['pre-normalization', 'post-normalization'], paper('On Layer Normalization in the Transformer Architecture', 'https://arxiv.org/abs/2002.04745')],
  [['rms-normalization'], paper('Root Mean Square Layer Normalization', 'https://arxiv.org/abs/1910.07467')],
  [['swiglu', 'geglu'], paper('GLU Variants Improve Transformer', 'https://arxiv.org/abs/2002.05202')],
];

export const topicPrimarySources = {};
for (const [ids, source] of groups) {
  for (const id of ids) {
    topicPrimarySources[id] ??= [];
    topicPrimarySources[id].push(source);
  }
}
