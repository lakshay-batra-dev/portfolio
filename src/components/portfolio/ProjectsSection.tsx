"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects, type ArchitectureNode, type Project, type StudySection } from "@/data/projects";
import { WorkList } from "./WorkList";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

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
        <p className="mt-3 max-w-xl font-sans text-[15px] leading-7 text-boot-dim">Selected systems.</p>
        <WorkList onOpenProject={onOpenProject} />
      </div>
    );
  }

  return <CaseStudy key={project.id} project={project} onClose={onCloseProject} />;
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [nodeId, setNodeId] = useState(project.architecture[0]?.id ?? "");
  const node = project.architecture.find((item) => item.id === nodeId) ?? project.architecture[0];

  useEffect(() => {
    headingRef.current?.focus();
  }, [project.id]);

  return (
    <article className="max-w-2xl">
      <button type="button" onClick={onClose} className={`font-mono text-[12px] tracking-[0.12em] text-boot-dim ${focus}`}>
        ← ALL PROJECTS
      </button>
      <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-sans text-[1.75rem] font-medium tracking-tight outline-none">
        {project.name}
      </h1>
      <p className="mt-2 font-sans text-[16px] text-boot-dim">{project.subtitle}</p>
      <div className="mt-10 space-y-10">
        {project.sections.map((section) => (
          <StudyBlock key={section.id} section={section} architecture={project.architecture} node={node} onSelect={setNodeId} />
        ))}
      </div>
      <p className="mt-10 font-sans text-[14px] leading-7 text-boot-dim">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-boot-text underline decoration-boot-line underline-offset-4 ${focus}`}
        >
          GitHub profile
          <span className="sr-only">, opens in a new tab</span>
        </a>
      </p>
    </article>
  );
}

function StudyBlock({
  section,
  architecture,
  node,
  onSelect,
}: {
  section: StudySection;
  architecture: ArchitectureNode[];
  node: ArchitectureNode | undefined;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-labelledby={`${section.id}-heading`} className="border-t border-boot-line pt-6">
      <h2 id={`${section.id}-heading`} className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">
        {section.title.toUpperCase()}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 font-sans text-[15px] leading-7">
          {paragraph}
        </p>
      ))}
      {section.id === "architecture" && architecture.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="flex flex-col gap-2">
            {architecture.map((item) => {
              const selected = item.id === node?.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(item.id)}
                  className={`border px-2 py-2 text-left font-mono text-[12px] ${focus} ${
                    selected ? "border-boot-warn text-boot-text" : "border-boot-line text-boot-dim"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {node ? <p className="border border-boot-line px-3 py-3 font-sans text-[15px] leading-7">{node.detail}</p> : null}
        </div>
      ) : null}
      {section.steps ? (
        <ol className="mt-4 font-mono text-[13px] leading-7">
          {section.steps.map((step, index) => (
            <li key={step}>
              {index > 0 ? <span className="mr-2 text-boot-dim">↓</span> : null}
              {step}
            </li>
          ))}
        </ol>
      ) : null}
      {section.points ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 font-sans text-[15px] leading-7">
          {section.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
      {section.metrics ? (
        <dl className="mt-4 grid max-w-sm grid-cols-2 gap-x-6 gap-y-2 border border-boot-line px-3 py-3 font-mono text-[13px]">
          {section.metrics.map((metric) => (
            <div key={metric.label} className="contents">
              <dt className="text-boot-dim">{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
