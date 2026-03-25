export type TaskStatus = "todo" | "inprogress" | "done";

export interface Task {
  id: string;
  text: string;
  type: "read" | "code" | "check" | "watch" | "install";
}

export interface Week {
  id: string;
  weekNum: string; // e.g. "1–2"
  phaseId: string;
  focus: string;
  description: string;
  tasks: Task[];
}

export interface Phase {
  id: string;
  number: number;
  title: string;
  weeks: string; // display string
  color: string; // tailwind class base name
  accentHex: string;
  bgHex: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  sublabel?: string;
  phaseId: string;
  dependsOn: string[]; // node ids
  weekIds: string[]; // which weeks contribute to this node
  x?: number;
  y?: number;
}

// ─── PHASES ──────────────────────────────────────────────────────────────────

export const PHASES: Phase[] = [
  {
    id: "p1",
    number: 1,
    title: "Math Foundations",
    weeks: "Weeks 1–6 · April",
    color: "amber",
    accentHex: "#f5a623",
    bgHex: "#3a220a",
  },
  {
    id: "p2",
    number: 2,
    title: "Machine Learning",
    weeks: "Weeks 7–11 · May",
    color: "sage",
    accentHex: "#7eb89a",
    bgHex: "#0a160f",
  },
  {
    id: "p3",
    number: 3,
    title: "RL + Autonomous Systems",
    weeks: "Weeks 12–16 · Jun–Jul",
    color: "blue",
    accentHex: "#60a5fa",
    bgHex: "#0c1a2e",
  },
  {
    id: "p4",
    number: 4,
    title: "NLI + Symbolic Reasoning",
    weeks: "Weeks 17–20 · Jul–Aug",
    color: "coral",
    accentHex: "#e8755a",
    bgHex: "#2a100a",
  },
  {
    id: "p5",
    number: 5,
    title: "Review & Consolidation",
    weeks: "Weeks 21–22 · August",
    color: "ink",
    accentHex: "#8a8da6",
    bgHex: "#1a1d2e",
  },
];

// ─── WEEKS ───────────────────────────────────────────────────────────────────

