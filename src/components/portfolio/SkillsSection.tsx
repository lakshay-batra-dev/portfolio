import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function SkillsSection({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  return (
    <div>
      <h1 className="font-sans text-[1.75rem] font-medium tracking-tight">Skills</h1>
      <p className="mt-3 max-w-xl font-sans text-[15px] leading-7 text-boot-dim">
        A link means that technology is part of that project. Nothing here is a percentage.
      </p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {skillGroups.map((group) => (
          <section key={group.id} aria-labelledby={`skill-${group.id}`}>
            <h2 id={`skill-${group.id}`} className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">
              {group.label.toUpperCase()}
            </h2>
            <ul className="mt-3 divide-y divide-boot-line border-y border-boot-line">
              {group.skills.map((skill) => (
                <li key={skill.name} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                  <span className="font-sans text-[15px]">{skill.name}</span>
                  {skill.projects.length > 0 ? (
                    <span className="flex flex-wrap gap-3">
                      {skill.projects.map((id) => {
                        const project = projects.find((item) => item.id === id);
                        if (!project) {
                          return null;
                        }
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => onOpenProject(id)}
                            className={`font-mono text-[12px] text-boot-warn ${focus}`}
                          >
                            {project.name}
                          </button>
                        );
                      })}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
