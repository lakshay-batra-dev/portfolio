"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  updated: string;
};

type State =
  | { status: "loading" }
  | { status: "ready"; repos: Repo[] }
  | { status: "unavailable" };

export function GithubActivity() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${profile.githubHandle}/repos?per_page=100&sort=updated`,
          {
            signal: controller.signal,
            headers: { Accept: "application/vnd.github+json" },
          },
        );
        if (!response.ok) {
          setState({ status: "unavailable" });
          return;
        }
        const payload: unknown = await response.json();
        if (!Array.isArray(payload)) {
          setState({ status: "unavailable" });
          return;
        }
        const repos = payload.flatMap((item): Repo[] => {
          if (!item || typeof item !== "object") {
            return [];
          }
          const record = item as Record<string, unknown>;
          if (record.fork === true || typeof record.name !== "string" || typeof record.html_url !== "string") {
            return [];
          }
          return [
            {
              id: typeof record.id === "number" ? record.id : 0,
              name: record.name,
              description: typeof record.description === "string" ? record.description : null,
              language: typeof record.language === "string" ? record.language : null,
              url: record.html_url,
              updated: typeof record.updated_at === "string" ? record.updated_at.slice(0, 10) : "",
            },
          ];
        });
        setState({ status: "ready", repos: repos.slice(0, 6) });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setState({ status: "unavailable" });
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  return (
    <section className="mt-14 border-t border-boot-line pt-8" aria-labelledby="activity-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="activity-heading" className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">
          ENGINEERING ACTIVITY
        </h2>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[12px] tracking-[0.08em] text-boot-text underline decoration-boot-line underline-offset-4 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn"
        >
          {profile.githubHandle}
          <span className="sr-only"> on GitHub, opens in a new tab</span>
        </a>
      </div>
      {state.status === "loading" ? <p className="mt-4 text-[15px] text-boot-dim">Reading public repositories.</p> : null}
      {state.status === "unavailable" ? (
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-boot-dim">
          Public repositories could not be read from GitHub just now. The profile link above is the source.
        </p>
      ) : null}
      {state.status === "ready" && state.repos.length === 0 ? (
        <p className="mt-4 text-[15px] leading-7 text-boot-dim">No public repositories on this account right now.</p>
      ) : null}
      {state.status === "ready" && state.repos.length > 0 ? (
        <ul className="mt-4 divide-y divide-boot-line border-y border-boot-line">
          {state.repos.map((repo) => (
            <li key={`${repo.id}-${repo.name}`} className="py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[14px] text-boot-text underline decoration-boot-line underline-offset-4 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn"
                >
                  {repo.name}
                  <span className="sr-only">, opens in a new tab</span>
                </a>
                <p className="font-mono text-[12px] text-boot-dim">
                  {[repo.language, repo.updated].filter(Boolean).join(" · ")}
                </p>
              </div>
              {repo.description ? <p className="mt-1 max-w-2xl text-[14px] leading-6 text-boot-dim">{repo.description}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
