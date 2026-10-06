import { profile } from "@/data/profile";
import { GitHubActivity } from "@/features/github/GitHubActivity";
import { WorkList } from "./WorkList";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function HomeSection({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  return (
    <div>
      <header>
        <h1 className="font-sans text-[2rem] leading-tight font-medium tracking-tight sm:text-[2.5rem]">{profile.displayName}</h1>
        <p className="mt-2 font-sans text-[1.05rem] text-boot-dim">{profile.role}</p>
        <p className="mt-6 max-w-xl font-sans text-[16px] leading-7">{profile.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[12px] tracking-[0.12em]">
          <a
            href={profile.resumePath}
            target="_blank"
            rel="noreferrer"
            className={`border border-boot-text px-3 py-2 text-boot-text ${focus}`}
          >
            VIEW RESUME
            <span className="sr-only">, PDF, opens in a new tab</span>
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className={`text-boot-dim hover:text-boot-text ${focus}`}>
            GITHUB
            <span className="sr-only">, opens in a new tab</span>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className={`text-boot-dim hover:text-boot-text ${focus}`}>
            LINKEDIN
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </div>
      </header>

      <section className="mt-14 border-t border-boot-line pt-8" aria-labelledby="selected-work">
        <h2 id="selected-work" className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">
          SELECTED WORK
        </h2>
        <WorkList onOpenProject={onOpenProject} />
      </section>

      <div className="mt-14">
        <GitHubActivity />
      </div>

      <section className="mt-14 max-w-xl border-t border-boot-line pt-8" aria-labelledby="education-heading">
        <h2 id="education-heading" className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">
          EDUCATION
        </h2>
        <ul className="mt-4 divide-y divide-boot-line border-y border-boot-line">
          {profile.education.map((entry) => (
            <li key={entry.title} className="py-4">
              <p className="font-sans text-[16px]">{entry.title}</p>
              <p className="mt-1 font-sans text-[15px] leading-7 text-boot-dim">{entry.school}</p>
              {"place" in entry ? <p className="font-sans text-[15px] leading-7 text-boot-dim">{entry.place}</p> : null}
              <p className="font-mono text-[12px] text-boot-dim">{entry.years}</p>
              <p className="font-mono text-[12px] text-boot-dim">{entry.result}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
