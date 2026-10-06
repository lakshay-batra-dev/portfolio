export type EducationEntry = {
  id: string;
  title: string;
  school: string;
  place: string;
  years: string;
  resultLabel?: string;
  result: string;
};

export const education: EducationEntry[] = [
  {
    id: "btech",
    title: "B.Tech — Computer Engineering",
    school: "Thapar Institute of Engineering and Technology",
    place: "Patiala, India",
    years: "2023 — 2027",
    resultLabel: "CGPA",
    result: "7.58 / 10",
  },
  {
    id: "xii",
    title: "Class XII — CBSE",
    school: "Scholars Rosary Sr. Sec. School",
    place: "Rohtak, India",
    years: "2022 — 2023",
    result: "92%",
  },
  {
    id: "x",
    title: "Class X — CBSE",
    school: "Scholars Rosary Sr. Sec. School",
    place: "Rohtak, India",
    years: "2020 — 2021",
    result: "94.6%",
  },
];

export function educationDocument(): string {
  const records = education.map((entry) =>
    [entry.title, entry.school, entry.place, entry.years, entry.resultLabel ? `${entry.resultLabel}: ${entry.result}` : entry.result].join("\n"),
  );
  return ["EDUCATION", "", records.join("\n\n")].join("\n");
}
