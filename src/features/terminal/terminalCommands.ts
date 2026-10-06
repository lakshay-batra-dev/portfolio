import { projects } from "@/data/projects";
import type { CommandResult, NavigateRequest, OutputLine } from "./terminalTypes";
import { HOME_PATH, listDir, nodeAt, readFile, resolvePath } from "./virtualFileSystem";

const COMMANDS = ["help", "ls", "cd", "pwd", "cat", "open", "whoami", "neofetch", "clear"] as const;

function line(text: string, tone: OutputLine["tone"] = "text"): OutputLine {
  return { text, tone };
}

function textResult(cwd: string, rows: OutputLine[]): CommandResult {
  return { cwd, lines: rows };
}

function errorResult(cwd: string, text: string): CommandResult {
  return textResult(cwd, [line(text, "err")]);
}

const OPEN_TARGETS: Record<string, NavigateRequest> = {
  home: { section: "home", projectId: null },
  projects: { section: "projects", projectId: null },
  experience: { section: "experience", projectId: null },
  education: { section: "education", projectId: null },
  "education/education.txt": { section: "education", projectId: null },
  skills: { section: "skills", projectId: null },
  contact: { section: "contact", projectId: null },
  "projects/intelliflow": { section: "projects", projectId: "intelliflow" },
  "projects/keystroke-auth": { section: "projects", projectId: "keystroke" },
};

function homeRelative(path: string): string | null {
  if (path === HOME_PATH) return "";
  if (path.startsWith(`${HOME_PATH}/`)) return path.slice(HOME_PATH.length + 1);
  return null;
}

export function helpText(): OutputLine[] {
  return [
    line("Available commands:"),
    line(""),
    line("  ls          list directory contents"),
    line("  cd          change directory"),
    line("  pwd         show current path"),
    line("  cat         read a file"),
    line("  open        open a portfolio section"),
    line("  whoami      identify the user"),
    line("  neofetch    system summary"),
    line("  clear       clear terminal"),
    line("  help        show available commands"),
  ];
}

function commandHelp(cwd: string): CommandResult {
  return textResult(cwd, helpText());
}

function commandPwd(cwd: string): CommandResult {
  return textResult(cwd, [line(cwd)]);
}

function commandWhoami(cwd: string): CommandResult {
  return textResult(cwd, [line("Lakshay Batra"), line("Computer Engineer")]);
}

function commandNeofetch(cwd: string): CommandResult {
  return textResult(cwd, [
    line("  // DEBUG", "ok"),
    line("  // LAKSHAY", "ok"),
    line(""),
    line("  User:      Lakshay Batra"),
    line("  Role:      Computer Engineer"),
    line(`  Projects:  ${projects.length}`),
    line("  Stack:     C++ · Python · TypeScript"),
    line("  System:    Portfolio OS"),
    line("  Location:  India"),
  ]);
}

function commandLs(cwd: string, args: string[]): CommandResult {
  if (args.length > 1) return errorResult(cwd, "ls: too many arguments");
  const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
  if (!target) return errorResult(cwd, `ls: ${args[0]}: no such file or directory`);
  const node = nodeAt(target);
  if (!node) return errorResult(cwd, `ls: ${args[0]}: no such file or directory`);
  if (node.kind === "file") {
    const name = target.split("/").pop() ?? target;
    return textResult(cwd, [line(name)]);
  }
  const entries = listDir(target) ?? [];
  return textResult(
    cwd,
    entries.map((entry) => line(entry.kind === "dir" ? `${entry.name}/` : entry.name, entry.kind === "dir" ? "warn" : "text")),
  );
}

function commandCd(cwd: string, args: string[]): CommandResult {
  if (args.length > 1) return errorResult(cwd, "cd: too many arguments");
  const target = resolvePath(cwd, args[0] ?? "~");
  if (!target || !nodeAt(target) || nodeAt(target)?.kind !== "dir") return errorResult(cwd, "cd: no such file or directory");
  return { cwd: target, lines: [] };
}

function commandCat(cwd: string, args: string[]): CommandResult {
  if (args.length === 0) return errorResult(cwd, "cat: missing file operand");
  if (args.length > 1) return errorResult(cwd, "cat: too many arguments");
  const target = resolvePath(cwd, args[0] ?? "");
  if (!target || !nodeAt(target)) return errorResult(cwd, `cat: ${args[0]}: no such file or directory`);
  if (nodeAt(target)?.kind === "dir") return errorResult(cwd, `cat: ${args[0]}: is a directory`);
  const body = readFile(target) ?? "";
  return textResult(
    cwd,
    body.split("\n").map((text) => line(text)),
  );
}

