export type TaskStatus = "pending" | "running" | "success" | "warning" | "error";

export type BootPhase =
  | "BOOT_START"
  | "INITIALIZE_KERNEL"
  | "INITIALIZE_PROFILE"
  | "LOAD_PROJECTS"
  | "INITIALIZE_DIAGNOSTICS"
  | "PREPARE_APPLICATION"
  | "RUN_DIAGNOSTICS"
  | "BOOT_COMPLETE";

export type LogKind = "command" | "result" | "banner" | "rule";

export type LogLine = {
  id: string;
  kind: LogKind;
  text: string;
  status?: TaskStatus;
  elapsedMs: number;
};

export type DiagnosticCheck = {
  id: string;
  label: string;
  status: "success" | "warning" | "error";
};

export type BootCompletion = {
  status: "complete";
  diagnostics: {
    anomalyCount: number;
    integrity: number;
    checks: DiagnosticCheck[];
  };
  tasks: Partial<Record<string, Exclude<TaskStatus, "pending" | "running">>>;
};

export type BootSnapshot = {
  phase: BootPhase;
  lines: LogLine[];
  cursorLineId: string | null;
  activeTaskId: string | null;
  completed: Partial<Record<string, TaskStatus>>;
  completion: BootCompletion | null;
};

export type BootClock = {
  now: () => number;
  sleep: (ms: number, signal?: AbortSignal) => Promise<void>;
};

export type BootTaskContext = {
  emit: (line: Omit<LogLine, "elapsedMs">) => void;
};

export type BootTaskResult = {
  status: "success" | "warning" | "error";
  message: string;
  report?: BootCompletion["diagnostics"];
};

export type BootTask = {
  id: string;
  phase: BootPhase;
  command: string;
  minDurationMs: number;
  timeoutMs: number;
  run: (context: BootTaskContext) => Promise<BootTaskResult>;
};

export class BootAbortedError extends Error {
  constructor() {
    super("Boot aborted");
    this.name = "BootAbortedError";
  }
}
