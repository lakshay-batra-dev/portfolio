import { profile } from "@/data/profile";
import { parsePublicRepos } from "./githubUtils";
import type { PublicRepo } from "./githubTypes";

export async function fetchPublicRepos(signal: AbortSignal): Promise<PublicRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${profile.githubHandle}/repos?per_page=100&sort=updated`,
    {
      signal,
      headers: { Accept: "application/vnd.github+json" },
    },
  );

  if (!response.ok) {
    throw new Error("GitHub did not return repositories");
  }

  const repos = parsePublicRepos(await response.json());
  if (!repos) {
    throw new Error("GitHub payload was not a repository list");
  }

  return repos.slice(0, 6);
}
