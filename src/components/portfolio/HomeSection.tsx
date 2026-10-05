import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { GithubActivity } from "./GithubActivity";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function HomeSection({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  const intelliflow = projects.find((project) => project.id === "intelliflow");

  return (
    <div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
        <div>
          <h1 className="font-sans text-[2rem] leading-tight font-medium tracking-tight sm:text-[2.5rem]">
            {profile.displayName}
          </h1>
          <p className="mt-2 font-sans text-[1.05rem] text-boot-dim">{profile.role}</p>
          <p className="mt-6 max-w-xl font-sans text-[16px] leading-7">
            IntelliFlow takes a client request and turns it into a project: classification, a task breakdown, a matched
            person, and an approval. The keystroke system uses 31 timing features to separate a genuine user from an
            impostor.
          </p>
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
            <a href={`mailto:${profile.email}`} className={`text-boot-dim hover:text-boot-text ${focus}`}>
              EMAIL
            </a>
          </div>
        </div>
        {intelliflow ? (
          <aside className="border border-boot-line" aria-label="IntelliFlow structure">
            <p className="border-b border-boot-line px-3 py-2 font-mono text-[12px] tracking-[0.12em] text-boot-dim">
              intelliflow
            </p>
            <ol className="px-3 py-3 font-mono text-[13px] leading-7">
              {intelliflow.architecture.map((node) => (
                <li key={node.id}>{node.label}</li>
              ))}
            </ol>
            <div className="border-t border-boot-line px-3 py-3">
              <button
                type="button"
                onClick={() => onOpenProject(intelliflow.id)}
                className={`font-mono text-[12px] tracking-[0.12em] text-boot-warn ${focus}`}
              >
                OPEN CASE STUDY →
              </button>
            </div>
          </aside>
        ) : null}
      </div>
      <section className="mt-14 max-w-xl border-t border-boot-line pt-6" aria-labelledby="education-heading">
        <h2 id="education-heading" className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">
          EDUCATION
        </h2>
        <p className="mt-3 font-sans text-[16px]">{profile.education.degree}</p>
        <p className="mt-1 font-sans text-[15px] leading-7 text-boot-dim">
          {profile.education.school} ({profile.education.shortSchool})
        </p>
        <p className="font-mono text-[12px] text-boot-dim">
          {profile.education.years} · CGPA {profile.education.cgpa}
        </p>
      </section>
      <GithubActivity />
    </div>
  );
}
