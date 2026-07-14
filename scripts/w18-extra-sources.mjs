const paper = (title, url) => ({ title, url, type: 'paper' });
const standard = (title, url) => ({ title, url, type: 'standard' });
const documentation = (title, url) => ({ title, url, type: 'documentation' });
const book = (title, url) => ({ title, url, type: 'book' });

const groups = [
  [["no-free-lunch-theorem"], paper("The No-Free-Lunch Theorems of Supervised Learning", "https://arxiv.org/abs/2202.04513")],
  [["narrow-ai", "artificial-general-intelligence", "ai-lifecycle"], standard("NIST AI Risk Management Framework 1.0", "https://doi.org/10.6028/NIST.AI.100-1")],
  [["turing-test"], paper("Computing Machinery and Intelligence", "https://academic.oup.com/mind/article/LIX/236/433/986238")],

  [["kernel-function", "kernel-trick"], book("Pattern Recognition and Machine Learning", "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/")],
  [["high-dimensional-geometry", "curse-of-dimensionality", "concentration-of-measure"], book("Foundations of Data Science", "https://www.cs.cornell.edu/jeh/book.pdf")],

  [["sparse-transformer"], paper("Generating Long Sequences with Sparse Transformers", "https://arxiv.org/abs/1904.10509")],
  [["state-space-transformer-hybrid"], paper("Jamba: A Hybrid Transformer-Mamba Language Model", "https://arxiv.org/abs/2403.19887")],
  [["diffusion-transformer"], paper("Scalable Diffusion Models with Transformers", "https://arxiv.org/abs/2212.09748")],
  [["multimodal-transformer"], paper("Flamingo: a Visual Language Model for Few-Shot Learning", "https://arxiv.org/abs/2204.14198")],
  [["mixture-of-depths"], paper("Mixture-of-Depths: Dynamically Allocating Compute in Transformer-Based Language Models", "https://arxiv.org/abs/2404.02258")],

  [["style-transfer"], paper("Style Transfer from Non-Parallel Text by Cross-Alignment", "https://arxiv.org/abs/1705.09655")],
  [["model-collapse"], paper("The Curse of Recursion: Training on Generated Data Makes Models Forget", "https://arxiv.org/abs/2305.17493")],
  [["token-efficiency"], paper("Lost in the Middle: How Language Models Use Long Contexts", "https://arxiv.org/abs/2307.03172")],
  [["language-model-confidence"], paper("Language Models (Mostly) Know What They Know", "https://arxiv.org/abs/2207.05221")],
  [["latent-reasoning"], paper("Training Large Language Models to Reason in a Continuous Latent Space", "https://arxiv.org/abs/2412.06769")],

  [["differentially-private-training"], documentation("TensorFlow Privacy: Differentially Private Machine Learning", "https://www.tensorflow.org/responsible_ai/privacy/guide")],
  [["machine-unlearning"], paper("Machine Unlearning", "https://arxiv.org/abs/1912.03817")],
  [["data-documentation"], paper("Datasheets for Datasets", "https://arxiv.org/abs/1803.09010")],
  [["training-reproducibility"], paper("Reproducibility in Machine Learning", "https://arxiv.org/abs/1807.03341")],
  [["training-audit-log"], standard("NIST Secure Software Development Framework", "https://csrc.nist.gov/pubs/sp/800/218/final")],

  [["out-of-memory-error"], documentation("PyTorch CUDA Semantics: Memory Management", "https://pytorch.org/docs/stable/notes/cuda.html#memory-management")],
  [["graceful-degradation"], documentation("Google SRE: Handling Overload", "https://sre.google/sre-book/handling-overload/")],
  [["deterministic-inference", "numerical-reproducibility"], documentation("PyTorch Reproducibility", "https://pytorch.org/docs/stable/notes/randomness.html")],
  [["inference-monitoring"], documentation("OpenTelemetry Generative AI Semantic Conventions", "https://opentelemetry.io/docs/specs/semconv/gen-ai/")],

  [["ontology"], standard("OWL 2 Web Ontology Language Document Overview", "https://www.w3.org/TR/owl2-overview/")],
  [["triple-store"], standard("RDF 1.1 Concepts and Abstract Syntax", "https://www.w3.org/TR/rdf11-concepts/")],
  [["sparql"], standard("SPARQL 1.1 Query Language", "https://www.w3.org/TR/sparql11-query/")],
  [["hybrid-rag"], paper("Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", "https://arxiv.org/abs/2005.11401")],
  [["knowledge-graph-embedding"], paper("Translating Embeddings for Modeling Multi-relational Data", "https://papers.nips.cc/paper/5071-translating-embeddings-for-modeling-multi-relational-data")],

  [["api-audit-log"], standard("NIST SP 800-92: Computer Security Log Management", "https://csrc.nist.gov/pubs/sp/800/92/final")],
  [["idempotency-key"], standard("The Idempotency-Key HTTP Header Field", "https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/")],
  [["api-error-model"], standard("RFC 9457: Problem Details for HTTP APIs", "https://www.rfc-editor.org/rfc/rfc9457")],
  [["api-version-pinning"], documentation("Microsoft REST API Guidelines", "https://github.com/microsoft/api-guidelines")],
  [["service-level-agreement"], documentation("Google SRE: Service Level Objectives", "https://sre.google/sre-book/service-level-objectives/")],

  [["agent-plan-quality", "agent-trace-evaluation"], paper("AgentBoard: An Analytical Evaluation Board of Multi-turn LLM Agents", "https://arxiv.org/abs/2401.13178")],
  [["agent-guardrail"], standard("NIST AI Risk Management Framework Generative AI Profile", "https://doi.org/10.6028/NIST.AI.600-1")],
  [["runaway-agent"], standard("OWASP Top 10 for LLM Applications", "https://genai.owasp.org/llm-top-10/")],
  [["agent-security"], standard("OWASP Agentic AI Threats and Mitigations", "https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/")],

  [["multimodal-evaluation"], paper("MMMU: A Massive Multi-discipline Multimodal Understanding and Reasoning Benchmark", "https://arxiv.org/abs/2311.16502")],
  [["visual-hallucination"], paper("Evaluating Object Hallucination in Large Vision-Language Models", "https://arxiv.org/abs/2305.10355")],
  [["multimodal-jailbreak"], paper("FigStep: Jailbreaking Large Vision-language Models via Typographic Visual Prompts", "https://arxiv.org/abs/2311.05608")],
  [["deepfake-detection"], paper("FaceForensics++: Learning to Detect Manipulated Facial Images", "https://arxiv.org/abs/1901.08971")],
  [["content-provenance"], standard("C2PA Technical Specification", "https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html")],

  [["statistical-significance", "effect-size"], book("NIST/SEMATECH e-Handbook of Statistical Methods", "https://www.itl.nist.gov/div898/handbook/")],
  [["evaluation-uncertainty", "bootstrap-confidence-interval"], book("NIST/SEMATECH e-Handbook: Bootstrap Methods", "https://www.itl.nist.gov/div898/handbook/eda/section3/eda362.htm")],
  [["reproducible-evaluation"], documentation("MLCommons Policies and Procedures", "https://github.com/mlcommons/policies")],

  [["safety-evaluation"], standard("NIST AI Risk Management Framework", "https://airc.nist.gov/airmf-resources/airmf/")],
  [["ai-incident-response"], standard("NIST SP 800-61: Computer Security Incident Handling", "https://csrc.nist.gov/pubs/sp/800/61/r2/final")],
  [["coordinated-vulnerability-disclosure"], standard("ISO/IEC 29147 Vulnerability Disclosure", "https://www.iso.org/standard/72311.html")],
  [["ai-security-monitoring"], documentation("NIST AI Research: Security and Resilience", "https://www.nist.gov/artificial-intelligence/ai-research-security-and-resilience")],
  [["defense-in-depth-for-ai"], standard("NIST Adversarial Machine Learning Taxonomy and Terminology", "https://csrc.nist.gov/pubs/ai/100/2/e2025/final")],

  [["shapley-additive-explanations"], paper("A Unified Approach to Interpreting Model Predictions", "https://arxiv.org/abs/1705.07874")],
  [["local-interpretable-model-agnostic-explanations"], paper("Why Should I Trust You? Explaining the Predictions of Any Classifier", "https://arxiv.org/abs/1602.04938")],
  [["concept-activation-vector"], paper("Interpretability Beyond Feature Attribution: Quantitative Testing with Concept Activation Vectors", "https://arxiv.org/abs/1711.11279")],
  [["probing-classifier"], paper("Linguistic Knowledge and Transferability of Contextual Representations", "https://arxiv.org/abs/1903.08855")],
  [["mechanistic-interpretability"], paper("A Mathematical Framework for Transformer Circuits", "https://transformer-circuits.pub/2021/framework/index.html")],

  [["ai-energy-consumption"], paper("Power Hungry Processing: Watts Driving the Cost of AI Deployment?", "https://arxiv.org/abs/2311.16863")],
  [["ai-carbon-footprint"], paper("Carbon Emissions and Large Neural Network Training", "https://arxiv.org/abs/2104.10350")],
  [["ai-water-footprint"], paper("Making AI Less Thirsty", "https://arxiv.org/abs/2304.03271")],
  [["total-cost-of-ownership-for-ai"], documentation("FinOps Framework", "https://www.finops.org/framework/")],
  [["model-commoditization"], paper("On the Opportunities and Risks of Foundation Models", "https://arxiv.org/abs/2108.07258")],
];

export const topicPrimarySources = {};
for (const [topicIds, source] of groups) {
  for (const topicId of topicIds) {
    if (topicPrimarySources[topicId]) throw new Error(`duplicate W18 primary source mapping: ${topicId}`);
    topicPrimarySources[topicId] = [source];
  }
}

if (Object.keys(topicPrimarySources).length !== 70) {
  throw new Error(`W18 primary source mapping must cover 70 topics, found ${Object.keys(topicPrimarySources).length}`);
}
