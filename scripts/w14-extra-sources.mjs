const paper = (title, url) => ({ title, url, type: 'paper' });
const standard = (title, url) => ({ title, url, type: 'standard' });
const documentation = (title, url) => ({ title, url, type: 'documentation' });
const book = (title, url) => ({ title, url, type: 'book' });

const groups = [
  [["hierarchical-task-network"], paper("An Overview of Hierarchical Task Network Planning", "https://arxiv.org/abs/1403.7426")],
  [["tree-of-thoughts"], paper("Tree of Thoughts: Deliberate Problem Solving with Large Language Models", "https://arxiv.org/abs/2305.10601")],
  [["graph-of-thoughts"], paper("Graph of Thoughts: Solving Elaborate Problems with Large Language Models", "https://arxiv.org/abs/2308.09687")],
  [["beam-planning", "search-based-planning"], book("Artificial Intelligence: A Modern Approach — Search", "https://aima.cs.berkeley.edu/")],
  [["model-based-planning", "agent-replanning"], paper("Model Predictive Control: Theory, Computation, and Design", "https://sites.engineering.ucsb.edu/~jbraw/mpc/")],
  [["plan-verification"], paper("PDDL2.1: An Extension to PDDL for Expressing Temporal Planning Domains", "https://www.cs.cmu.edu/afs/cs/project/jair/pub/volume20/fox03a.pdf")],
  [["reasoning-action-interleaving"], paper("ReAct: Synergizing Reasoning and Acting in Language Models", "https://arxiv.org/abs/2210.03629")],
  [["agent-deliberation"], paper("Improving Factuality and Reasoning in Language Models through Multiagent Debate", "https://arxiv.org/abs/2305.14325")],

  [["tool-error", "retry-policy", "exponential-backoff"], standard("RFC 9110: HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110")],
  [["output-parser", "response-validation"], standard("JSON Schema Core Specification", "https://json-schema.org/draft/2020-12/json-schema-core")],
  [["client-library", "api-client", "synchronous-client", "asynchronous-client", "client-middleware"], standard("OpenAPI Specification 3.1", "https://spec.openapis.org/oas/v3.1.0")],

  [["machine-learning-framework", "tensor-library", "pytorch"], documentation("PyTorch Documentation", "https://docs.pytorch.org/docs/stable/index.html")],
  [["tensorflow"], documentation("TensorFlow Documentation", "https://www.tensorflow.org/guide")],
  [["jax"], documentation("JAX Documentation", "https://docs.jax.dev/en/latest/")],
  [["keras"], documentation("Keras Developer Guides", "https://keras.io/guides/")],
  [["transformers-library"], documentation("Transformers Documentation", "https://huggingface.co/docs/transformers/index")],
  [["dataset-library"], documentation("Datasets Documentation", "https://huggingface.co/docs/datasets/index")],
  [["experiment-tracking"], documentation("MLflow Tracking", "https://mlflow.org/docs/latest/ml/tracking/")],
  [["feature-store"], documentation("Feast Documentation", "https://docs.feast.dev/")],

  [["annotator-fatigue", "annotator-bias"], paper("Best–Worst Scaling, More than Just a Method", "https://doi.org/10.1016/j.foodqual.2015.05.002")],
  [["qualitative-evaluation"], paper("Attempting Rigour and Replicability in Thematic Analysis", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6437927/")],
  [["automatic-rater", "judge-model", "pairwise-llm-judge", "pointwise-llm-judge"], paper("Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", "https://arxiv.org/abs/2306.05685")],
  [["reference-based-evaluation", "reference-free-evaluation"], paper("A Survey of Evaluation Metrics Used for NLG Systems", "https://arxiv.org/abs/2008.12009")],
  [["rubric-based-judge"], paper("G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment", "https://arxiv.org/abs/2303.16634")],

  [["gradient-boosting", "boosting"], paper("Greedy Function Approximation: A Gradient Boosting Machine", "https://doi.org/10.1214/aos/1013203451")],
  [["support-vector-machine"], paper("Support-Vector Networks", "https://link.springer.com/article/10.1007/BF00994018")],
  [["naive-bayes-classifier", "k-nearest-neighbors"], documentation("scikit-learn Supervised Learning Reference", "https://scikit-learn.org/stable/supervised_learning.html")],
  [["principal-component-analysis", "independent-component-analysis"], documentation("scikit-learn Decomposition Reference", "https://scikit-learn.org/stable/modules/decomposition.html")],
  [["anomaly-detection"], documentation("scikit-learn Novelty and Outlier Detection", "https://scikit-learn.org/stable/modules/outlier_detection.html")],
  [["ensemble-learning", "bagging"], documentation("scikit-learn Ensemble Methods", "https://scikit-learn.org/stable/modules/ensemble.html")],

  [["prompt-lookup-decoding"], paper("Prompt Lookup Decoding", "https://arxiv.org/abs/2311.04934")],
  [["cache-hit-rate"], documentation("vLLM Automatic Prefix Caching", "https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/")],
  [["post-training-quantization", "activation-quantization", "int8-inference"], paper("SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models", "https://arxiv.org/abs/2211.10438")],
  [["weight-only-quantization", "int4-inference"], paper("AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration", "https://arxiv.org/abs/2306.00978")],
  [["fp8-inference"], paper("FP8 Formats for Deep Learning", "https://arxiv.org/abs/2209.05433")],
  [["gguf-format"], documentation("GGUF File Format Specification", "https://github.com/ggml-org/ggml/blob/master/docs/gguf.md")],
  [["onnx-runtime"], documentation("ONNX Runtime Documentation", "https://onnxruntime.ai/docs/")],

  [["prompt-template", "prompt-engineering", "role-prompting", "prompt-delimiter", "output-constraint", "prompt-sensitivity"], paper("Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in Natural Language Processing", "https://arxiv.org/abs/2107.13586")],
  [["prompt-compression"], paper("LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models", "https://arxiv.org/abs/2310.05736")],
  [["prompt-chaining"], paper("Least-to-Most Prompting Enables Complex Reasoning in Large Language Models", "https://arxiv.org/abs/2205.10625")],
  [["automatic-prompt-optimization"], paper("Large Language Models Are Human-Level Prompt Engineers", "https://arxiv.org/abs/2211.01910")],
  [["retrieval-prompt"], paper("Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", "https://arxiv.org/abs/2005.11401")],

  [["statistical-estimator", "statistical-bias", "confidence-interval", "hypothesis-testing", "p-value", "bootstrap-method"], book("NIST/SEMATECH e-Handbook of Statistical Methods", "https://www.itl.nist.gov/div898/handbook/")],
  [["likelihood", "maximum-likelihood-estimation", "posterior-probability", "prior-probability"], book("Deep Learning: Probability and Information Theory", "https://www.deeplearningbook.org/contents/prob.html")],

  [["modality", "multimodal-fusion", "early-fusion", "late-fusion", "cross-modal-attention", "cross-modal-alignment"], paper("Multimodal Machine Learning: A Survey and Taxonomy", "https://arxiv.org/abs/1705.09406")],
  [["multimodal-contrastive-pretraining", "joint-embedding-space"], paper("Learning Transferable Visual Models From Natural Language Supervision", "https://arxiv.org/abs/2103.00020")],
  [["multimodal-instruction-tuning"], paper("Visual Instruction Tuning", "https://arxiv.org/abs/2304.08485")],
  [["interleaved-multimodal-data"], paper("Flamingo: a Visual Language Model for Few-Shot Learning", "https://arxiv.org/abs/2204.14198")],

  [["adam-optimizer"], paper("Adam: A Method for Stochastic Optimization", "https://arxiv.org/abs/1412.6980")],
  [["adamw"], paper("Decoupled Weight Decay Regularization", "https://arxiv.org/abs/1711.05101")],
  [["learning-rate-schedule", "learning-rate-warmup"], paper("Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour", "https://arxiv.org/abs/1706.02677")],
  [["gradient-clipping", "exploding-gradient"], paper("On the Difficulty of Training Recurrent Neural Networks", "https://arxiv.org/abs/1211.5063")],
  [["vanishing-gradient"], paper("Learning Long-Term Dependencies with Gradient Descent is Difficult", "https://ieeexplore.ieee.org/document/279181")],
  [["second-order-optimization", "optimizer-state", "gradient-accumulation"], book("Deep Learning: Optimization for Training Deep Models", "https://www.deeplearningbook.org/contents/optimization.html")],

  [["federated-search", "faceted-search", "retrieval-filtering"], book("Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/")],
  [["recursive-retrieval", "adaptive-retrieval"], paper("Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection", "https://arxiv.org/abs/2310.11511")],
  [["chunk-size", "chunk-overlap", "sentence-segmentation", "document-parsing", "document-ingestion-pipeline"], paper("Retrieval-Augmented Generation for Large Language Models: A Survey", "https://arxiv.org/abs/2312.10997")],

  [["measurement-bias", "selection-bias", "historical-bias"], standard("NIST SP 1270: Towards a Standard for Identifying and Managing Bias in Artificial Intelligence", "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.1270.pdf")],
  [["demographic-parity", "fairness-through-unawareness", "intersectional-fairness", "fairness-metric"], book("Fairness and Machine Learning", "https://fairmlbook.org/")],
  [["equalized-odds", "equality-of-opportunity"], paper("Equality of Opportunity in Supervised Learning", "https://arxiv.org/abs/1610.02413")],
  [["disparate-impact"], paper("Fairness through Awareness", "https://arxiv.org/abs/1104.3913")],

  [["preference-data", "pairwise-preference-ranking", "bradley-terry-model", "kl-penalty", "reference-model", "policy-model"], paper("Training Language Models to Follow Instructions with Human Feedback", "https://arxiv.org/abs/2203.02155")],
  [["rejection-sampling", "best-of-n-sampling"], paper("Scaling Laws for Reward Model Overoptimization", "https://arxiv.org/abs/2210.10760")],
  [["online-preference-learning"], paper("Direct Language Model Alignment from Online AI Feedback", "https://arxiv.org/abs/2402.04792")],
  [["offline-preference-learning"], paper("Direct Preference Optimization: Your Language Model is Secretly a Reward Model", "https://arxiv.org/abs/2305.18290")],

  [["reformer"], paper("Reformer: The Efficient Transformer", "https://arxiv.org/abs/2001.04451")],
  [["switch-transformer"], paper("Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity", "https://arxiv.org/abs/2101.03961")],
  [["retrieval-transformer"], paper("Improving Language Models by Retrieving from Trillions of Tokens", "https://arxiv.org/abs/2112.04426")],
  [["memory-augmented-transformer", "hierarchical-transformer"], paper("Compressive Transformers for Long-Range Sequence Modelling", "https://arxiv.org/abs/1911.05507")],
  [["recurrent-memory-transformer"], paper("Recurrent Memory Transformer", "https://arxiv.org/abs/2207.06881")],
  [["absolute-position-encoding", "relative-position-encoding"], paper("Attention Is All You Need", "https://arxiv.org/abs/1706.03762")],
  [["rotary-position-embedding"], paper("RoFormer: Enhanced Transformer with Rotary Position Embedding", "https://arxiv.org/abs/2104.09864")],
  [["alibi-position-bias"], paper("Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation", "https://arxiv.org/abs/2108.12409")],
];

export const topicPrimarySources = {};
for (const [topicIds, source] of groups) {
  for (const topicId of topicIds) {
    if (topicPrimarySources[topicId]) throw new Error(`duplicate W14 primary source mapping: ${topicId}`);
    topicPrimarySources[topicId] = [source];
  }
}

if (Object.keys(topicPrimarySources).length !== 140) {
  throw new Error(`W14 primary source mapping must cover 140 topics, found ${Object.keys(topicPrimarySources).length}`);
}
