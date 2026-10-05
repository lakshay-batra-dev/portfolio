import assert from "node:assert/strict";
import { test } from "node:test";
import { experience } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";

test("portfolio content stays inside the resume", () => {
  assert.equal(projects.length, 2);
  assert.deepEqual(
    projects.map((project) => project.id),
    ["intelliflow", "keystroke"],
  );
  assert.equal(profile.education.degree, "B.Tech Computer Engineering");
  assert.equal(profile.education.school, "Thapar Institute of Engineering and Technology");
  assert.equal(profile.education.years, "2023–2027");
  assert.equal(profile.resumePath, "/Lakshay_Batra_CV%20(fixed).pdf");
  assert.equal(experience.length, 1);
  assert.equal(experience[0]?.role, "Research Intern");

  const intelliflow = JSON.stringify(projects[0]);
  const keystroke = JSON.stringify(projects[1]);
  assert.match(intelliflow, /LangGraph/);
  assert.match(intelliflow, /FastAPI/);
  assert.match(keystroke, /94%/);
  assert.match(keystroke, /400/);
  assert.match(keystroke, /31 keystroke-timing features/);

  const blob = JSON.stringify({ projects, experience, skillGroups });
  assert.equal(blob.includes("Computer Science"), false);
  assert.equal(blob.includes("40+"), false);
  assert.equal(blob.includes("200+"), false);
  assert.equal(blob.includes("%"), true);

  for (const group of skillGroups) {
    for (const skill of group.skills) {
      for (const projectId of skill.projects) {
        assert.ok(projects.some((project) => project.id === projectId));
      }
    }
  }
});
