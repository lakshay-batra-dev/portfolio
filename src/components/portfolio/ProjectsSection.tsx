"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

type Panel = "overview" | "problem" | "architecture" | "implementation" | "decisions" | "results";

const panels: { id: Panel; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "architecture", label: "Architecture" },
  { id: "implementation", label: "Implementation" },
  { id: "decisions", label: "Decisions" },
  { id: "results", label: "Results" },
];

export function ProjectsSection({
  projectId,
  onOpenProject,
  onCloseProject,
}: {
  projectId: string | null;
  onOpenProject: (id: string) => void;
  onCloseProject: () => void;
}) {
  const project = projects.find((item) => item.id === projectId) ?? null;

  if (!project) {
    return (
      <div>
        <h1 className="font-sans text-[1.75rem] font-medium tracking-tight">Projects</h1>
        <p className="mt-3 max-w-xl font-sans text-[15px] leading-7 text-boot-dim">Two systems. Open either one for the build notes.</p>
        <ul className="mt-8 divide-y divide-boot-line border-y border-boot-line">
          {projects.map((item) => (
            <li key={item.id} className="py-5">
              <h2 className="font-sans text-[1.15rem]">{item.name}</h2>
              <p className="mt-2 max-w-2xl font-sans text-[15px] leading-7 text-boot-dim">{item.summary}</p>
              <p className="mt-3 font-mono text-[12px] leading-6 text-boot-dim">{item.technologies.join(" · ")}</p>
              <button
                type="button"
                onClick={() => onOpenProject(item.id)}
                className={`mt-4 font-mono text-[12px] tracking-[0.12em] text-boot-warn ${focus}`}
              >
                OPEN CASE STUDY →
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <CaseStudy key={project.id} project={project} onClose={onCloseProject} />;
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const available = panels.filter((panel) => panel.id !== "results" || project.results?.length);
  const [panel, setPanel] = useState<Panel>("overview");
  const [nodeId, setNodeId] = useState(project.architecture[0]?.id ?? "");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const active = available.some((item) => item.id === panel) ? panel : "overview";
  const node = project.architecture.find((item) => item.id === nodeId) ?? project.architecture[0];

  useEffect(() => {
    headingRef.current?.focus();
  }, [project.id]);

  function moveTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const index = available.findIndex((item) => item.id === active);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = available[(index + direction + available.length) % available.length];
    if (next) {
      setPanel(next.id);
      document.getElementById(`${project.id}-${next.id}-tab`)?.focus();
    }
  }

  return (
    <article>
      <button type="button" onClick={onClose} className={`font-mono text-[12px] tracking-[0.12em] text-boot-dim ${focus}`}>
        ← ALL PROJECTS
      </button>
      <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-sans text-[1.75rem] font-medium tracking-tight outline-none">
        {project.name}
      </h1>
      <p className="mt-3 font-mono text-[12px] leading-6 text-boot-dim">{project.technologies.join(" · ")}</p>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={`${project.name} notes`} onKeyDown={moveTab}>
        {available.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${project.id}-${item.id}-tab`}
              aria-selected={selected}
              aria-controls={`${project.id}-${item.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setPanel(item.id)}
              className={`border px-2 py-1 font-mono text-[12px] tracking-[0.08em] ${focus} ${
                selected ? "border-boot-warn text-boot-text" : "border-boot-line text-boot-dim"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${project.id}-${active}-panel`}
        aria-labelledby={`${project.id}-${active}-tab`}
        className="mt-6 max-w-2xl font-sans text-[15px] leading-7"
      >
        {active === "overview" ? <p>{project.overview}</p> : null}
        {active === "problem" ? <p>{project.problem}</p> : null}
        {active === "architecture" ? (
          <div className="grid gap-4 md:grid-cols-[13rem_minmax(0,1fr)]">
            <div className="flex flex-col gap-2" role="list">
              {project.architecture.map((item, index) => {
                const selected = item.id === node?.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setNodeId(item.id)}
                    className={`border px-2 py-2 text-left font-mono text-[12px] ${focus} ${
                      selected ? "border-boot-warn text-boot-text" : "border-boot-line text-boot-dim"
                    }`}
                  >
                    <span className="text-boot-dim">{String(index + 1).padStart(2, "0")}</span> {item.label}
                  </button>
                );
              })}
            </div>
            {node ? <p className="border border-boot-line px-3 py-3">{node.detail}</p> : null}
          </div>
        ) : null}
        {active === "implementation" ? (
          <ul className="list-disc space-y-2 pl-5">
            {project.implementation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {active === "decisions" ? (
          <ul className="list-disc space-y-2 pl-5">
            {project.decisions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {active === "results" && project.results ? (
          <ul className="list-disc space-y-2 pl-5">
            {project.results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <p className="mt-8 max-w-2xl font-sans text-[14px] leading-7 text-boot-dim">
        The resume does not list a repository or a live demo for this project.{" "}
        <a href={profile.github} target="_blank" rel="noreferrer" className={`text-boot-text underline decoration-boot-line underline-offset-4 ${focus}`}>
          GitHub profile
          <span className="sr-only">, opens in a new tab</span>
        </a>
        .
      </p>
    </article>
  );
}
