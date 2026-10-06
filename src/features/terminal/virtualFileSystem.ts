import { educationDocument } from "@/data/education";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";
import { skillGroups } from "@/data/skills";

export const HOME_PATH = "/home/lakshay";

type FsDir = {
  kind: "dir";
  children: Record<string, FsNode>;
};

type FsFile = {
  kind: "file";
  read: () => string;
};

type FsNode = FsDir | FsFile;

export type DirEntry = {
  name: string;
  kind: "dir" | "file";
};

function text(value: string): FsFile {
  return { kind: "file", read: () => value };
}

function projectDocument(project: Project): string {
  const lines = [project.name, project.subtitle, "", project.summary, "", project.stack.join(" · ")];
  for (const section of project.sections) {
    lines.push("", section.title.toUpperCase(), ...section.paragraphs);
    if (section.steps?.length) lines.push(section.steps.join(" → "));
    if (section.points?.length) lines.push(...section.points.map((point) => `- ${point}`));
    if (section.metrics?.length) lines.push(...section.metrics.map((metric) => `${metric.label}: ${metric.value}`));
  }
  return lines.filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n");
}

function experienceDocument(): string {
  return experience
    .map((entry) =>
      [entry.role, entry.org, `${entry.dates} · ${entry.place}`, entry.focus, "", entry.pipeline.join(" → "), "", ...entry.points.map((point) => `- ${point}`)].join(
        "\n",
      ),
    )
    .join("\n\n");
}

function skillsDocument(): string {
  return skillGroups
    .map((group) => {
      const lines = [group.label.toUpperCase()];
      for (const skill of group.skills) {
        const links = [
          ...skill.projects.map((id) => projects.find((project) => project.id === id)?.name).filter((name): name is string => Boolean(name)),
          ...(skill.also ?? []),
        ];
        lines.push(links.length > 0 ? `${skill.name} — ${links.join(", ")}` : skill.name);
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

function contactDocument(): string {
  return [`Email`, profile.email, "", `LinkedIn`, profile.linkedin, "", `GitHub`, profile.github].join("\n");
}

function aboutDocument(): string {
  return `${profile.displayName}\n${profile.role}\n\n${profile.intro}`;
}

function buildTree(): FsDir {
  const intelliflow = projects.find((project) => project.id === "intelliflow");
  const keystroke = projects.find((project) => project.id === "keystroke");
  const projectDirs: Record<string, FsNode> = {
    intelliflow: { kind: "dir", children: { "readme.md": text(intelliflow ? projectDocument(intelliflow) : "") } },
    "keystroke-auth": { kind: "dir", children: { "readme.md": text(keystroke ? projectDocument(keystroke) : "") } },
  };

  const home: FsDir = {
    kind: "dir",
    children: {
      "about.txt": text(aboutDocument()),
      projects: { kind: "dir", children: projectDirs },
      skills: { kind: "dir", children: { "stack.txt": text(skillsDocument()) } },
      experience: { kind: "dir", children: { "research-intern.txt": text(experienceDocument()) } },
      education: { kind: "dir", children: { "education.txt": text(educationDocument()) } },
      contact: { kind: "dir", children: { "contact.txt": text(contactDocument()) } },
      "resume.pdf": text("resume.pdf is a PDF. Open it with the RESUME control."),
    },
  };

  return {
    kind: "dir",
    children: {
      home: {
        kind: "dir",
        children: {
          lakshay: home,
        },
      },
    },
  };
}

const root = buildTree();

export function splitPath(path: string): string[] {
  return path.split("/").filter(Boolean);
}

export function nodeAt(path: string): FsNode | null {
  if (path === "/") return root;
  let current: FsNode = root;
  for (const part of splitPath(path)) {
    if (current.kind !== "dir" || !current.children[part]) return null;
    current = current.children[part];
  }
  return current;
}

export function resolvePath(cwd: string, input: string, alias = true): string | null {
  const trimmed = input.trim();
  const raw = trimmed === "" || trimmed === "~" ? HOME_PATH : trimmed.startsWith("~/") ? `${HOME_PATH}/${trimmed.slice(2)}` : trimmed;
  const absolute = raw.startsWith("/") ? raw : `${cwd}/${raw}`;
  const parts: string[] = [];
  for (const part of absolute.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  const resolved = parts.length === 0 ? "/" : `/${parts.join("/")}`;
  if (nodeAt(resolved)) return resolved;
  if (alias && raw.startsWith("/") && raw !== "/") return resolvePath(HOME_PATH, `${HOME_PATH}${raw}`, false);
  return null;
}

export function listDir(path: string): DirEntry[] | null {
  const node = nodeAt(path);
  if (!node || node.kind !== "dir") return null;
  return Object.entries(node.children).map(([name, child]) => ({ name, kind: child.kind }));
}

export function readFile(path: string): string | null {
  const node = nodeAt(path);
  if (!node || node.kind !== "file") return null;
  return node.read();
}

export function displayPath(path: string): string {
  if (path === HOME_PATH) return "~";
  if (path.startsWith(`${HOME_PATH}/`)) return `~${path.slice(HOME_PATH.length)}`;
  return path;
}

export function promptFor(path: string): string {
  return `lakshay@dev:${displayPath(path)}$`;
}
