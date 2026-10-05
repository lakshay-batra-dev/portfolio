export type ExperienceEntry = {
  id: string;
  role: string;
  org: string;
  place: string;
  dates: string;
  points: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "tiet-research",
    role: "Research Intern",
    org: "Thapar Institute of Engineering and Technology",
    place: "Patiala, India",
    dates: "Jun 2025 – Jul 2025",
    points: [
      "Built a modular asynchronous ingestion and preprocessing pipeline for physiological signal datasets, with feature extraction separated from model training.",
      "Extracted RR intervals and 8+ respiratory features from ECG-derived respiration, and checked signal quality on PhysioNet data before training.",
      "Trained an SVM, Random Forest, and LSTM ensemble for apnea event prediction. Test accuracy was 95%. False positives fell by 15%.",
      "Wrote ETL-style modules for the PTB-XL and MIT-BIH datasets. That removed 20+ hours a week of manual preprocessing.",
    ],
  },
];