export const WEEKS: Week[] = [
  // PHASE 1
  {
    id: "w1",
    weekNum: "1–2",
    phaseId: "p1",
    focus: "Linear Algebra",
    description:
      "Vectors, matrix multiplication, eigenvectors — the backbone of every ML algorithm.",
    tasks: [
      { id: "w1t1", text: "Watch 3Blue1Brown: Essence of Linear Algebra (all 15 episodes)", type: "watch" },
      { id: "w1t2", text: "Take notes by hand — reproduce key ideas (vectors, span, dot product, determinants)", type: "read" },
      { id: "w1t3", text: "Implement matrix multiplication from scratch in Python (no numpy)", type: "code" },
      { id: "w1t4", text: "Verify result with numpy.matmul", type: "code" },
      { id: "w1t5", text: "Compute eigenvectors of a 2×2 matrix by hand", type: "check" },
      { id: "w1t6", text: "Verify with numpy.linalg.eig", type: "code" },
      { id: "w1t7", text: "Self-check: explain eigenvectors geometrically without using the formula", type: "check" },
    ],
  },
  {
    id: "w2",
    weekNum: "3–4",
    phaseId: "p1",
    focus: "Calculus + Probability",
    description:
      "Gradients power ML optimisation; probability is the language of uncertainty in every course.",
    tasks: [
      { id: "w2t1", text: "Watch 3Blue1Brown: Essence of Calculus (all 12 episodes)", type: "watch" },
      { id: "w2t2", text: "Focus: chain rule and partial derivatives — rewrite proofs by hand", type: "read" },
      { id: "w2t3", text: "Khan Academy: Probability & Statistics — complete the full unit", type: "watch" },
      { id: "w2t4", text: "StatQuest: watch episodes on Gaussian distribution and Bayes' theorem", type: "watch" },
      { id: "w2t5", text: "Self-check: derive gradient of f(x,y) = x² + 3xy by hand", type: "check" },
      { id: "w2t6", text: "Self-check: apply Bayes' theorem to a medical test problem from scratch", type: "check" },
    ],
  },
  {
    id: "w3",
    weekNum: "5–6",
    phaseId: "p1",
    focus: "Logic + Python Setup",
    description:
      "First-order logic for Symbolic Reasoning; Python environment for everything else.",
    tasks: [
      { id: "w3t1", text: "Work through Stanford logic.stanford.edu: propositional logic unit", type: "read" },
      { id: "w3t2", text: "Study first-order logic: predicates, quantifiers, resolution proofs", type: "read" },
      { id: "w3t3", text: "Install Python 3.11+, virtualenv, Jupyter, numpy, matplotlib, scikit-learn", type: "install" },
      { id: "w3t4", text: "Complete 10 exercises from numpy-100 (github.com/rougier/numpy-100)", type: "code" },
      { id: "w3t5", text: "Install clingo (ASP solver): pip install clingo", type: "install" },
      { id: "w3t6", text: "Self-check: write truth table for (A→B)∧¬B→¬A", type: "check" },
      { id: "w3t7", text: "Self-check: translate 'Every student who studies passes' into FOL", type: "check" },
    ],
  },

  // PHASE 2
  {
    id: "w4",
    weekNum: "7–8",
    phaseId: "p2",
    focus: "Linear Models + Optimisation",
    description:
      "The theory core of ML: loss functions, gradient descent, regularisation.",
    tasks: [
      { id: "w4t1", text: "Read Hardt & Recht — Patterns, Predictions, Actions: Ch. 1–3 (mlstory.org, free)", type: "read" },
      { id: "w4t2", text: "Study: loss functions, bias-variance tradeoff, L1/L2 regularisation", type: "read" },
      { id: "w4t3", text: "Implement linear regression from scratch in numpy — no scikit-learn", type: "code" },
      { id: "w4t4", text: "Implement gradient descent manually; track loss per epoch", type: "code" },
      { id: "w4t5", text: "Plot training loss curve with matplotlib", type: "code" },
      { id: "w4t6", text: "Self-check: write the gradient descent update rule from memory and explain every symbol", type: "check" },
    ],
  },
  {
    id: "w5",
    weekNum: "9–10",
    phaseId: "p2",
    focus: "Supervised Learning",
    description:
      "Core algorithms: logistic regression, trees, SVMs, kNN.",
    tasks: [
      { id: "w5t1", text: "Study: logistic regression — sigmoid function and cross-entropy loss", type: "read" },
      { id: "w5t2", text: "Study: decision trees — entropy, information gain, splitting criteria", type: "read" },
      { id: "w5t3", text: "Study: SVMs — margin maximisation intuition (not full proof)", type: "read" },
      { id: "w5t4", text: "Implement logistic regression from scratch (numpy only) on Iris dataset", type: "code" },
      { id: "w5t5", text: "Build a random forest with scikit-learn; tune max_depth and n_estimators", type: "code" },
      { id: "w5t6", text: "Use cross_val_score, train_test_split, classification_report correctly", type: "code" },
    ],
  },
  {
    id: "w6",
    weekNum: "11",
    phaseId: "p2",
    focus: "Unsupervised + Deep Learning Intro",
    description:
      "k-means, PCA, and a first look at neural networks.",
    tasks: [
      { id: "w6t1", text: "Study: k-means — objective function, convergence, sensitivity to initialisation", type: "read" },
      { id: "w6t2", text: "Study: PCA — eigenvectors of covariance matrix, explained variance ratio", type: "read" },
      { id: "w6t3", text: "Implement k-means from scratch; visualise cluster assignments", type: "code" },
      { id: "w6t4", text: "Run PCA on sklearn's fetch_olivetti_faces; visualise top 8 components", type: "code" },
      { id: "w6t5", text: "Build a 2-layer neural network in numpy (forward pass only)", type: "code" },
      { id: "w6t6", text: "Self-check: explain what PCA is doing geometrically", type: "check" },
    ],
  },

  // PHASE 3
  {
    id: "w7",
    weekNum: "12–13",
    phaseId: "p3",
    focus: "MDPs — the Shared Core",
    description:
      "The Bellman equation and value functions underpin both RL and Autonomous Systems.",
    tasks: [
      { id: "w7t1", text: "Read Sutton & Barto Ch. 1–3 (incompleteideas.net — free PDF)", type: "read" },
      { id: "w7t2", text: "Read Sutton & Barto Ch. 4: Dynamic Programming (Value + Policy Iteration)", type: "read" },
      { id: "w7t3", text: "Read Russell & Norvig Ch. 3: Search in State Spaces (BFS, DFS, UCS)", type: "read" },
      { id: "w7t4", text: "Read Russell & Norvig Ch. 4: Informed Search (A*, heuristics)", type: "read" },
      { id: "w7t5", text: "Install Gymnasium: pip install gymnasium", type: "install" },
      { id: "w7t6", text: "Run a random agent on FrozenLake-v1; observe reward distribution", type: "code" },
      { id: "w7t7", text: "Implement Value Iteration from scratch on FrozenLake (no RL libraries)", type: "code" },
      { id: "w7t8", text: "Implement BFS and A* on a grid graph from scratch", type: "code" },
      { id: "w7t9", text: "Self-check: write Bellman equation for Q(s,a) from memory", type: "check" },
    ],
  },
  {
    id: "w8",
    weekNum: "14–15",
    phaseId: "p3",
    focus: "RL Algorithms + Classical Planning",
    description:
      "Monte Carlo, TD-learning, Q-learning, and STRIPS planning.",
    tasks: [
      { id: "w8t1", text: "Read Sutton & Barto Ch. 5: Monte Carlo Methods", type: "read" },
      { id: "w8t2", text: "Read Sutton & Barto Ch. 6: TD Learning — Q-learning and SARSA", type: "read" },
      { id: "w8t3", text: "Read Russell & Norvig Ch. 10: Classical Planning (STRIPS, PDDL)", type: "read" },
      { id: "w8t4", text: "Implement Q-learning from scratch on CartPole-v1 (Gymnasium)", type: "code" },
      { id: "w8t5", text: "Implement a finite-state machine (FSM) — NPC that patrols, chases, attacks", type: "code" },
      { id: "w8t6", text: "Code a basic STRIPS planner for Blocks World problem", type: "code" },
      { id: "w8t7", text: "Self-check: explain on-policy (SARSA) vs off-policy (Q-learning) in plain English", type: "check" },
    ],
  },
  {
    id: "w9",
    weekNum: "16",
    phaseId: "p3",
    focus: "Multi-agent + Game Theory",
    description:
      "Nash equilibrium and the fundamentals of multi-agent systems.",
    tasks: [
      { id: "w9t1", text: "Read Shoham & Leyton-Brown Ch. 3: Normal Form Games (free PDF online)", type: "read" },
      { id: "w9t2", text: "Study: Nash equilibrium — definition, Prisoner's Dilemma, zero-sum games", type: "read" },
      { id: "w9t3", text: "Watch a 15-min YouTube explainer on Nash equilibrium", type: "watch" },
      { id: "w9t4", text: "Self-check: define Nash equilibrium and give a concrete example", type: "check" },
      { id: "w9t5", text: "Self-check: describe what A* does that BFS doesn't", type: "check" },
    ],
  },

  // PHASE 4
  {
    id: "w10",
    weekNum: "17–18",
    phaseId: "p4",
    focus: "Symbolic Reasoning + ASP",
    description:
      "Answer Set Programming — declarative, constraint-based problem solving.",
    tasks: [
      { id: "w10t1", text: "Work through Potassco Guide Ch. 1: Facts, rules, constraints (potassco.org)", type: "read" },
      { id: "w10t2", text: "Work through Potassco Guide Ch. 2: Choice rules and aggregates", type: "read" },
      { id: "w10t3", text: "Work through Potassco Guide Ch. 3: Optimisation with weak constraints", type: "read" },
      { id: "w10t4", text: "Read Gebser et al. — Answer Set Solving in Practice, Ch. 1–2 (free PDF)", type: "read" },
      { id: "w10t5", text: "Solve graph coloring in ASP (classic intro problem) using clingo", type: "code" },
      { id: "w10t6", text: "Solve N-Queens problem in ASP using clingo", type: "code" },
      { id: "w10t7", text: "Solve a robot planning problem in ASP (rooms + objects)", type: "code" },
      { id: "w10t8", text: "Run one inductive learning example in ILASP (available online)", type: "code" },
    ],
  },
  {
    id: "w11",
    weekNum: "19–20",
    phaseId: "p4",
    focus: "Natural Language Interaction",
    description:
      "Dialogue systems, parsing, language generation — and the tooling for your group project.",
    tasks: [
      { id: "w11t1", text: "Read Goldberg — Neural Network Methods in NLP, Ch. 1–4 (skim)", type: "read" },
      { id: "w11t2", text: "Read Wikipedia: Dialogue systems, Speech act theory, Intent detection", type: "read" },
      { id: "w11t3", text: "Skim Rasa Open Source docs to understand dialogue framework architecture", type: "read" },
      { id: "w11t4", text: "Install HuggingFace Transformers: pip install transformers", type: "install" },
      { id: "w11t5", text: "Run pre-trained sentiment analysis on 20 sentences; inspect output", type: "code" },
      { id: "w11t6", text: "Run pre-trained NER model; understand entity types returned", type: "code" },
      { id: "w11t7", text: "Install NLTK; tokenise, POS-tag, and parse a paragraph", type: "code" },
      { id: "w11t8", text: "Explore one open-source chatbot (ChatterBot or Rasa) — just run it", type: "code" },
    ],
  },

  // PHASE 5
  {
    id: "w12",
    weekNum: "21",
    phaseId: "p5",
    focus: "ML Review",
    description:
      "Re-implement from scratch — without notes. This reveals what you truly know.",
    tasks: [
      { id: "w12t1", text: "Implement linear regression from scratch — no notes, no previous code", type: "code" },
      { id: "w12t2", text: "Implement logistic regression from scratch — no notes", type: "code" },
      { id: "w12t3", text: "Derive gradient of cross-entropy loss with respect to weights on paper", type: "check" },
      { id: "w12t4", text: "Revisit any probability topics that felt shaky", type: "read" },
      { id: "w12t5", text: "Review numpy code from Phase 1 — can you still do it fluently?", type: "check" },
    ],
  },
  {
    id: "w13",
    weekNum: "22",
    phaseId: "p5",
    focus: "RL + Symbolic Review",
    description:
      "Final consolidation — tackle a new RL environment and a fresh ASP problem.",
    tasks: [
      { id: "w13t1", text: "Implement Q-learning from memory on MountainCar-v0 (not CartPole)", type: "code" },
      { id: "w13t2", text: "Solve Sudoku in ASP (solutions available online to check against)", type: "code" },
      { id: "w13t3", text: "Re-read all 5 course syllabi; identify any topic not yet touched", type: "read" },
      { id: "w13t4", text: "Write a 1-page summary of each course from memory — no notes", type: "check" },
      { id: "w13t5", text: "Final self-assessment: rate confidence 1–5 for each phase", type: "check" },
    ],
  },
];

