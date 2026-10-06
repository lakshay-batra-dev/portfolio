import { runCommand } from "./terminalCommands";
import type { CommandResult } from "./terminalTypes";

export function parseCommand(input: string): { command: string; args: string[] } {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  return { command: tokens[0]?.toLowerCase() ?? "", args: tokens.slice(1) };
}

export function executeCommand(input: string, cwd: string): CommandResult {
  if (typeof input !== "string" || typeof cwd !== "string") {
    return { cwd: typeof cwd === "string" ? cwd : "/", lines: [{ text: "Unknown command. Try `help`.", tone: "err" }] };
  }
  return runCommand(input, cwd);
}
