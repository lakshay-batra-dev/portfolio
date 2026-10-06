"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { fetchPublicRepos } from "./githubApi";
import type { PublicRepo } from "./githubTypes";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

type State =
  | { status: "loading" }
  | { status: "ready"; repos: PublicRepo[] }
  | { status: "unavailable" };

export function GitHubActivity() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetchPublicRepos(controller.signal)
      .then((repos) => setState({ status: "ready", repos }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setState({ status: "unavailable" });
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="border-t border-boot-line pt-8" aria-labelledby="github-activity-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="github-activity-heading" className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">
          GITHUB ACTIVITY
        </h2>
        <p className="font-mono text-[12px] text-boot-text">{profile.githubHandle}</p>
      </div>
      {state.status === "loading" ? <p className="mt-4 font-sans text-[15px] text-boot-dim">Loading GitHub activity...</p> : null}
      {state.status === "unavailable" ? (
        <p className="mt-4 max-w-xl font-sans text-[15px] leading-7 text-boot-dim">GitHub activity is temporarily unavailable.</p>
      ) : null}
      {state.status === "ready" && state.repos.length === 0 ? (
        <p className="mt-4 font-sans text-[15px] leading-7 text-boot-dim">No recent public activity.</p>
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
                  className={`font-mono text-[14px] text-boot-text underline decoration-boot-line underline-offset-4 ${focus}`}
                >
                  {repo.name}
                  <span className="sr-only">, opens in a new tab</span>
                </a>
                <p className="font-mono text-[12px] text-boot-dim">{[repo.language, repo.updated].filter(Boolean).join(" · ")}</p>
              </div>
              {repo.description ? <p className="mt-1 max-w-2xl font-sans text-[14px] leading-6 text-boot-dim">{repo.description}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer"
        className={`mt-4 inline-block font-mono text-[12px] tracking-[0.12em] text-boot-warn ${focus}`}
      >
        VIEW GITHUB →<span className="sr-only">, opens in a new tab</span>
      </a>
    </section>
  );
}