function commandOpen(cwd: string, args: string[]): CommandResult {
  if (args.length !== 1) return errorResult(cwd, "open: target not found");
  const token = (args[0] ?? "").replace(/\/$/, "");
  const direct = OPEN_TARGETS[token];
  if (direct) return { cwd, lines: [line(direct.projectId ? `opening ${token}` : `opening ${direct.section}`, "dim")], navigate: direct };
  const resolved = resolvePath(cwd, token);
  const relative = resolved ? homeRelative(resolved) : null;
  const fromPath = relative !== null ? OPEN_TARGETS[relative] : undefined;
  if (!fromPath) return errorResult(cwd, "open: target not found");
  return { cwd, lines: [line(`opening ${relative}`, "dim")], navigate: fromPath };
}

function commandClear(cwd: string): CommandResult {
  return { cwd, lines: [], clear: true };
}

function playful(cwd: string, command: string, args: string[]): CommandResult | null {
  const phrase = [command, ...args].join(" ").toLowerCase();
  if (phrase === "sudo hire lakshay") return textResult(cwd, [line("sudo: permission denied."), line("Nice try.")]);
  if (command === "sudo") return errorResult(cwd, "sudo: permission denied");
  if (phrase === "rm -rf /portfolio" || phrase === "rm -rf /") {
    return textResult(cwd, [line("Nice try, nerd."), line("I'm not letting you destroy my portfolio.")]);
  }
  if (command === "rm") return errorResult(cwd, "rm: permission denied");
  if (phrase === "vim resume.txt") return textResult(cwd, [line("Nice try."), line("You can just click RESUME.")]);
  if (phrase === "npm install motivation") return textResult(cwd, [line("npm ERR! 404"), line("motivation not found.")]);
  if (phrase === "make coffee") return textResult(cwd, [line("Brewing..."), line("Done. ☕")]);
  if (phrase === "git status") return textResult(cwd, [line("On branch main"), line("nothing to commit, working tree clean")]);
  return null;
}

export function runCommand(input: string, cwd: string): CommandResult {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const command = tokens[0]?.toLowerCase() ?? "";
  const args = tokens.slice(1);
  if (!command) return { cwd, lines: [] };

  const joke = playful(cwd, command, args);
  if (joke) return joke;

  switch (command) {
    case "help":
      return commandHelp(cwd);
    case "pwd":
      return commandPwd(cwd);
    case "whoami":
      return commandWhoami(cwd);
    case "neofetch":
      return commandNeofetch(cwd);
    case "ls":
      return commandLs(cwd, args);
    case "cd":
      return commandCd(cwd, args);
    case "cat":
      return commandCat(cwd, args);
    case "open":
      return commandOpen(cwd, args);
    case "clear":
      return commandClear(cwd);
    default:
      return errorResult(cwd, "Unknown command. Try `help`.");
  }
}

function commonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0] ?? "";
  for (const value of values) {
    while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

function completeCommand(partial: string): { replacement: string; matches: string[] } {
  const matches = COMMANDS.filter((command) => command.startsWith(partial));
  if (matches.length === 1) return { replacement: matches[0] ?? partial, matches };
  return { replacement: commonPrefix(matches) || partial, matches: [...matches] };
}

function completePath(partial: string, cwd: string): { replacement: string; matches: string[] } {
  const slash = partial.lastIndexOf("/");
  const parentToken = slash >= 0 ? partial.slice(0, slash + 1) : "";
  const namePrefix = slash >= 0 ? partial.slice(slash + 1) : partial;
  const parentPath = parentToken ? resolvePath(cwd, parentToken) : cwd;
  if (!parentPath) return { replacement: partial, matches: [] };
  const entries = listDir(parentPath);
  if (!entries) return { replacement: partial, matches: [] };
  const matches = entries
    .filter((entry) => entry.name.startsWith(namePrefix))
    .map((entry) => `${parentToken}${entry.name}${entry.kind === "dir" ? "/" : ""}`);
  if (matches.length === 1) return { replacement: matches[0] ?? partial, matches };
  const prefix = commonPrefix(matches);
  return { replacement: prefix || partial, matches };
}

export function completeInput(line: string, cwd: string): { line: string; matches: string[] } {
  const trailing = /\s$/.test(line);
  const tokens = line.trim().split(/\s+/).filter(Boolean);
  if (!trailing && tokens.length <= 1) {
    const completed = completeCommand(tokens[0] ?? "");
    return { line: completed.replacement, matches: completed.matches.length > 1 ? completed.matches : [] };
  }

  const command = (tokens[0] ?? "").toLowerCase();
  if (command !== "ls" && command !== "cd" && command !== "cat" && command !== "open") return { line, matches: [] };
  const partial = trailing ? "" : (tokens[tokens.length - 1] ?? "");
  const head = trailing ? line.replace(/\s+$/, "") : tokens.slice(0, -1).join(" ");
  const completed = completePath(partial, cwd);
  const next = `${head} ${completed.replacement}`.replace(/\s+/g, " ").trimStart();
  return { line: next, matches: completed.matches.length > 1 ? completed.matches : [] };
}

