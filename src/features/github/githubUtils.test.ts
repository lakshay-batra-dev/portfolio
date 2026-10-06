import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePinnedPayload, parsePinnedProfile } from "./githubUtils";

const profile = `
<div>Popular <a href="/DROP5136/not-pinned"><span class="repo">not-pinned</span></a></div>
<ol class="js-pinned-items-reorder-list">
  <li class="js-pinned-item-list-item public fork">
    <a href="/DROP5136/VisionGrade"><span class="repo">VisionGrade</span></a>
    <a href="/someone/VisionGrade">someone/VisionGrade</a>
    <p class="pinned-item-desc">  </p>
    <span itemprop="programmingLanguage">JavaScript</span>
  </li>
  <li class="js-pinned-item-list-item">
    <a href="/DROP5136/ResearchX"><span class="repo">ResearchX</span></a>
    <p class="pinned-item-desc">Signals &amp; notes</p>
    <span itemprop="programmingLanguage">Python</span>
  </li>
</ol>
`;

test("pinned profile parsing keeps only the pinned list, including forks", () => {
  assert.deepEqual(parsePinnedProfile(profile, "DROP5136"), [
    {
      name: "VisionGrade",
      description: null,
      language: "JavaScript",
      url: "https://github.com/DROP5136/VisionGrade",
      updated: "",
    },
    {
      name: "ResearchX",
      description: "Signals & notes",
      language: "Python",
      url: "https://github.com/DROP5136/ResearchX",
      updated: "",
    },
  ]);
});

test("missing pinned markup is a retrieval failure, and an empty list is empty", () => {
  assert.equal(parsePinnedProfile("<html>no pins</html>", "DROP5136"), null);
  assert.deepEqual(parsePinnedProfile('<ol class="js-pinned-items-reorder-list"></ol>', "DROP5136"), []);
  assert.equal(parsePinnedPayload({ message: "unavailable" }), null);
  assert.deepEqual(
    parsePinnedPayload([
      {
        name: "ResearchX",
        description: "",
        language: "Python",
        url: "https://github.com/DROP5136/ResearchX",
        updated: "",
      },
    ]),
    [
      {
        name: "ResearchX",
        description: null,
        language: "Python",
        url: "https://github.com/DROP5136/ResearchX",
        updated: "",
      },
    ],
  );
});
