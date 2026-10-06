import { profile } from "@/data/profile";
import { parsePinnedProfile } from "./githubUtils";
import type { PinnedRepo } from "./githubTypes";

export async function fetchPinnedRepos(signal?: AbortSignal): Promise<PinnedRepo[]> {
  const response = await fetch(`https://github.com/${profile.githubHandle}`, {
    signal,
    cache: "no-store",
    headers: {
      Accept: "text/html",
      "User-Agent": "debug-lakshay-portfolio",
    },
  });

  if (!response.ok) {
    throw new Error("GitHub did not return the profile");
  }

  const repos = parsePinnedProfile(await response.text(), profile.githubHandle);
  if (!repos) {
    throw new Error("Pinned repositories were not on the profile");
  }

  return repos;
}
