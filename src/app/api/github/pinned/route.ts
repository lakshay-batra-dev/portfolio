import { fetchPinnedRepos } from "@/features/github/githubApi";

export async function GET(request: Request) {
  try {
    const repos = await fetchPinnedRepos(request.signal);
    return Response.json(repos);
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
