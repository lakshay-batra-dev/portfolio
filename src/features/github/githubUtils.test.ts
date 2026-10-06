import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePublicRepos } from "./githubUtils";

test("public repo parsing drops forks and incomplete records", () => {
  const repos = parsePublicRepos([
    {
      id: 1,
      name: "ResearchX",
      description: "signals",
      language: "Python",
      html_url: "https://github.com/DROP5136/ResearchX",
      updated_at: "2026-01-02T00:00:00Z",
      fork: false,
    },
    { id: 2, name: "forked", html_url: "https://github.com/DROP5136/forked", fork: true },
    { name: "missing-url" },
    null,
  ]);

  assert.deepEqual(repos, [
    {
      id: 1,
      name: "ResearchX",
      description: "signals",
      language: "Python",
      url: "https://github.com/DROP5136/ResearchX",
      updated: "2026-01-02",
    },
  ]);
  assert.equal(parsePublicRepos({ message: "rate limit" }), null);
});
