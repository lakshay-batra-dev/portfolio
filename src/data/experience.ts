export type ExperienceEntry = {
  id: string;
  role: string;
  org: string;
  place: string;
  dates: string;
  focus: string;
  pipeline: string[];
  points: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "tiet-research",
    role: "Research Intern",
    org: "Thapar Institute of Engineering and Technology",
    place: "Patiala, India",
    dates: "Jun 2025 — Jul 2025",
    focus: "Physiological Signal Processing / Sleep Apnea Detection",
    pipeline: [
      "Dataset",
      "Ingestion",
      "Preprocessing",
      "Signal quality",
      "Feature extraction",
      "ML models",
      "Apnea prediction",
    ],
    points: [
      "Engineered a modular asynchronous ingestion and preprocessing pipeline for large-scale physiological signal datasets, separating feature extraction from model training.",
      "Extracted RR intervals and 8+ respiratory features from ECG-derived respiration signals and performed signal-quality analysis on PhysioNet data before training.",
      "Built an SVM + Random Forest + LSTM ensemble for apnea-event prediction, reaching 95% test accuracy and reducing false positives by 15%.",
      "Built reusable ETL-style processing modules for PTB-XL and MIT-BIH datasets, eliminating 20+ hours/week of manual preprocessing.",
    ],
  },
];
