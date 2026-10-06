export type Skill = {
  name: string;
  projects: string[];
  also?: string[];
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "C++", projects: [] },
      { name: "Python", projects: ["intelliflow", "keystroke"], also: ["Research"] },
      { name: "JavaScript", projects: ["intelliflow"] },
      { name: "TypeScript", projects: ["intelliflow"] },
      { name: "SQL", projects: [] },
      { name: "HTML", projects: [] },
      { name: "CSS", projects: [] },
    ],
  },
  {
    id: "web",
    label: "Web / Backend",
    skills: [
      { name: "React.js", projects: ["intelliflow"] },
      { name: "Node.js", projects: ["intelliflow"] },
      { name: "Express.js", projects: ["intelliflow"] },
      { name: "Tailwind CSS", projects: [] },
      { name: "REST APIs", projects: ["intelliflow"] },
    ],
  },
  {
    id: "ml",
    label: "Data / ML",
    skills: [
      { name: "scikit-learn", projects: ["keystroke"] },
      { name: "XGBoost", projects: ["keystroke"] },
      { name: "SVM", projects: ["keystroke"], also: ["Research"] },
      { name: "Random Forest", projects: ["keystroke"], also: ["Research"] },
      { name: "LangGraph", projects: ["intelliflow"] },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    skills: [
      { name: "MongoDB", projects: ["intelliflow"] },
      { name: "MySQL", projects: [] },
    ],
  },
  {
    id: "core",
    label: "Core",
    skills: [
      { name: "DSA", projects: [] },
      { name: "OOP", projects: [] },
      { name: "DBMS", projects: [] },
      { name: "Operating Systems", projects: [] },
      { name: "Computer Networks", projects: [] },
    ],
  },
];
