import assert from "node:assert/strict";
import { test } from "node:test";
import { experience } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";

test("portfolio content matches the published profile", () => {
  assert.equal(projects.length, 2);
  assert.deepEqual(
    projects.map((project) => project.id),
    ["intelliflow", "keystroke"],
  );
  assert.equal(profile.education[0]?.title, "B.Tech — Computer Engineering");
  assert.equal(profile.education[0]?.result, "CGPA: 7.58 / 10");
  assert.equal(profile.education[0]?.years, "2023 — 2027");
  assert.equal(profile.education[1]?.title, "Class XII — CBSE");
  assert.equal(profile.education[1]?.years, "2023");
  assert.equal(profile.education[1]?.result, "Percentage: 92%");
  assert.equal(profile.education[2]?.title, "Class X — CBSE");
  assert.equal(profile.education[2]?.years, "2021");
  assert.equal(profile.education[2]?.result, "Percentage: 94.6%");
  assert.equal(profile.intro.includes("IntelliFlow"), false);
  assert.equal(experience.length, 1);
  assert.equal(experience[0]?.role, "Research Intern");
  assert.equal(experience[0]?.focus.includes("Sleep Apnea"), true);

  const intelliflow = projects[0];
  const keystroke = projects[1];
  assert.equal(intelliflow?.subtitle, "Enterprise Workflow Automation");
  assert.equal(keystroke?.subtitle, "Behavioral Biometric Authentication");
  assert.match(JSON.stringify(intelliflow), /LangGraph/);
  assert.match(JSON.stringify(intelliflow), /40\+/);
  assert.match(JSON.stringify(keystroke), /0\.733/);
  assert.match(JSON.stringify(keystroke), /31 timing features/);
  assert.equal(JSON.stringify(keystroke).includes("production authentication system"), true);

  const blob = JSON.stringify({ profile, projects, experience, skillGroups });
  assert.equal(blob.includes("Computer Science"), false);
  assert.equal(blob.includes("7.70"), false);
  assert.equal(blob.includes("7.58 / 10"), true);
  assert.equal(blob.includes("Campus leadership"), false);

  for (const group of skillGroups) {
    for (const skill of group.skills) {
      for (const projectId of skill.projects) {
        assert.ok(projects.some((project) => project.id === projectId));
      }
    }
  }
});
