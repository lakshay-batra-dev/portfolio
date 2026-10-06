import { profile } from "@/data/profile";
import snapshot from "./pinnedSnapshot.json";
import { parsePinnedPayload } from "./githubUtils";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

const repos = parsePinnedPayload(snapshot);

export function GitHubActivity() {
  return (
    <section className="border-t border-boot-line pt-8" aria-labelledby="github-activity-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="github-activity-heading" className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">
          GITHUB ACTIVITY
        </h2>
        <p className="font-mono text-[12px] text-boot-text">{profile.githubHandle}</p>
      </div>
      {repos === null ? (
        <div className="mt-4 max-w-xl">
          <p className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">UNABLE TO LOAD GITHUB DATA</p>
          <p className="mt-2 font-sans text-[15px] leading-7 text-boot-dim">GitHub activity is temporarily unavailable.</p>
        </div>
      ) : null}
      {repos !== null && repos.length === 0 ? (
        <p className="mt-4 font-sans text-[15px] leading-7 text-boot-dim">No pinned repositories.</p>
      ) : null}
      {repos !== null && repos.length > 0 ? (
        <ul className="mt-4 divide-y divide-boot-line border-y border-boot-line">
          {repos.map((repo) => (
            <li key={repo.url} className="py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
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
        rel="noopener noreferrer"
        className={`mt-4 inline-block font-mono text-[12px] tracking-[0.12em] text-boot-warn ${focus}`}
      >
        VIEW GITHUB →<span className="sr-only">, opens in a new tab</span>
      </a>
    </section>
  );
}
