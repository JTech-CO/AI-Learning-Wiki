const paper = (title, url) => ({ title, url, type: 'paper' });
const standard = (title, url) => ({ title, url, type: 'standard' });
const documentation = (title, url) => ({ title, url, type: 'documentation' });
const book = (title, url) => ({ title, url, type: 'book' });

const groups = [
  // Agents and MCP
  [["mcp-tools"], standard("Model Context Protocol: Tools", "https://modelcontextprotocol.io/specification/2025-06-18/server/tools")],
  [["mcp-resources"], standard("Model Context Protocol: Resources", "https://modelcontextprotocol.io/specification/2025-06-18/server/resources")],
  [["mcp-prompts"], standard("Model Context Protocol: Prompts", "https://modelcontextprotocol.io/specification/2025-06-18/server/prompts")],
  [["mcp-sampling"], standard("Model Context Protocol: Sampling", "https://modelcontextprotocol.io/specification/2025-06-18/client/sampling")],
  [["mcp-elicitation"], standard("Model Context Protocol: Elicitation", "https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation")],
  [["mcp-transport"], standard("Model Context Protocol: Transports", "https://modelcontextprotocol.io/specification/2025-06-18/basic/transports")],
  [["agent-benchmark", "agent-task-success"], paper("AgentBench: Evaluating LLMs as Agents", "https://arxiv.org/abs/2308.03688")],
  [["agent-trajectory-evaluation", "agent-tool-accuracy"], paper("AgentBoard: An Analytical Evaluation Board of Multi-turn LLM Agents", "https://arxiv.org/abs/2401.13178")],

  // API operations
  [["request-signing"], standard("HTTP Message Signatures", "https://www.rfc-editor.org/rfc/rfc9421")],
  [["api-quota", "request-throttling"], standard("RateLimit Fields for HTTP", "https://www.rfc-editor.org/rfc/rfc9333")],
  [["token-bucket"], standard("A Single Rate Three Color Marker", "https://www.rfc-editor.org/rfc/rfc2697")],
  [["leaky-bucket"], standard("A Two Rate Three Color Marker", "https://www.rfc-editor.org/rfc/rfc2698")],
  [["concurrency-limit"], documentation("Google SRE: Handling Overload", "https://sre.google/sre-book/handling-overload/")],
  [["http-429"], standard("Additional HTTP Status Codes", "https://www.rfc-editor.org/rfc/rfc6585")],
  [["usage-metering", "api-cost-tracking"], documentation("OpenTelemetry Generative AI Semantic Conventions", "https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/")],
  [["api-logging"], documentation("OpenTelemetry Logs Semantic Conventions", "https://opentelemetry.io/docs/specs/semconv/general/logs/")],

  // Ecosystem, standards and economics
  [["oecd-ai-principles"], standard("OECD AI Principles", "https://oecd.ai/en/ai-principles")],
  [["partnership-on-ai"], documentation("Partnership on AI", "https://www.partnershiponai.org/")],
  [["linux-foundation-ai-data"], documentation("Linux Foundation AI & Data", "https://lfaidata.foundation/")],
  [["w3c-web-machine-learning"], standard("W3C Web Neural Network API", "https://www.w3.org/TR/webnn/")],
  [["ai-interoperability-standard"], documentation("ONNX Documentation", "https://onnx.ai/onnx/")],
  [["compute-cost", "training-cost"], paper("Training Compute-Optimal Large Language Models", "https://arxiv.org/abs/2203.15556")],
  [["inference-economics"], paper("Efficient Memory Management for Large Language Model Serving with PagedAttention", "https://arxiv.org/abs/2309.06180")],
  [["ai-supply-chain"], standard("NIST Cybersecurity Supply Chain Risk Management Practices", "https://csrc.nist.gov/pubs/sp/800/161/r1/final")],
  [["ai-chip-availability"], paper("AI and Compute", "https://arxiv.org/abs/2202.05924")],

  // Evaluation and observability
  [["simulation-based-evaluation"], paper("AgentBench: Evaluating LLMs as Agents", "https://arxiv.org/abs/2308.03688")],
  [["regression-evaluation", "production-evaluation"], paper("The ML Test Score: A Rubric for ML Production Readiness", "https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/")],
  [["model-telemetry", "prompt-trace", "token-usage-monitoring", "latency-monitoring", "cost-monitoring"], documentation("OpenTelemetry Generative AI Semantic Conventions", "https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/")],
  [["model-drift-monitoring"], paper("Failing Loudly: An Empirical Study of Methods for Detecting Dataset Shift", "https://arxiv.org/abs/1810.11953")],
  [["user-feedback-collection"], paper("Constitutional AI: Harmlessness from AI Feedback", "https://arxiv.org/abs/2212.08073")],

  // Foundations
  [["ai-system", "decision-making-system"], standard("NIST AI RMF Glossary", "https://airc.nist.gov/AI_RMF_Knowledge_Base/Glossary")],
  [["machine-learning-pipeline"], paper("TFX: A TensorFlow-Based Production-Scale Machine Learning Platform", "https://research.google/pubs/tfx-a-tensorflow-based-production-scale-machine-learning-platform/")],
  [["prediction", "recommendation-system"], book("An Introduction to Statistical Learning", "https://www.statlearning.com/")],
  [["distribution-shift", "out-of-distribution-data"], paper("A Survey on Out-of-Distribution Detection in NLP", "https://arxiv.org/abs/2110.11334")],
  [["underfitting", "overfitting", "bias-variance-tradeoff"], documentation("scikit-learn: Underfitting vs. Overfitting", "https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html")],

  // Inference reliability
  [["latency-throughput-tradeoff", "inference-capacity-planning"], paper("Orca: A Distributed Serving System for Transformer-Based Generative Models", "https://www.usenix.org/conference/osdi22/presentation/yu")],
  [["token-cost"], paper("FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness", "https://arxiv.org/abs/2205.14135")],
  [["backpressure"], documentation("Reactive Streams Specification", "https://www.reactive-streams.org/")],
  [["inference-timeout", "inference-retry"], documentation("Amazon Builders' Library: Timeouts, Retries, and Backoff with Jitter", "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/")],
  [["fallback-model", "circuit-breaker"], documentation("Microsoft Cloud Design Patterns: Circuit Breaker", "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker")],
  [["cold-start", "warm-start"], paper("Serverless Computing: One Step Forward, Two Steps Back", "https://arxiv.org/abs/1812.03651")],

  // LLM behavior
  [["controllability"], paper("Training Language Models to Follow Instructions with Human Feedback", "https://arxiv.org/abs/2203.02155")],
  [["model-knowledge", "knowledge-cutoff"], paper("Language Models as Knowledge Bases?", "https://arxiv.org/abs/1909.01066")],
  [["world-model"], paper("World Models", "https://arxiv.org/abs/1803.10122")],
  [["latent-knowledge"], paper("Discovering Latent Knowledge in Language Models Without Supervision", "https://arxiv.org/abs/2212.03827")],
  [["model-memorization"], paper("Extracting Training Data from Large Language Models", "https://arxiv.org/abs/2012.07805")],
  [["in-context-generalization"], paper("What Can Transformers Learn In-Context? A Case Study of Simple Function Classes", "https://arxiv.org/abs/2208.01066")],
  [["out-of-context-reasoning"], paper("Out-of-Context Meta-Learning in Large Language Models", "https://arxiv.org/abs/2310.15916")],
  [["sycophancy"], paper("Towards Understanding Sycophancy in Language Models", "https://arxiv.org/abs/2310.13548")],
  [["response-verbosity"], paper("LLM Evaluators Recognize and Favor Their Own Generations", "https://arxiv.org/abs/2404.13076")],

  // Numerical mathematics
  [["numerical-precision", "approximation-error"], book("Numerical Linear Algebra", "https://people.maths.ox.ac.uk/trefethen/text.html")],
  [["finite-difference-method"], documentation("SciPy Numerical Differentiation", "https://docs.scipy.org/doc/scipy/reference/differentiate.html")],
  [["automatic-differentiation"], documentation("JAX Automatic Differentiation", "https://docs.jax.dev/en/latest/automatic-differentiation.html")],
  [["monte-carlo-method"], book("Monte Carlo Statistical Methods", "https://link.springer.com/book/10.1007/978-1-4757-4145-2")],
  [["numerical-integration"], documentation("SciPy Integration", "https://docs.scipy.org/doc/scipy/tutorial/integrate.html")],
  [["euclidean-distance", "manhattan-distance", "mahalanobis-distance"], documentation("SciPy Distance Computations", "https://docs.scipy.org/doc/scipy/reference/spatial.distance.html")],
  [["metric-space"], book("Encyclopedia of Distances", "https://link.springer.com/book/10.1007/978-3-662-52844-0")],

  // Multimodal document AI
  [["multimodal-generation"], paper("Flamingo: a Visual Language Model for Few-Shot Learning", "https://arxiv.org/abs/2204.14198")],
  [["document-ai", "document-layout-analysis", "document-understanding"], paper("LayoutLM: Pre-training of Text and Layout for Document Image Understanding", "https://arxiv.org/abs/1912.13318")],
  [["table-recognition"], paper("PubTables-1M: Towards Comprehensive Table Extraction From Unstructured Documents", "https://arxiv.org/abs/2110.00061")],
  [["handwritten-text-recognition"], paper("TrOCR: Transformer-based Optical Character Recognition", "https://arxiv.org/abs/2109.10282")],
  [["scene-text-recognition"], paper("An End-to-End Trainable Neural Network for Image-based Sequence Recognition", "https://arxiv.org/abs/1507.05717")],
  [["document-visual-question-answering"], paper("DocVQA: A Dataset for VQA on Document Images", "https://arxiv.org/abs/2007.00398")],
  [["pdf-parsing"], documentation("GROBID Documentation", "https://grobid.readthedocs.io/en/latest/")],
  [["visual-document-retrieval"], paper("ColPali: Efficient Document Retrieval with Vision Language Models", "https://arxiv.org/abs/2407.01449")],

  // Neural diagnostics and explainability
  [["gradient-norm", "training-convergence"], paper("On the Difficulty of Training Recurrent Neural Networks", "https://arxiv.org/abs/1211.5063")],
  [["loss-landscape"], paper("Visualizing the Loss Landscape of Neural Nets", "https://arxiv.org/abs/1712.09913")],
  [["dead-neuron"], paper("Dying ReLU and Initialization: Theory and Numerical Examples", "https://arxiv.org/abs/1903.06733")],
  [["mode-collapse"], paper("Unrolled Generative Adversarial Networks", "https://arxiv.org/abs/1611.02163")],
  [["saliency-map"], paper("Deep Inside Convolutional Networks: Visualising Image Classification Models and Saliency Maps", "https://arxiv.org/abs/1312.6034")],
  [["feature-visualization", "activation-maximization"], documentation("Distill: Feature Visualization", "https://distill.pub/2017/feature-visualization/")],
  [["integrated-gradients"], paper("Axiomatic Attribution for Deep Networks", "https://arxiv.org/abs/1703.01365")],
  [["layer-wise-relevance-propagation"], paper("On Pixel-Wise Explanations for Non-Linear Classifier Decisions by Layer-Wise Relevance Propagation", "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0130140")],

  // Retrieval and knowledge graphs
  [["mean-reciprocal-rank", "normalized-discounted-cumulative-gain", "retrieval-hit-rate"], book("Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/")],
  [["context-precision", "context-recall"], paper("RAGAS: Automated Evaluation of Retrieval Augmented Generation", "https://arxiv.org/abs/2309.15217")],
  [["knowledge-graph"], standard("W3C RDF 1.1 Concepts and Abstract Syntax", "https://www.w3.org/TR/rdf11-concepts/")],
  [["graph-rag", "graph-retrieval", "subgraph-retrieval"], paper("From Local to Global: A Graph RAG Approach to Query-Focused Summarization", "https://arxiv.org/abs/2404.16130")],
  [["entity-linking"], paper("Entity Linking: A Primary Study", "https://arxiv.org/abs/2003.05227")],

  // Safety operations
  [["ai-policy-enforcement", "ai-compliance-monitoring", "third-party-ai-risk"], standard("NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework")],
  [["ai-regulatory-classification", "ai-incident-reporting"], standard("Regulation (EU) 2024/1689: Artificial Intelligence Act", "https://eur-lex.europa.eu/eli/reg/2024/1689/oj")],
  [["ai-red-teaming", "adversarial-testing"], standard("NIST AI 100-2e2025: Adversarial Machine Learning", "https://csrc.nist.gov/pubs/ai/100/2/e2025/final")],
  [["ai-threat-modeling"], documentation("Microsoft AI/ML Threat Modeling", "https://learn.microsoft.com/en-us/security/engineering/threat-modeling-aiml")],
  [["abuse-testing", "llm-penetration-testing"], documentation("OWASP GenAI Security Project", "https://genai.owasp.org/")],

  // Distributed and responsible training
  [["fully-sharded-data-parallel"], documentation("PyTorch FullyShardedDataParallel", "https://docs.pytorch.org/docs/stable/fsdp.html")],
  [["zero-redundancy-optimizer"], paper("ZeRO: Memory Optimizations Toward Training Trillion Parameter Models", "https://arxiv.org/abs/1910.02054")],
  [["gradient-checkpointing"], paper("Training Deep Nets with Sublinear Memory Cost", "https://arxiv.org/abs/1604.06174")],
  [["all-reduce"], documentation("NVIDIA NCCL Collective Operations", "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html")],
  [["distributed-optimizer"], paper("Reducing Activation Recomputation in Large Transformer Models", "https://arxiv.org/abs/2205.05198")],
  [["dataset-license", "training-data-consent", "training-data-copyright"], paper("The Data Provenance Initiative", "https://arxiv.org/abs/2310.16787")],
  [["privacy-preserving-training"], paper("Deep Learning with Differential Privacy", "https://arxiv.org/abs/1607.00133")],
  [["federated-learning"], paper("Communication-Efficient Learning of Deep Networks from Decentralized Data", "https://arxiv.org/abs/1602.05629")],

  // Transformer variants
  [["head-pruning"], paper("Are Sixteen Heads Really Better than One?", "https://arxiv.org/abs/1905.10650")],
  [["layer-dropping"], paper("Reducing Transformer Depth on Demand with Structured Dropout", "https://arxiv.org/abs/1909.11556")],
  [["early-exit-transformer"], paper("DeeBERT: Dynamic Early Exiting for Accelerating BERT Inference", "https://arxiv.org/abs/2004.12993")],
  [["speculative-transformer-block"], paper("Blockwise Parallel Decoding for Deep Autoregressive Models", "https://arxiv.org/abs/1811.03115")],
  [["fused-transformer-kernel"], paper("FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness", "https://arxiv.org/abs/2205.14135")],
  [["universal-transformer"], paper("Universal Transformers", "https://arxiv.org/abs/1807.03819")],
  [["adaptive-computation-time-transformer"], paper("Adaptive Computation Time for Recurrent Neural Networks", "https://arxiv.org/abs/1603.08983")],
  [["conformer-architecture"], paper("Conformer: Convolution-augmented Transformer for Speech Recognition", "https://arxiv.org/abs/2005.08100")],
  [["vision-transformer"], paper("An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale", "https://arxiv.org/abs/2010.11929")],
  [["graph-transformer"], paper("A Generalization of Transformer Networks to Graphs", "https://arxiv.org/abs/2012.09699")],
];

export const topicPrimarySources = {};
for (const [topicIds, source] of groups) {
  for (const topicId of topicIds) {
    if (topicPrimarySources[topicId]) throw new Error(`duplicate W17 primary source mapping: ${topicId}`);
    topicPrimarySources[topicId] = [source];
  }
}

if (Object.keys(topicPrimarySources).length !== 140) {
  throw new Error(`W17 primary source mapping must cover 140 topics, found ${Object.keys(topicPrimarySources).length}`);
}
