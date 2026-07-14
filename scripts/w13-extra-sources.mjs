const paper = (title, url) => ({ title, url, type: "paper" });
const standard = (title, url) => ({ title, url, type: "standard" });
const documentation = (title, url) => ({ title, url, type: "documentation" });
const book = (title, url) => ({ title, url, type: "book" });

const groups = [
  [["semantic-agent-memory", "procedural-agent-memory"], paper("Cognitive Architectures for Language Agents", "https://arxiv.org/abs/2309.02427")],
  [["vector-memory", "conversation-memory", "session-state", "persistent-agent-state"], paper("MemGPT: Towards LLMs as Operating Systems", "https://arxiv.org/abs/2310.08560")],
  [["agent-scratchpad", "plan-and-execute"], paper("ReAct: Synergizing Reasoning and Acting in Language Models", "https://arxiv.org/abs/2210.03629")],
  [["memory-consolidation", "memory-forgetting"], paper("Generative Agents: Interactive Simulacra of Human Behavior", "https://arxiv.org/abs/2304.03442")],

  [["function-calling"], paper("Gorilla: Large Language Model Connected with Massive APIs", "https://arxiv.org/abs/2305.15334")],
  [["json-schema", "schema-validation", "typed-response"], standard("JSON Schema Specification", "https://json-schema.org/specification")],
  [["grammar-constrained-generation"], paper("Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning", "https://arxiv.org/abs/2305.13971")],
  [["tool-definition", "tool-argument", "tool-result", "parallel-tool-call", "tool-choice"], paper("Toolformer: Language Models Can Teach Themselves to Use Tools", "https://arxiv.org/abs/2302.04761")],

  [["on-premises-ai"], standard("NIST SP 800-145: The NIST Definition of Cloud Computing", "https://csrc.nist.gov/pubs/sp/800/145/final")],
  [["edge-ai"], paper("Edge Intelligence: Paving the Last Mile of Artificial Intelligence with Edge Computing", "https://arxiv.org/abs/1909.00560")],
  [["ai-datacenter", "compute-cluster"], paper("In-Datacenter Performance Analysis of a Tensor Processing Unit", "https://arxiv.org/abs/1704.04760")],
  [["accelerator-interconnect", "nvlink"], documentation("NVIDIA NVLink Documentation", "https://www.nvidia.com/en-us/data-center/nvlink/")],
  [["infiniband"], documentation("NVIDIA RDMA Aware Networks Programming User Manual", "https://docs.nvidia.com/networking/display/rdmaawareprogrammingv17")],
  [["cuda", "accelerator-memory-hierarchy"], documentation("CUDA C++ Programming Documentation", "https://docs.nvidia.com/cuda/cuda-c-programming-guide/")],
  [["rocm"], documentation("ROCm Documentation", "https://rocm.docs.amd.com/en/latest/")],

  [["data-annotation", "annotator-agreement", "inter-rater-reliability", "annotation-adjudication"], paper("Inter-Coder Agreement for Computational Linguistics", "https://aclanthology.org/J08-4004/")],
  [["likert-scale"], paper("Analyzing and Interpreting Data From Likert-Type Scales", "https://pmc.ncbi.nlm.nih.gov/articles/PMC3886444/")],
  [["pairwise-comparison"], paper("AlpacaFarm: A Simulation Framework for Methods that Learn from Human Feedback", "https://arxiv.org/abs/2305.14387")],
  [["blind-evaluation", "expert-evaluation", "evaluation-sampling"], paper("Holistic Evaluation of Language Models", "https://arxiv.org/abs/2211.09110")],
  [["crowdsourced-evaluation"], paper("Cheap and Fast—but is it Good? Evaluating Non-Expert Annotations for Natural Language Tasks", "https://aclanthology.org/D08-1027/")],

  [["concept-drift"], paper("Learning under Concept Drift: A Review", "https://arxiv.org/abs/2004.05785")],
  [["regression", "linear-regression", "logistic-regression", "classification"], documentation("scikit-learn Linear Models Documentation", "https://scikit-learn.org/stable/modules/linear_model.html")],
  [["clustering", "k-means-clustering", "hierarchical-clustering"], documentation("scikit-learn Clustering Documentation", "https://scikit-learn.org/stable/modules/clustering.html")],
  [["decision-tree"], documentation("scikit-learn Decision Trees Documentation", "https://scikit-learn.org/stable/modules/tree.html")],
  [["random-forest"], documentation("scikit-learn Forests of Randomized Trees Documentation", "https://scikit-learn.org/stable/modules/ensemble.html#forest")],

  [["dynamic-batching", "static-batching"], documentation("NVIDIA Triton Inference Server Batcher Documentation", "https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/batcher.html")],
  [["prefix-caching"], documentation("vLLM Automatic Prefix Caching", "https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html")],
  [["paged-kv-cache"], paper("Efficient Memory Management for Large Language Model Serving with PagedAttention", "https://arxiv.org/abs/2309.06180")],
  [["kv-cache-quantization"], paper("KIVI: A Tuning-Free Asymmetric 2bit Quantization for KV Cache", "https://arxiv.org/abs/2402.02750")],
  [["cache-eviction"], paper("H2O: Heavy-Hitter Oracle for Efficient Generative Inference of Large Language Models", "https://arxiv.org/abs/2306.14048")],
  [["cache-offloading"], paper("FlexGen: High-Throughput Generative Inference of Large Language Models with a Single GPU", "https://arxiv.org/abs/2303.06865")],
  [["chunked-prefill"], documentation("vLLM Optimization and Tuning", "https://docs.vllm.ai/en/latest/configuration/optimization.html")],
  [["speculative-decoding", "draft-model"], paper("Fast Inference from Transformers via Speculative Decoding", "https://arxiv.org/abs/2211.17192")],

  [["emergent-ability"], paper("Emergent Abilities of Large Language Models", "https://arxiv.org/abs/2206.07682")],
  [["scaling-efficiency"], paper("Training Compute-Optimal Large Language Models", "https://arxiv.org/abs/2203.15556")],
  [["system-prompt", "user-prompt", "instruction"], paper("Training Language Models to Follow Instructions with Human Feedback", "https://arxiv.org/abs/2203.02155")],
  [["zero-shot-prompting", "few-shot-prompting", "in-context-learning"], paper("Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165")],
  [["chain-of-thought-prompting"], paper("Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", "https://arxiv.org/abs/2201.11903")],
  [["self-consistency-decoding"], paper("Self-Consistency Improves Chain of Thought Reasoning in Language Models", "https://arxiv.org/abs/2203.11171")],

  [["joint-probability-distribution", "marginal-probability", "bayes-theorem", "expected-value", "variance", "covariance", "correlation", "law-of-large-numbers", "central-limit-theorem", "statistical-sampling"], book("Deep Learning: Probability and Information Theory", "https://www.deeplearningbook.org/contents/prob.html")],

  [["video-captioning"], paper("Sequence to Sequence – Video to Text", "https://arxiv.org/abs/1505.00487")],
  [["video-question-answering"], paper("ActivityNet-QA: A Dataset for Understanding Complex Web Videos via Question Answering", "https://arxiv.org/abs/1906.02467")],
  [["frame-sampling"], paper("Temporal Segment Networks: Towards Good Practices for Deep Action Recognition", "https://arxiv.org/abs/1608.00859")],
  [["optical-flow"], paper("FlowNet: Learning Optical Flow with Convolutional Networks", "https://arxiv.org/abs/1504.06852")],
  [["temporal-attention"], paper("Is Space-Time Attention All You Need for Video Understanding?", "https://arxiv.org/abs/2102.05095")],
  [["video-diffusion"], paper("Video Diffusion Models", "https://arxiv.org/abs/2204.03458")],
  [["world-simulation-model"], paper("Genie: Generative Interactive Environments", "https://arxiv.org/abs/2402.15391")],
  [["long-video-understanding"], paper("LongVILA: Scaling Long-Context Visual Language Models for Long Videos", "https://arxiv.org/abs/2408.10188")],
  [["video-tokenization"], paper("MAGVIT: Masked Generative Video Transformer", "https://arxiv.org/abs/2212.05199")],
  [["lip-reading"], paper("LipNet: End-to-End Sentence-level Lipreading", "https://arxiv.org/abs/1611.01599")],

  [["neural-turing-machine"], paper("Neural Turing Machines", "https://arxiv.org/abs/1410.5401")],
  [["deep-belief-network"], paper("A Fast Learning Algorithm for Deep Belief Nets", "https://www.cs.toronto.edu/~hinton/absps/fastnc.pdf")],
  [["restricted-boltzmann-machine"], paper("A Practical Guide to Training Restricted Boltzmann Machines", "https://www.cs.toronto.edu/~hinton/absps/guideTR.pdf")],
  [["echo-state-network"], paper("A Practical Guide to Applying Echo State Networks", "https://arxiv.org/abs/1207.1610")],
  [["stochastic-gradient-descent", "mini-batch-gradient-descent", "momentum-optimizer", "nesterov-accelerated-gradient"], book("Deep Learning: Optimization for Training Deep Models", "https://www.deeplearningbook.org/contents/optimization.html")],
  [["adagrad"], paper("Adaptive Subgradient Methods for Online Learning and Stochastic Optimization", "https://jmlr.org/papers/v12/duchi11a.html")],
  [["rmsprop"], paper("Adam: A Method for Stochastic Optimization", "https://arxiv.org/abs/1412.6980")],

  [["dense-retrieval", "passage-retrieval"], paper("Dense Passage Retrieval for Open-Domain Question Answering", "https://arxiv.org/abs/2004.04906")],
  [["sparse-neural-retrieval"], paper("SPLADE v2: Sparse Lexical and Expansion Model for Information Retrieval", "https://arxiv.org/abs/2109.10086")],
  [["hybrid-search"], paper("Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods", "https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf")],
  [["multi-vector-retrieval"], paper("ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT", "https://arxiv.org/abs/2004.12832")],
  [["query-expansion", "query-rewriting"], paper("Query2doc: Query Expansion with Large Language Models", "https://arxiv.org/abs/2303.07678")],
  [["pseudo-relevance-feedback"], paper("Generative Relevance Feedback with Large Language Models", "https://arxiv.org/abs/2304.13157")],
  [["maximal-marginal-relevance"], paper("The Use of MMR, Diversity-Based Reranking for Reordering Documents and Producing Summaries", "https://aclanthology.org/X98-1025/")],
  [["document-retrieval"], paper("BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models", "https://arxiv.org/abs/2104.08663")],

  [["data-consent"], standard("General Data Protection Regulation", "https://eur-lex.europa.eu/eli/reg/2016/679/oj")],
  [["federated-analytics"], paper("Federated Analytics: Collaborative Data Science without Data Collection", "https://arxiv.org/abs/2003.08152")],
  [["secure-aggregation"], paper("Practical Secure Aggregation for Privacy-Preserving Machine Learning", "https://arxiv.org/abs/1611.04482")],
  [["privacy-attack"], paper("Membership Inference Attacks Against Machine Learning Models", "https://arxiv.org/abs/1610.05820")],
  [["memorized-data-extraction"], paper("Extracting Training Data from Large Language Models", "https://arxiv.org/abs/2012.07805")],
  [["confidential-computing"], standard("NISTIR 8320A: Hardware-Enabled Security", "https://csrc.nist.gov/pubs/ir/8320/a/final")],
  [["privacy-audit"], standard("NIST Privacy Framework", "https://www.nist.gov/privacy-framework")],
  [["algorithmic-bias"], standard("NIST SP 1270: Towards a Standard for Identifying and Managing Bias in Artificial Intelligence", "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.1270.pdf")],
  [["data-bias", "representation-bias"], paper("Datasheets for Datasets", "https://arxiv.org/abs/1803.09010")],

  [["instruction-dataset", "multi-task-instruction-tuning", "instruction-mixture"], paper("The Flan Collection: Designing Data and Methods for Effective Instruction Tuning", "https://arxiv.org/abs/2301.13688")],
  [["chat-template", "training-data-formatting"], documentation("Hugging Face Chat Templates", "https://huggingface.co/docs/transformers/chat_templating")],
  [["response-format-tuning"], paper("Training Language Models to Follow Instructions with Human Feedback", "https://arxiv.org/abs/2203.02155")],
  [["teacher-forcing"], paper("Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks", "https://arxiv.org/abs/1506.03099")],
  [["sequence-classification-fine-tuning"], paper("BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", "https://arxiv.org/abs/1810.04805")],
  [["proximal-policy-optimization-for-llm"], paper("Training Language Models to Follow Instructions with Human Feedback", "https://arxiv.org/abs/2203.02155")],
  [["reinforcement-learning-from-ai-feedback"], paper("Constitutional AI: Harmlessness from AI Feedback", "https://arxiv.org/abs/2212.08073")],

  [["sequence-to-sequence-transformer"], paper("Attention Is All You Need", "https://arxiv.org/abs/1706.03762")],
  [["bert-architecture"], paper("BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", "https://arxiv.org/abs/1810.04805")],
  [["gpt-architecture"], paper("Language Models are Unsupervised Multitask Learners", "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf")],
  [["t5-architecture"], paper("Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer", "https://arxiv.org/abs/1910.10683")],
  [["bart-architecture"], paper("BART: Denoising Sequence-to-Sequence Pre-training for Natural Language Generation, Translation, and Comprehension", "https://arxiv.org/abs/1910.13461")],
  [["xlnet-architecture"], paper("XLNet: Generalized Autoregressive Pretraining for Language Understanding", "https://arxiv.org/abs/1906.08237")],
  [["transformer-xl"], paper("Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context", "https://arxiv.org/abs/1901.02860")],
  [["longformer"], paper("Longformer: The Long-Document Transformer", "https://arxiv.org/abs/2004.05150")],
  [["bigbird"], paper("Big Bird: Transformers for Longer Sequences", "https://arxiv.org/abs/2007.14062")],
  [["performer"], paper("Rethinking Attention with Performers", "https://arxiv.org/abs/2009.14794")],
];

export const topicPrimarySources = {};
for (const [topicIds, source] of groups) {
  for (const topicId of topicIds) {
    if (topicPrimarySources[topicId]) throw new Error(`duplicate W13 primary source mapping: ${topicId}`);
    topicPrimarySources[topicId] = [source];
  }
}

if (Object.keys(topicPrimarySources).length !== 140) {
  throw new Error(`W13 primary source mapping must cover 140 topics, found ${Object.keys(topicPrimarySources).length}`);
}
