import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchPinnedRepos } from "../src/features/github/githubApi";

const target = path.join(process.cwd(), "src/features/github/pinnedSnapshot.json");

async function main() {
  try {
    const repos = await fetchPinnedRepos();
    writeFileSync(target, `${JSON.stringify(repos, null, 2)}\n`);
    console.log(`Pinned repositories refreshed (${repos.length}).`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    if (!existsSync(target)) {
      writeFileSync(target, "null\n");
    }
    console.warn(`Pinned repositories were not refreshed (${message}).`);
  }
}

void main();
