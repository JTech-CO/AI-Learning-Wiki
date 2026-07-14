const paper = (title, url) => ({ title, url, type: 'paper' });
const standard = (title, url) => ({ title, url, type: 'standard' });
const documentation = (title, url) => ({ title, url, type: 'documentation' });
const book = (title, url) => ({ title, url, type: 'book' });

const groups = [
  // Agents and MCP
  [["multi-agent-debate", "multi-agent-conflict-resolution"], paper("Improving Factuality and Reasoning in Language Models through Multiagent Debate", "https://arxiv.org/abs/2305.14325")],
  [["blackboard-architecture"], paper("Blackboard Systems", "https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/537")],
  [["supervisor-agent", "peer-to-peer-agents", "agent-handoff", "shared-agent-memory"], paper("AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation", "https://arxiv.org/abs/2308.08155")],
  [["mcp-host", "mcp-client", "mcp-server"], standard("Model Context Protocol Architecture", "https://modelcontextprotocol.io/specification/2025-06-18/architecture")],

  // API security
  [["hmac-authentication"], standard("HMAC: Keyed-Hashing for Message Authentication", "https://www.rfc-editor.org/rfc/rfc2104")],
  [["mutual-tls"], standard("OAuth 2.0 Mutual-TLS Client Authentication", "https://www.rfc-editor.org/rfc/rfc8705")],
  [["secret-management", "environment-variable-secret", "credential-rotation", "least-privilege"], documentation("OWASP Secrets Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html")],
  [["oauth-scope"], standard("OAuth 2.0 Authorization Framework", "https://www.rfc-editor.org/rfc/rfc6749")],
  [["cross-origin-resource-sharing"], standard("Fetch Standard: CORS Protocol", "https://fetch.spec.whatwg.org/#http-cors-protocol")],
  [["cross-site-request-forgery"], documentation("OWASP Cross-Site Request Forgery Prevention", "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html")],
  [["server-side-request-forgery"], documentation("OWASP Server-Side Request Forgery Prevention", "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html")],

  // Ecosystem and standards
  [["model-serving-platform", "managed-inference-platform"], documentation("KServe Documentation", "https://kserve.github.io/website/docs/intro")],
  [["edge-model-deployment", "mobile-model-deployment"], documentation("LiteRT Documentation", "https://ai.google.dev/edge/litert")],
  [["model-monitoring-platform"], paper("Monitoring and Explainability of Models in Production", "https://arxiv.org/abs/2207.04458")],
  [["mlcommons"], documentation("MLCommons Benchmarks", "https://mlcommons.org/benchmarks/")],
  [["open-neural-network-exchange"], documentation("ONNX Documentation", "https://onnx.ai/onnx/")],
  [["nist-ai-program"], documentation("NIST Artificial Intelligence Program", "https://www.nist.gov/artificial-intelligence")],
  [["iso-iec-jtc1-sc42"], standard("ISO/IEC JTC 1/SC 42 Artificial Intelligence", "https://www.iso.org/committee/6794475.html")],
  [["ieee-ai-standards"], standard("IEEE Autonomous and Intelligent Systems Standards", "https://standards.ieee.org/initiatives/autonomous-intelligence-systems/standards/")],

  // Evaluation
  [["faithfulness", "answer-relevance", "context-relevance", "citation-correctness", "groundedness"], paper("RAGAS: Automated Evaluation of Retrieval Augmented Generation", "https://arxiv.org/abs/2309.15217")],
  [["agent-evaluation", "tool-use-evaluation", "planning-evaluation"], paper("AgentBench: Evaluating LLMs as Agents", "https://arxiv.org/abs/2308.03688")],
  [["end-to-end-success-rate", "task-completion-rate"], paper("SWE-bench: Can Language Models Resolve Real-World GitHub Issues?", "https://arxiv.org/abs/2310.06770")],

  // Probabilistic foundations
  [["probabilistic-model", "generative-discriminative-model", "bayesian-learning", "maximum-a-posteriori-estimation"], book("Pattern Recognition and Machine Learning", "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/")],
  [["probabilistic-graphical-model", "bayesian-network", "markov-random-field", "hidden-markov-model"], documentation("Stanford CS228: Probabilistic Graphical Models", "https://cs.stanford.edu/~ermon/cs228/index.html")],
  [["gaussian-process"], book("Gaussian Processes for Machine Learning", "https://gaussianprocess.org/gpml/")],
  [["uncertainty-quantification"], paper("Simple and Scalable Predictive Uncertainty Estimation using Deep Ensembles", "https://arxiv.org/abs/1612.01474")],

  // Inference hardware and reliability
  [["cpu-inference"], documentation("oneDNN Documentation", "https://oneapi-src.github.io/oneDNN/")],
  [["accelerator-memory", "memory-bandwidth", "high-bandwidth-memory", "compute-bound-workload", "memory-bound-workload", "roofline-model"], paper("Roofline: An Insightful Visual Performance Model for Multicore Architectures", "https://www.cs.colostate.edu/~cs475/f19/more_assignments/Labs/L10/RooflineCACM2009.pdf")],
  [["service-level-objective", "model-availability", "tail-latency"], book("Site Reliability Engineering", "https://sre.google/sre-book/table-of-contents/")],

  // LLM capabilities
  [["prompt-caching"], documentation("vLLM Automatic Prefix Caching", "https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/")],
  [["lost-in-the-middle", "context-utilization", "context-budget"], paper("Lost in the Middle: How Language Models Use Long Contexts", "https://arxiv.org/abs/2307.03172")],
  [["context-contamination"], paper("Universal and Transferable Adversarial Attacks on Aligned Language Models", "https://arxiv.org/abs/2307.15043")],
  [["instruction-following", "steerability"], paper("Training Language Models to Follow Instructions with Human Feedback", "https://arxiv.org/abs/2203.02155")],
  [["reasoning-capability"], paper("Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", "https://arxiv.org/abs/2201.11903")],
  [["multilingual-capability"], paper("No Language Left Behind: Scaling Human-Centered Machine Translation", "https://arxiv.org/abs/2207.04672")],
  [["code-generation"], paper("Evaluating Large Language Models Trained on Code", "https://arxiv.org/abs/2107.03374")],

  // Information theory and numerical computing
  [["source-coding", "channel-capacity", "data-processing-inequality", "jensen-shannon-divergence", "f-divergence", "rate-distortion-theory"], book("Entropy and Information Theory", "https://ee.stanford.edu/~gray/it.html")],
  [["floating-point-arithmetic", "overflow-underflow"], standard("IEEE 754 Floating-Point Arithmetic", "https://standards.ieee.org/ieee/754/6210/")],
  [["numerical-stability", "condition-number"], book("Numerical Linear Algebra", "https://people.maths.ox.ac.uk/trefethen/text.html")],

  // Multimodal generation
  [["image-to-image-generation"], paper("Image-to-Image Translation with Conditional Adversarial Networks", "https://arxiv.org/abs/1611.07004")],
  [["image-inpainting", "image-outpainting"], paper("High-Resolution Image Synthesis with Latent Diffusion Models", "https://arxiv.org/abs/2112.10752")],
  [["controlnet"], paper("Adding Conditional Control to Text-to-Image Diffusion Models", "https://arxiv.org/abs/2302.05543")],
  [["classifier-free-guidance"], paper("Classifier-Free Diffusion Guidance", "https://arxiv.org/abs/2207.12598")],
  [["score-based-generative-model"], paper("Score-Based Generative Modeling through Stochastic Differential Equations", "https://arxiv.org/abs/2011.13456")],
  [["diffusion-scheduler", "diffusion-denoising-step"], paper("Denoising Diffusion Probabilistic Models", "https://arxiv.org/abs/2006.11239")],
  [["text-to-video-generation"], paper("Video Diffusion Models", "https://arxiv.org/abs/2204.03458")],
  [["text-to-audio-generation"], paper("AudioLDM: Text-to-Audio Generation with Latent Diffusion Models", "https://arxiv.org/abs/2301.12503")],

  // Neural regularization
  [["label-smoothing"], paper("Rethinking the Inception Architecture for Computer Vision", "https://arxiv.org/abs/1512.00567")],
  [["stochastic-depth"], paper("Deep Networks with Stochastic Depth", "https://arxiv.org/abs/1603.09382")],
  [["spectral-normalization"], paper("Spectral Normalization for Generative Adversarial Networks", "https://arxiv.org/abs/1802.05957")],
  [["noise-injection", "max-norm-regularization"], book("Deep Learning: Regularization for Deep Learning", "https://www.deeplearningbook.org/contents/regularization.html")],
  [["mixup"], paper("mixup: Beyond Empirical Risk Minimization", "https://arxiv.org/abs/1710.09412")],
  [["cutmix"], paper("CutMix: Regularization Strategy to Train Strong Classifiers with Localizable Features", "https://arxiv.org/abs/1905.04899")],
  [["training-loss", "validation-loss", "learning-curve"], documentation("scikit-learn Learning Curve Reference", "https://scikit-learn.org/stable/modules/learning_curve.html")],

  // Retrieval ranking
  [["agentic-rag"], paper("Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection", "https://arxiv.org/abs/2310.11511")],
  [["cross-encoder-reranker"], paper("Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks", "https://arxiv.org/abs/1908.10084")],
  [["pointwise-ranking", "pairwise-ranking", "listwise-ranking", "learning-to-rank"], paper("Learning to Rank: From Pairwise Approach to Listwise Approach", "https://www.microsoft.com/en-us/research/publication/learning-to-rank-from-pairwise-approach-to-listwise-approach/")],
  [["reciprocal-rank-fusion"], paper("Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods", "https://dl.acm.org/doi/10.1145/1571941.1572114")],
  [["relevance-score", "precision-at-k", "recall-at-k"], book("Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/")],

  // AI governance
  [["algorithmic-contestability"], documentation("OECD AI Principles", "https://oecd.ai/en/ai-principles")],
  [["nist-ai-risk-management-framework", "ai-risk-assessment", "ai-risk-register", "ai-governance-framework"], standard("NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework")],
  [["algorithmic-impact-assessment"], documentation("Algorithmic Impact Assessment Tool", "https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html")],
  [["algorithmic-audit", "ai-accountability"], standard("ISO/IEC 42001 Artificial Intelligence Management System", "https://www.iso.org/standard/81230.html")],
  [["human-oversight"], standard("NIST AI RMF Playbook", "https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook")],
  [["acceptable-use-policy"], documentation("OECD Framework for the Classification of AI Systems", "https://oecd.ai/en/classification")],

  // Compression and distributed training
  [["model-pruning", "model-sparsity"], paper("Learning both Weights and Connections for Efficient Neural Networks", "https://arxiv.org/abs/1506.02626")],
  [["model-merging", "task-vector"], paper("Editing Models with Task Arithmetic", "https://arxiv.org/abs/2212.04089")],
  [["quantization-aware-training"], paper("Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference", "https://arxiv.org/abs/1712.05877")],
  [["data-parallelism", "model-parallelism"], paper("Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism", "https://arxiv.org/abs/1909.08053")],
  [["tensor-parallelism", "pipeline-parallelism"], paper("Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM", "https://arxiv.org/abs/2104.04473")],
  [["expert-parallelism"], paper("Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity", "https://arxiv.org/abs/2101.03961")],

  // Efficient attention
  [["flash-attention", "memory-efficient-attention"], paper("FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness", "https://arxiv.org/abs/2205.14135")],
  [["attention-complexity"], paper("Attention Is All You Need", "https://arxiv.org/abs/1706.03762")],
  [["chunked-attention", "block-sparse-attention"], paper("Longformer: The Long-Document Transformer", "https://arxiv.org/abs/2004.05150")],
  [["paged-attention"], paper("Efficient Memory Management for Large Language Model Serving with PagedAttention", "https://arxiv.org/abs/2309.06180")],
  [["low-rank-attention"], paper("Linformer: Self-Attention with Linear Complexity", "https://arxiv.org/abs/2006.04768")],
  [["kernelized-attention"], paper("Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention", "https://arxiv.org/abs/2006.16236")],
  [["attention-sink"], paper("Efficient Streaming Language Models with Attention Sinks", "https://arxiv.org/abs/2309.17453")],
  [["key-value-compression"], paper("Scissorhands: Exploiting the Persistence of Importance Hypothesis for LLM KV Cache Compression", "https://arxiv.org/abs/2305.17118")],
];

export const topicPrimarySources = {};
for (const [topicIds, source] of groups) {
  for (const topicId of topicIds) {
    if (topicPrimarySources[topicId]) throw new Error(`duplicate W16 primary source mapping: ${topicId}`);
    topicPrimarySources[topicId] = [source];
  }
}

if (Object.keys(topicPrimarySources).length !== 140) {
  throw new Error(`W16 primary source mapping must cover 140 topics, found ${Object.keys(topicPrimarySources).length}`);
}
