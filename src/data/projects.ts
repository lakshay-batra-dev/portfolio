export type ArchitectureNode = {
  id: string;
  label: string;
  detail: string;
};

export type Metric = {
  label: string;
  value: string;
};

export type StudySection = {
  id: string;
  title: string;
  paragraphs: string[];
  points?: string[];
  steps?: string[];
  metrics?: Metric[];
};

export type Project = {
  id: string;
  name: string;
  subtitle: string;
  summary: string;
  stack: string[];
  sections: StudySection[];
  architecture: ArchitectureNode[];
};

export const projects: Project[] = [
  {
    id: "intelliflow",
    name: "IntelliFlow",
    subtitle: "Enterprise Workflow Automation",
    summary:
      "Turns an unstructured client request into a project: classification, a generated workflow, matched people, and approval before anyone starts execution.",
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "FastAPI", "LangGraph"],
    architecture: [
      {
        id: "frontend",
        label: "React / TypeScript",
        detail:
          "Client, employee, and manager portals. The interface follows a project from the incoming request through approval and the rest of its lifecycle.",
      },
      {
        id: "api",
        label: "Express API",
        detail:
          "Node.js REST API, 40+ endpoints. It owns approval workflows, lifecycle triggers, dependency management, and cross-team aggregation. MongoDB, through Mongoose, stores that lifecycle.",
      },
      {
        id: "matching",
        label: "Resource matching",
        detail: "Scores people on skills, workload, and availability, then proposes who should take the work.",
      },
      {
        id: "ai",
        label: "FastAPI + LangGraph",
        detail:
          "A Python service classifies the request and generates the workflow. Pydantic validates the payload. Timeouts and fallbacks are part of the call, so a slow model does not stall the API.",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "IntelliFlow is a workflow platform for the gap between a client request and a staffed project. The request arrives unstructured. It has to be classified, broken into work, matched to people, and approved before execution.",
          "The product covers that path for client, employee, and manager portals, rather than stopping at a single form submission.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        paragraphs: [
          "The browser talks to an Express API. Classification and workflow generation sit in a separate Python service.",
        ],
      },
      {
        id: "workflow",
        title: "Workflow",
        paragraphs: ["Each request moves through the same sequence. Later stages do not start until the earlier decision exists."],
        steps: [
          "Client Request",
          "Classification",
          "Workflow Generation",
          "Resource Matching",
          "Approval",
          "Execution / Lifecycle",
        ],
      },
      {
        id: "engineering",
        title: "Engineering",
        paragraphs: [],
        points: [
          "The model call is a FastAPI service, not code inside the Express process. LangGraph runs classification and workflow generation. The API keeps timeouts and fallbacks so a failed generation does not take down the request.",
          "Matching is a score across skills, workload, and availability, not a lookup on a single tag.",
          "Approvals, lifecycle triggers, and dependency management live on the API, next to cross-team aggregation, so the portals read one project state.",
        ],
      },
      {
        id: "security",
        title: "Security",
        paragraphs: ["Access control sits on the API, beside validation of the model payload."],
        points: [
          "JWT",
          "bcrypt",
          "OTP-based 2FA",
          "CORS",
          "NoSQL injection sanitization",
          "XSS protection",
          "Rate limiting",
        ],
      },
      {
        id: "stack",
        title: "Technical stack",
        paragraphs: [
          "React and TypeScript are the portals. Node.js and Express are the API. MongoDB stores the project lifecycle. FastAPI and LangGraph classify the request and generate the workflow.",
        ],
        points: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "FastAPI", "LangGraph"],
      },
    ],
  },
  {
    id: "keystroke",
    name: "Keystroke Authentication System",
    subtitle: "Behavioral Biometric Authentication",
    summary:
      "Uses keystroke timing to separate a genuine user from an impostor. The useful question was not raw accuracy. It was whether an impostor was actually caught.",
    stack: ["Python", "scikit-learn", "XGBoost", "SVM"],
    architecture: [],
    sections: [
      {
        id: "problem",
        title: "Problem",
        paragraphs: [
          "A password proves that someone knows a secret. This system asks whether the typing itself matches the person who enrolled.",
          "It is a study of that classifier, not a production authentication system.",
        ],
      },
      {
        id: "features",
        title: "Feature engineering",
        paragraphs: [
          "Each sample becomes 31 timing features, including dwell and flight times. Features are engineered and standardized before a model sees them. Training and test splits stay independent. The set is 200+ samples per user, with a model fit per person rather than one global typist.",
        ],
      },
      {
        id: "baseline",
        title: "Baseline models",
        paragraphs: [
          "SVM, Random Forest, and XGBoost were trained on the same binary task: genuine user or impostor. The first scores looked strong on accuracy and weak on the class that matters.",
        ],
        metrics: [
          { label: "Accuracy", value: "98.18%" },
          { label: "Precision", value: "43.34%" },
          { label: "Recall", value: "19.32%" },
          { label: "F1", value: "0.227" },
        ],
      },
      {
        id: "threshold",
        title: "Threshold optimization",
        paragraphs: [
          "Accuracy alone was not enough for authentication. Impostor detection, and the precision/recall tradeoff, mattered. Moving the decision threshold caught more impostors and gave up raw accuracy.",
        ],
        metrics: [
          { label: "Accuracy", value: "91.53%" },
          { label: "Precision", value: "27.59%" },
          { label: "Recall", value: "53.92%" },
          { label: "F1", value: "0.298" },
        ],
      },
      {
        id: "per-user",
        title: "Per-user models",
        paragraphs: [
          "A single threshold still treated every typist as the same problem. Fitting the model per user raised the F1, because each person's timing distribution is its own.",
        ],
        metrics: [{ label: "F1", value: "0.664" }],
      },
      {
        id: "ensemble",
        title: "Ensemble / stacking",
        paragraphs: [
          "The last step stacks the per-user models instead of picking one algorithm. That was the operating point kept for the study.",
        ],
        metrics: [{ label: "F1", value: "0.733" }],
      },
      {
        id: "results",
        title: "Results",
        paragraphs: [
          "F1 moved from 0.227 on the baseline to 0.733 on the stacked per-user models. Accuracy alone was not enough for authentication. Impostor detection, and the precision/recall tradeoff, mattered.",
          "These figures describe the study. They are not a claim that the system is ready to authenticate anyone in production.",
        ],
      },
    ],
  },
];
