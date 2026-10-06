import { projects } from "@/data/projects";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function WorkList({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  return (
    <ol className="mt-6 divide-y divide-boot-line border-y border-boot-line">
      {projects.map((project, index) => (
        <li key={project.id} className="py-6">
          <h3 className="font-sans text-[1.25rem] font-medium tracking-tight">
            <span className="font-mono text-[12px] text-boot-dim">{String(index + 1).padStart(2, "0")} / </span>
            {project.name}
          </h3>
          <p className="mt-1 font-sans text-[15px] text-boot-dim">{project.subtitle}</p>
          <p className="mt-3 max-w-2xl font-sans text-[15px] leading-7">{project.summary}</p>
          <p className="mt-4 font-mono text-[12px] tracking-[0.12em] text-boot-dim">TECH STACK</p>
          <p className="mt-2 font-mono text-[12px] leading-6 text-boot-dim">{project.stack.join(" · ")}</p>
          <button
            type="button"
            onClick={() => onOpenProject(project.id)}
            className={`mt-4 font-mono text-[12px] tracking-[0.12em] text-boot-warn ${focus}`}
          >
            OPEN CASE STUDY →
          </button>
        </li>
      ))}
    </ol>
  );
}
