"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { ContactSection } from "./ContactSection";
import { ExperienceSection } from "./ExperienceSection";
import { HomeSection } from "./HomeSection";
import { ProjectsSection } from "./ProjectsSection";
import { SkillsSection } from "./SkillsSection";

const sections = [
  { id: "home", label: "HOME" },
  { id: "projects", label: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "skills", label: "SKILLS" },
  { id: "contact", label: "CONTACT" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function Workspace() {
  const [section, setSection] = useState<SectionId>("home");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  function openProject(id: string) {
    setProjectId(id);
    setSection("projects");
    setHelp(false);
  }

  function go(next: SectionId) {
    setSection(next);
    setHelp(false);
  }

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [section, projectId]);

  useEffect(() => {
    let buffer = "";
    let secretTimer = 0;

    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, [contenteditable='true']")) {
        return;
      }
      if (event.key === "?") {
        event.preventDefault();
        setHelp((open) => !open);
        return;
      }
      if (event.key === "Escape") {
        setHelp(false);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) {
        return;
      }
      buffer = (buffer + event.key.toLowerCase()).slice(-5);
      if (buffer === "debug") {
        setSecret("Line 7. Still the only one.");
        window.clearTimeout(secretTimer);
        secretTimer = window.setTimeout(() => setSecret(null), 2800);
        buffer = "";
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(secretTimer);
    };
  }, []);

  useEffect(() => {
    if (!statusNote) {
      return;
    }
    const id = window.setTimeout(() => setStatusNote(null), 2500);
    return () => window.clearTimeout(id);
  }, [statusNote]);

  const openProjectName = projects.find((project) => project.id === projectId)?.name;
  const fileLabel = section === "projects" && projectId ? `projects / ${projectId}` : section;

  return (
    <div className="workspace-in flex h-full min-h-0 flex-col overflow-hidden bg-boot-bg text-boot-text">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-boot-line px-4 py-3 font-mono text-[12px] tracking-[0.12em]">
        <p>LAKSHAY-BATRA.DEV</p>
        <p className="hidden text-boot-dim sm:block">{fileLabel}</p>
        <a href={profile.resumePath} target="_blank" rel="noreferrer" className={`text-boot-text ${focus}`}>
          RESUME
          <span className="sr-only">, PDF, opens in a new tab</span>
        </a>
      </header>
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <nav aria-label="Portfolio" className="flex shrink-0 flex-wrap gap-1 border-b border-boot-line px-2 md:w-44 md:flex-col md:flex-nowrap md:border-b-0 md:border-r md:px-0 md:py-4">
          {sections.map((item) => {
            const selected = item.id === section;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => go(item.id)}
                className={`border-b-2 px-2 py-2 text-left font-mono text-[11px] tracking-[0.08em] md:border-b-0 md:border-l-2 md:px-3 md:text-[12px] md:tracking-[0.14em] ${focus} ${
                  selected ? "border-boot-warn text-boot-text" : "border-transparent text-boot-dim"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        <main ref={mainRef} id="workspace" className="min-h-0 min-w-0 flex-1 overflow-y-auto px-5 py-8 md:px-10">
          <div className="mx-auto max-w-5xl">
            {section === "home" ? <HomeSection onOpenProject={openProject} /> : null}
            {section === "projects" ? (
              <ProjectsSection projectId={projectId} onOpenProject={openProject} onCloseProject={() => setProjectId(null)} />
            ) : null}
            {section === "experience" ? <ExperienceSection /> : null}
            {section === "skills" ? <SkillsSection onOpenProject={openProject} /> : null}
            {section === "contact" ? <ContactSection /> : null}
          </div>
        </main>
      </div>
      {help ? (
        <div className="shrink-0 border-t border-boot-line px-4 py-3 font-mono text-[12px]" role="region" aria-label="Command help">
          <p className="text-boot-dim">? toggles this. Type debug if you remember the boot.</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {sections.map((item) => (
              <button key={item.id} type="button" onClick={() => go(item.id)} className={`tracking-[0.12em] text-boot-text ${focus}`}>
                {item.label}
              </button>
            ))}
            <a href={profile.resumePath} target="_blank" rel="noreferrer" className={`tracking-[0.12em] ${focus}`}>
              RESUME
            </a>
          </div>
        </div>
      ) : null}
      <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-boot-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-boot-dim">
        <button
          type="button"
          onClick={() => setStatusNote("caffeine: adequate")}
          className={focus}
          aria-live="polite"
        >
          {statusNote ?? "READY"}
        </button>
        <p className="truncate">{secret ?? (section === "projects" ? openProjectName : null) ?? section}</p>
        <p className="hidden sm:block">LOCAL</p>
      </footer>
    </div>
  );
}
