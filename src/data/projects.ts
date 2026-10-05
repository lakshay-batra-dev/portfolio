export type ArchitectureNode = {
  id: string;
  label: string;
  detail: string;
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  technologies: string[];
  overview: string;
  problem: string;
  architecture: ArchitectureNode[];
  implementation: string[];
  decisions: string[];
  results?: string[];
};

export const projects: Project[] = [
  {
    id: "intelliflow",
    name: "IntelliFlow",
    summary: "An agentic workflow platform that turns a client request into a structured project.",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "FastAPI",
      "LangGraph",
      "Groq",
      "Pydantic",
      "JWT",
      "bcrypt",
    ],
    overview:
      "IntelliFlow converts a client request into a structured project through AI classification, a dynamic task breakdown, employee matching, and approval workflows. The product has client, employee, and manager portals that follow the project through its lifecycle.",
    problem:
      "A client request arrives unstructured. Someone still has to classify it, break it into tasks, match it to available people, and get it approved before work starts.",
    architecture: [
      {
        id: "portals",
        label: "Portals",
        detail:
          "React and TypeScript. Separate client, employee, and manager portals across the project lifecycle.",
      },
      {
        id: "api",
        label: "Express API",
        detail: "Node.js and Express REST API. MongoDB, through Mongoose, stores the project lifecycle.",
      },
      {
        id: "matching",
        label: "Matching",
        detail: "Scores employees on skills, workload, availability, and department.",
      },
      {
        id: "auth",
        label: "Auth",
        detail:
          "JWT sessions, bcrypt password hashing, OTP-based two-factor authentication, rate limiting, and security middleware.",
      },
      {
        id: "ai",
        label: "FastAPI service",
        detail:
          "Python microservice. LangGraph and Groq classify the request and generate the workflow. Pydantic validates the payload. The call has timeouts and fallbacks.",
      },
    ],
    implementation: [
      "React and TypeScript frontend with Node.js, Express, MongoDB, and Mongoose.",
      "Client, employee, and manager portals across the project lifecycle.",
      "Python FastAPI service using LangGraph and Groq for request classification and workflow generation, with Pydantic validation, timeouts, and fallbacks.",
      "Employee matching from skills, workload, availability, and department.",
      "JWT, bcrypt, OTP-based two-factor authentication, rate limiting, and security middleware.",
    ],
    decisions: [
      "Classification and workflow generation live in a Python FastAPI service, separate from the Express API. Timeouts and fallbacks are part of that call.",
      "Matching is a score across skills, workload, availability, and department, not a single tag lookup.",
      "Authentication is JWT plus bcrypt, with OTP as a second factor, and rate limiting on the API.",
    ],
  },
  {
    id: "keystroke",
    name: "Keystroke Authentication System",
    summary: "A behavioral biometric check that tells a genuine user from an impostor by how they type.",
    technologies: ["Python", "Scikit-learn", "XGBoost", "SVM", "Random Forest"],
    overview:
      "The system authenticates a person from 31 keystroke-timing features. It is a binary check: genuine user or impostor.",
    problem:
      "A password only proves that someone knows a secret. This system asks whether the typing itself matches the person who enrolled.",
    architecture: [
      {
        id: "samples",
        label: "Samples",
        detail: "400 typing samples per user. Training and test splits are kept independent.",
      },
      {
        id: "features",
        label: "31 timing features",
        detail: "Keystroke-timing features from how a person types. They are engineered and standardized before a model sees them.",
      },
      {
        id: "models",
        label: "Models",
        detail: "XGBoost, SVM, Random Forest, and an ensemble, compared on the same binary authentication task.",
      },
      {
        id: "threshold",
        label: "Threshold",
        detail:
          "Hyperparameters and the decision threshold are tuned. The reported result is 94% accuracy separating genuine users from impostors.",
      },
    ],
    implementation: [
      "31 keystroke-timing features used to authenticate users from typing patterns.",
      "XGBoost, SVM, Random Forest, and an ensemble benchmarked for binary authentication.",
      "Pipeline over 400 typing samples per user, with feature engineering, standardization, and independent training and test splits.",
      "Hyperparameter tuning and threshold optimization.",
    ],
    decisions: [
      "More than one model was trained. XGBoost, SVM, Random Forest, and an ensemble were compared on the same task.",
      "Features are standardized, and the test split stays independent of training.",
      "The operating point is a tuned threshold, not a default cutoff.",
    ],
    results: ["94% accuracy distinguishing genuine users from impostors."],
  },
];
