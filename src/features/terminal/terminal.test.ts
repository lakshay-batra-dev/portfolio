import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { completeInput, runCommand } from "./terminalCommands";
import { emptyHistory, moveHistory, submitHistory } from "./terminalHistory";
import { executeCommand } from "./terminalParser";
import { HOME_PATH, listDir } from "./virtualFileSystem";

const home = HOME_PATH;

function text(input: string, cwd = home) {
  return executeCommand(input, cwd).lines.map((entry) => entry.text).join("\n");
}

test("help lists the public commands and hides easter eggs", () => {
  const output = text("help");
  assert.match(output, /ls/);
  assert.match(output, /open/);
  assert.match(output, /neofetch/);
  assert.equal(output.includes("sudo"), false);
  assert.equal(output.includes("motivation"), false);
});

test("ls, cd, and pwd walk the virtual portfolio", () => {
  const root = text("ls");
  assert.match(root, /about\.txt/);
  assert.match(root, /projects\//);
  assert.match(root, /resume\.pdf/);

  const entered = executeCommand("cd projects", home);
  assert.equal(entered.cwd, `${home}/projects`);
  assert.match(text("ls", entered.cwd), /intelliflow\//);
  assert.match(text("ls", entered.cwd), /keystroke-auth\//);

  const project = executeCommand("cd intelliflow", entered.cwd);
  assert.equal(project.cwd, `${home}/projects/intelliflow`);
  assert.equal(text("pwd", project.cwd), `${home}/projects/intelliflow`);

  const up = executeCommand("cd ..", project.cwd);
  assert.equal(up.cwd, `${home}/projects`);
  const study = executeCommand("cd education", home);
  assert.equal(study.cwd, `${home}/education`);
  assert.equal(executeCommand("cd /education", home).cwd, `${home}/education`);
  assert.match(text("cat education.txt", study.cwd), /EDUCATION/);
  assert.match(text("cat education.txt", study.cwd), /92%/);
  assert.match(text("cat education.txt", study.cwd), /94\.6%/);

  const top = executeCommand("cd /", up.cwd);
  assert.equal(top.cwd, "/");
  assert.match(text("ls", "/"), /home\//);
  assert.equal(executeCommand("cd /projects/intelliflow", home).cwd, `${home}/projects/intelliflow`);
});

test("cat reads portfolio data and rejects missing files", () => {
  const about = text("cat about.txt");
  assert.match(about, /Lakshay Batra/);
  assert.match(about, /Computer Engineer/);
  assert.match(about, /full-stack systems/);

  const education = text("cat education/education.txt");
  assert.match(education, /B\.Tech — Computer Engineering/);
  assert.match(education, /CGPA: 7\.58 \/ 10/);
  assert.match(education, /2022 — 2023/);
  assert.match(education, /2020 — 2021/);
  assert.match(education, /Rohtak, India/);
  assert.equal(education.includes("7.70"), false);

  const flow = text("cat projects/intelliflow/readme.md");
  assert.match(flow, /IntelliFlow/);
  assert.match(flow, /LangGraph/);
  assert.match(text("cat projects/keystroke-auth/readme.md"), /0\.733/);
  assert.match(text("cat experience/research-intern.txt"), /Sleep Apnea/);
  assert.match(text("whoami"), /Lakshay Batra/);
  assert.match(text("neofetch"), /Portfolio OS/);
  assert.match(text("neofetch"), /Projects:  2/);
  assert.equal(text("cat something.txt"), "cat: something.txt: no such file or directory");
});

test("open navigates and unknown targets do not", () => {
  assert.deepEqual(executeCommand("open projects", home).navigate, { section: "projects", projectId: null });
  assert.deepEqual(executeCommand("open skills", home).navigate, { section: "skills", projectId: null });
  assert.deepEqual(executeCommand("open experience", home).navigate, { section: "experience", projectId: null });
  assert.deepEqual(executeCommand("open contact", home).navigate, { section: "contact", projectId: null });
  assert.deepEqual(executeCommand("open education", home).navigate, { section: "education", projectId: null });
  assert.deepEqual(executeCommand("open /education", home).navigate, { section: "education", projectId: null });
  assert.deepEqual(executeCommand("open education/education.txt", home).navigate, { section: "education", projectId: null });
  assert.deepEqual(executeCommand("open /education/education.txt", home).navigate, { section: "education", projectId: null });
  assert.deepEqual(executeCommand("open home", home).navigate, { section: "home", projectId: null });
  assert.deepEqual(executeCommand("open projects/intelliflow", home).navigate, { section: "projects", projectId: "intelliflow" });
  assert.deepEqual(executeCommand("open projects/keystroke-auth", home).navigate, { section: "projects", projectId: "keystroke" });
  assert.equal(executeCommand("open unknown", home).navigate, undefined);
  assert.match(text("open unknown"), /open: target not found/);
});

test("invalid directories, clear, and unknown commands stay inside the sandbox", () => {
  assert.equal(text("cd linkedin"), "cd: no such file or directory");
  assert.equal(executeCommand("cd linkedin", home).cwd, home);
  const cleared = executeCommand("clear", `${home}/projects`);
  assert.equal(cleared.clear, true);
  assert.equal(cleared.cwd, `${home}/projects`);
  assert.equal(text("hello"), "Unknown command. Try `help`.");
});

test("destructive and script-like input cannot change the filesystem or run code", () => {
  const before = JSON.stringify(listDir(home));
  executeCommand("rm -rf /portfolio", home);
  executeCommand("rm resume.pdf", home);
  executeCommand("eval('alert(1)')", home);
  executeCommand("new Function('return 1')()", home);
  executeCommand("require('fs').readFileSync('/etc/passwd')", home);
  executeCommand("cat /etc/passwd", home);
  assert.equal(JSON.stringify(listDir(home)), before);
  assert.match(text("rm -rf /portfolio"), /not letting you destroy my portfolio/);
  assert.equal(text("rm resume.pdf"), "rm: permission denied");
  assert.match(text("eval('alert(1)')"), /Unknown command/);
  assert.match(text("cat /etc/passwd"), /no such file or directory/);
});

test("easter eggs stay virtual", () => {
  assert.match(text("sudo hire lakshay"), /permission denied/);
  assert.match(text("vim resume.txt"), /click RESUME/);
  assert.match(text("npm install motivation"), /motivation not found/);
  assert.match(text("make coffee"), /Brewing/);
  assert.match(text("git status"), /working tree clean/);
});

test("tab completion resolves commands and paths", () => {
  assert.equal(completeInput("op", home).line, "open");
  assert.equal(completeInput("cd pro", home).line, "cd projects/");
  assert.equal(completeInput("cd projects/in", home).line, "cd projects/intelliflow/");
  const ambiguous = completeInput("c", home);
  assert.deepEqual(ambiguous.matches, ["cd", "cat", "clear"]);
});

test("command history moves within the current session only", () => {
  let state = submitHistory(emptyHistory(), "ls");
  state = submitHistory(state, "pwd");
  const previous = moveHistory(state, "up", "");
  assert.equal(previous.value, "pwd");
  const older = moveHistory(previous.state, "up", previous.value);
  assert.equal(older.value, "ls");
  const blank = moveHistory(older.state, "down", older.value);
  assert.equal(blank.value, "pwd");
});

test("the terminal implementation does not reach for a real shell or filesystem", () => {
  const source = [
    "terminalCommands.ts",
    "terminalParser.ts",
    "virtualFileSystem.ts",
    "Terminal.tsx",
  ]
    .map((name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8"))
    .join("\n");
  assert.equal(source.includes("eval("), false);
  assert.equal(source.includes("new Function"), false);
  assert.equal(source.includes("child_process"), false);
  assert.equal(source.includes("localStorage"), false);
  assert.equal(source.includes("node:fs"), false);
});

test("runCommand and the parser agree", () => {
  assert.equal(runCommand("pwd", home).lines[0]?.text, executeCommand("pwd", home).lines[0]?.text);
});
