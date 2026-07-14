const paper = (title, url) => ({ title, url, type: 'paper' });
const standard = (title, url) => ({ title, url, type: 'standard' });
const documentation = (title, url) => ({ title, url, type: 'documentation' });
const book = (title, url) => ({ title, url, type: 'book' });

const groups = [
  // Agents
  [["reflection-loop"], paper("Reflexion: Language Agents with Verbal Reinforcement Learning", "https://arxiv.org/abs/2303.11366")],
  [["critic-agent"], paper("CRITIC: Large Language Models Can Self-Correct with Tool-Interactive Critiquing", "https://arxiv.org/abs/2305.11738")],
  [["verifier-agent"], paper("Training Verifiers to Solve Math Word Problems", "https://arxiv.org/abs/2110.14168")],
  [["agent-swarm", "agent-collaboration", "agent-coordination", "inter-agent-communication", "agent-delegation", "agent-role"], paper("AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation", "https://arxiv.org/abs/2308.08155")],
  [["multi-agent-consensus"], paper("Improving Factuality and Reasoning in Language Models through Multiagent Debate", "https://arxiv.org/abs/2305.14325")],

  // API contracts and authorization
  [["request-interceptor", "api-wrapper", "command-line-api-client"], documentation("MDN HTTP Reference", "https://developer.mozilla.org/en-US/docs/Web/HTTP")],
  [["serialization", "deserialization"], standard("The JavaScript Object Notation Data Interchange Format", "https://www.rfc-editor.org/rfc/rfc8259")],
  [["api-type-generation", "openapi-specification"], standard("OpenAPI Specification 3.1", "https://spec.openapis.org/oas/v3.1.0")],
  [["oauth"], standard("OAuth 2.0 Authorization Framework", "https://www.rfc-editor.org/rfc/rfc6749")],
  [["bearer-token"], standard("OAuth 2.0 Bearer Token Usage", "https://www.rfc-editor.org/rfc/rfc6750")],
  [["json-web-token"], standard("JSON Web Token", "https://www.rfc-editor.org/rfc/rfc7519")],

  // Ecosystem and MLOps
  [["data-version-control"], documentation("DVC Documentation", "https://dvc.org/doc")],
  [["ml-pipeline-orchestrator"], documentation("Apache Airflow Documentation", "https://airflow.apache.org/docs/")],
  [["interactive-notebook"], documentation("Jupyter Documentation", "https://docs.jupyter.org/en/latest/")],
  [["mlflow", "experiment-dashboard"], documentation("MLflow Tracking Documentation", "https://mlflow.org/docs/latest/ml/tracking/")],
  [["mlops", "llmops"], paper("Hidden Technical Debt in Machine Learning Systems", "https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems")],
  [["model-deployment", "containerized-model"], documentation("KServe Documentation", "https://kserve.github.io/website/docs/intro")],
  [["kubernetes-for-ai"], documentation("Kubernetes Documentation", "https://kubernetes.io/docs/home/")],

  // Evaluation
  [["judge-calibration"], paper("On Calibration of Modern Neural Networks", "https://arxiv.org/abs/1706.04599")],
  [["position-bias-in-judging", "verbosity-bias", "self-preference-bias"], paper("Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", "https://arxiv.org/abs/2306.05685")],
  [["judge-agreement", "judge-ensemble", "judge-meta-evaluation"], paper("Large Language Models are not Fair Evaluators", "https://arxiv.org/abs/2305.17926")],
  [["rag-evaluation"], paper("RAGAS: Automated Evaluation of Retrieval Augmented Generation", "https://arxiv.org/abs/2309.15217")],
  [["retrieval-evaluation"], book("Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/")],
  [["generation-evaluation"], paper("A Survey of Evaluation Metrics Used for NLG Systems", "https://arxiv.org/abs/2008.12009")],

  // Representation learning
  [["representation-learning", "latent-representation", "feature-learning"], book("Deep Learning: Representation Learning", "https://www.deeplearningbook.org/contents/representation.html")],
  [["manifold-learning", "dimensionality-reduction"], paper("Manifold Learning: What, How, and Why", "https://arxiv.org/abs/1806.11363")],
  [["disentangled-representation"], paper("Challenging Common Assumptions in the Unsupervised Learning of Disentangled Representations", "https://arxiv.org/abs/1811.12359")],
  [["metric-learning"], paper("A Tutorial on Deep Metric Learning", "https://arxiv.org/abs/1812.05944")],
  [["contrastive-learning"], paper("A Simple Framework for Contrastive Learning of Visual Representations", "https://arxiv.org/abs/2002.05709")],
  [["autoencoder"], paper("Auto-Encoding Variational Bayes", "https://arxiv.org/abs/1312.6114")],
  [["sparse-coding"], paper("Sparse Coding with an Overcomplete Basis Set", "https://www.nature.com/articles/381607a0")],

  // Compilation and accelerators
  [["graph-compilation", "ahead-of-time-compilation", "operator-fusion", "kernel-fusion", "inference-graph-optimization"], paper("The Deep Learning Compiler: A Comprehensive Survey", "https://arxiv.org/abs/2002.03794")],
  [["tensorrt-llm"], documentation("TensorRT-LLM Documentation", "https://nvidia.github.io/TensorRT-LLM/")],
  [["xla-compiler", "tpu-inference"], documentation("OpenXLA Documentation", "https://openxla.org/")],
  [["gpu-inference"], documentation("CUDA C++ Programming Documentation", "https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html")],
  [["npu-inference"], documentation("ONNX Runtime Execution Providers", "https://onnxruntime.ai/docs/execution-providers/")],

  // Context and memory
  [["demonstration-example"], paper("Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165")],
  [["context-length", "context-engineering", "conversation-context", "context-truncation"], paper("Lost in the Middle: How Language Models Use Long Contexts", "https://arxiv.org/abs/2307.03172")],
  [["sliding-context-window"], paper("Longformer: The Long-Document Transformer", "https://arxiv.org/abs/2004.05150")],
  [["memory-token", "recurrent-language-model-memory"], paper("Recurrent Memory Transformer", "https://arxiv.org/abs/2207.06881")],
  [["external-language-model-memory"], paper("Improving Language Models by Retrieving from Trillions of Tokens", "https://arxiv.org/abs/2112.04426")],
  [["context-caching"], documentation("vLLM Automatic Prefix Caching", "https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/")],

  // Information theory
  [["markov-chain"], book("MIT OpenCourseWare: Discrete Stochastic Processes", "https://ocw.mit.edu/courses/6-262-discrete-stochastic-processes-spring-2011/")],
  [["entropy", "cross-entropy", "kullback-leibler-divergence", "mutual-information", "conditional-entropy", "joint-entropy", "perplexity", "information-gain", "coding-theory"], book("Entropy and Information Theory", "https://ee.stanford.edu/~gray/it.html")],

  // Multimodal
  [["modality-gap", "modality-projection", "modality-adapter"], paper("Multimodal Machine Learning: A Survey and Taxonomy", "https://arxiv.org/abs/1705.09406")],
  [["q-former"], paper("BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models", "https://arxiv.org/abs/2301.12597")],
  [["perceiver-resampler"], paper("Flamingo: a Visual Language Model for Few-Shot Learning", "https://arxiv.org/abs/2204.14198")],
  [["multimodal-tokenizer", "image-token", "audio-token"], paper("Neural Discrete Representation Learning", "https://arxiv.org/abs/1711.00937")],
  [["latent-diffusion-model", "text-to-image-generation"], paper("High-Resolution Image Synthesis with Latent Diffusion Models", "https://arxiv.org/abs/2112.10752")],

  // Neural optimization
  [["mixed-precision-training"], paper("Mixed Precision Training", "https://arxiv.org/abs/1710.03740")],
  [["adaptive-gradient-method"], paper("Adam: A Method for Stochastic Optimization", "https://arxiv.org/abs/1412.6980")],
  [["dropout"], paper("Dropout: A Simple Way to Prevent Neural Networks from Overfitting", "https://jmlr.org/papers/v15/srivastava14a.html")],
  [["weight-decay"], paper("Decoupled Weight Decay Regularization", "https://arxiv.org/abs/1711.05101")],
  [["l1-regularization", "l2-regularization"], book("Deep Learning: Regularization for Deep Learning", "https://www.deeplearningbook.org/contents/regularization.html")],
  [["early-stopping"], book("Deep Learning: Guidelines for Methodology", "https://www.deeplearningbook.org/contents/guidelines.html")],
  [["batch-normalization"], paper("Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift", "https://arxiv.org/abs/1502.03167")],
  [["group-normalization"], paper("Group Normalization", "https://arxiv.org/abs/1803.08494")],
  [["instance-normalization"], paper("Instance Normalization: The Missing Ingredient for Fast Stylization", "https://arxiv.org/abs/1607.08022")],

  // RAG
  [["retrieval-context", "context-assembly"], paper("Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", "https://arxiv.org/abs/2005.11401")],
  [["context-compression-for-rag"], paper("RECOMP: Improving Retrieval-Augmented LMs with Compression and Selective Augmentation", "https://arxiv.org/abs/2310.04408")],
  [["citation-generation"], paper("ALCE: Enabling Large Language Models to Generate Text with Citations", "https://arxiv.org/abs/2305.14627")],
  [["grounded-generation"], paper("WebGPT: Browser-assisted question-answering with human feedback", "https://arxiv.org/abs/2112.09332")],
  [["query-routing"], paper("RouteLLM: Learning to Route LLMs with Preference Data", "https://arxiv.org/abs/2406.18665")],
  [["multi-hop-rag"], paper("Multi-Hop Dense Retrieval for Complex Open-Domain Question Answering", "https://arxiv.org/abs/2009.12756")],
  [["iterative-rag"], paper("IRCoT: Interleaving Retrieval with Chain-of-Thought Reasoning", "https://arxiv.org/abs/2212.10509")],
  [["corrective-rag"], paper("Corrective Retrieval Augmented Generation", "https://arxiv.org/abs/2401.15884")],
  [["self-rag"], paper("Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection", "https://arxiv.org/abs/2310.11511")],

  // Responsible AI and transparency
  [["bias-mitigation"], standard("NIST SP 1270: Identifying and Managing Bias in Artificial Intelligence", "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.1270.pdf")],
  [["explainable-ai", "ai-interpretability"], paper("A Survey of Methods for Explaining Black Box Models", "https://arxiv.org/abs/1802.01933")],
  [["model-transparency", "model-card"], paper("Model Cards for Model Reporting", "https://arxiv.org/abs/1810.03993")],
  [["datasheet-for-datasets"], paper("Datasheets for Datasets", "https://arxiv.org/abs/1803.09010")],
  [["system-card"], documentation("GPT-4 System Card", "https://cdn.openai.com/papers/gpt-4-system-card.pdf")],
  [["ai-disclosure"], standard("OECD AI Principles", "https://oecd.ai/en/ai-principles")],
  [["decision-provenance"], standard("NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework")],
  [["uncertainty-communication"], paper("Communicating Model Uncertainty to Humans", "https://dl.acm.org/doi/10.1145/3290605.3300728")],

  // Post-training and PEFT
  [["constitutional-ai"], paper("Constitutional AI: Harmlessness from AI Feedback", "https://arxiv.org/abs/2212.08073")],
  [["process-reward-model"], paper("Let's Verify Step by Step", "https://arxiv.org/abs/2305.20050")],
  [["outcome-reward-model", "reward-hacking"], paper("Scaling Laws for Reward Model Overoptimization", "https://arxiv.org/abs/2210.10760")],
  [["adapter-layer"], paper("Parameter-Efficient Transfer Learning for NLP", "https://arxiv.org/abs/1902.00751")],
  [["prefix-tuning"], paper("Prefix-Tuning: Optimizing Continuous Prompts for Generation", "https://arxiv.org/abs/2101.00190")],
  [["prompt-tuning"], paper("The Power of Scale for Parameter-Efficient Prompt Tuning", "https://arxiv.org/abs/2104.08691")],
  [["ia3"], paper("Few-Shot Parameter-Efficient Fine-Tuning is Better and Cheaper than In-Context Learning", "https://arxiv.org/abs/2205.05638")],
  [["qlora"], paper("QLoRA: Efficient Finetuning of Quantized LLMs", "https://arxiv.org/abs/2305.14314")],
  [["dora"], paper("DoRA: Weight-Decomposed Low-Rank Adaptation", "https://arxiv.org/abs/2402.09353")],

  // Transformer positions and long context
  [["sinusoidal-position-encoding"], paper("Attention Is All You Need", "https://arxiv.org/abs/1706.03762")],
  [["learned-position-embedding", "segment-embedding", "position-id"], paper("BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", "https://arxiv.org/abs/1810.04805")],
  [["position-interpolation", "context-length-extension"], paper("Extending Context Window of Large Language Models via Positional Interpolation", "https://arxiv.org/abs/2306.15595")],
  [["long-context-transformer"], paper("Longformer: The Long-Document Transformer", "https://arxiv.org/abs/2004.05150")],
  [["ntk-aware-scaling"], paper("Extending Context Window of Large Language Models via Positional Interpolation", "https://arxiv.org/abs/2306.15595")],
  [["yarn-scaling"], paper("YaRN: Efficient Context Window Extension of Large Language Models", "https://arxiv.org/abs/2309.00071")],
  [["length-extrapolation"], paper("Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation", "https://arxiv.org/abs/2108.12409")],
];

export const topicPrimarySources = {};
for (const [topicIds, source] of groups) {
  for (const topicId of topicIds) {
    if (topicPrimarySources[topicId]) throw new Error(`duplicate W15 primary source mapping: ${topicId}`);
    topicPrimarySources[topicId] = [source];
  }
}

if (Object.keys(topicPrimarySources).length !== 140) {
  throw new Error(`W15 primary source mapping must cover 140 topics, found ${Object.keys(topicPrimarySources).length}`);
}