// ─── KNOWLEDGE TREE NODES ─────────────────────────────────────────────────────

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // Tier 0 — roots
  { id: "kn-linalg", label: "Linear Algebra", sublabel: "vectors, matrices, eigen", phaseId: "p1", dependsOn: [], weekIds: ["w1"] },
  { id: "kn-calc", label: "Calculus", sublabel: "gradients, chain rule", phaseId: "p1", dependsOn: [], weekIds: ["w2"] },
  { id: "kn-prob", label: "Probability", sublabel: "Bayes, distributions", phaseId: "p1", dependsOn: [], weekIds: ["w2"] },
  { id: "kn-logic", label: "Formal Logic", sublabel: "FOL, resolution", phaseId: "p1", dependsOn: [], weekIds: ["w3"] },
  { id: "kn-python", label: "Python + numpy", sublabel: "coding environment", phaseId: "p1", dependsOn: [], weekIds: ["w3"] },

  // Tier 1 — ML
  { id: "kn-optim", label: "Optimisation", sublabel: "gradient descent", phaseId: "p2", dependsOn: ["kn-calc", "kn-linalg"], weekIds: ["w4"] },
  { id: "kn-linmod", label: "Linear Models", sublabel: "regression, regularisation", phaseId: "p2", dependsOn: ["kn-linalg", "kn-calc"], weekIds: ["w4"] },
  { id: "kn-supervised", label: "Supervised Learning", sublabel: "trees, SVMs, logistic", phaseId: "p2", dependsOn: ["kn-linmod", "kn-prob", "kn-optim"], weekIds: ["w5"] },
  { id: "kn-unsupervised", label: "Unsupervised Learning", sublabel: "k-means, PCA", phaseId: "p2", dependsOn: ["kn-linalg", "kn-prob"], weekIds: ["w6"] },
  { id: "kn-nn", label: "Neural Networks", sublabel: "layers, activations", phaseId: "p2", dependsOn: ["kn-linmod", "kn-optim"], weekIds: ["w6"] },

  // Tier 2 — RL / Autonomous
  { id: "kn-mdp", label: "MDPs", sublabel: "states, Bellman, V/Q", phaseId: "p3", dependsOn: ["kn-prob", "kn-optim"], weekIds: ["w7"] },
  { id: "kn-search", label: "Heuristic Search", sublabel: "A*, BFS, LRTA*", phaseId: "p3", dependsOn: ["kn-logic", "kn-python"], weekIds: ["w7"] },
  { id: "kn-rl", label: "RL Algorithms", sublabel: "Q-learning, TD, MC", phaseId: "p3", dependsOn: ["kn-mdp", "kn-nn"], weekIds: ["w8"] },
  { id: "kn-planning", label: "Classical Planning", sublabel: "STRIPS, PDDL, FSM", phaseId: "p3", dependsOn: ["kn-search", "kn-logic"], weekIds: ["w8"] },
  { id: "kn-gametheory", label: "Game Theory", sublabel: "Nash, multi-agent", phaseId: "p3", dependsOn: ["kn-prob", "kn-mdp"], weekIds: ["w9"] },

  // Tier 3 — NLI / Symbolic
  { id: "kn-asp", label: "Answer Set Prog.", sublabel: "clingo, stable models", phaseId: "p4", dependsOn: ["kn-logic", "kn-planning"], weekIds: ["w10"] },
  { id: "kn-nlp", label: "NLP Foundations", sublabel: "tokens, embeddings, parse", phaseId: "p4", dependsOn: ["kn-linalg", "kn-prob"], weekIds: ["w11"] },
  { id: "kn-dialogue", label: "Dialogue Systems", sublabel: "intent, state, generation", phaseId: "p4", dependsOn: ["kn-nlp", "kn-nn"], weekIds: ["w11"] },

  // Tier 4 — synthesis
  { id: "kn-deeprl", label: "Deep RL", sublabel: "policy gradient, DQN", phaseId: "p3", dependsOn: ["kn-rl", "kn-nn"], weekIds: ["w8"] },
  { id: "kn-multiagent", label: "Multi-agent Systems", sublabel: "coordination, planning", phaseId: "p3", dependsOn: ["kn-gametheory", "kn-planning"], weekIds: ["w9"] },
];

// Helper: get phase by id
export const getPhase = (id: string) => PHASES.find((p) => p.id === id)!;

// Helper: get all task ids
export const allTaskIds = (): string[] =>
  WEEKS.flatMap((w) => w.tasks.map((t) => t.id));

// Helper: total tasks in a week
export const weekTaskCount = (weekId: string) =>
  WEEKS.find((w) => w.id === weekId)?.tasks.length ?? 0;
