export type Skill = {
  name: string;
  projects: string[];
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", projects: ["intelliflow"] },
      { name: "TypeScript", projects: ["intelliflow"] },
      { name: "JavaScript", projects: ["intelliflow"] },
      { name: "HTML", projects: [] },
      { name: "CSS", projects: [] },
      { name: "Tailwind CSS", projects: [] },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", projects: ["intelliflow"] },
      { name: "Express", projects: ["intelliflow"] },
      { name: "FastAPI", projects: ["intelliflow"] },
      { name: "REST APIs", projects: ["intelliflow"] },
    ],
  },
  {
    id: "data",
    label: "Databases",
    skills: [
      { name: "MongoDB", projects: ["intelliflow"] },
      { name: "SQL", projects: [] },
    ],
  },
  {
    id: "ml",
    label: "AI / ML",
    skills: [
      { name: "Python", projects: ["intelliflow", "keystroke"] },
      { name: "LangGraph", projects: ["intelliflow"] },
      { name: "Scikit-learn", projects: ["keystroke"] },
      { name: "XGBoost", projects: ["keystroke"] },
      { name: "SVM", projects: ["keystroke"] },
    ],
  },
  {
    id: "core",
    label: "Core",
    skills: [
      { name: "C++", projects: [] },
      { name: "DSA", projects: [] },
      { name: "OOP", projects: [] },
      { name: "DBMS", projects: [] },
      { name: "Operating Systems", projects: [] },
    ],
  },
];
