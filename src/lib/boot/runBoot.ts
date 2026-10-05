import { fallbackCompletion, formatAnomalyCount } from "./initialize";
import type {
  BootClock,
  BootCompletion,
  BootPhase,
  BootSnapshot,
  BootTask,
  BootTaskResult,
  LogLine,
} from "./types";
import { BootAbortedError } from "./types";

export const realClock: BootClock = {
  now: () => performance.now(),
  sleep: (ms, signal) =>
    new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new BootAbortedError());
        return;
      }

      const timer = setTimeout(() => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }, ms);

      const onAbort = () => {
        clearTimeout(timer);
        reject(new BootAbortedError());
      };

      signal?.addEventListener("abort", onAbort, { once: true });
    }),
};

export const immediateClock: BootClock = {
  now: () => 0,
  sleep: async (_ms, signal) => {
    if (signal?.aborted) {
      throw new BootAbortedError();
    }
  },
};

export function createInitialSnapshot(): BootSnapshot {
  return {
    phase: "BOOT_START",
    lines: [],
    cursorLineId: null,
    activeTaskId: null,
    completed: {},
    completion: null,
  };
}

function withTimeout<T>(work: Promise<T>, ms: number, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      signal?.removeEventListener("abort", onAbort);
      reject(new Error("timeout"));
    }, ms);

    const onAbort = () => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      reject(new BootAbortedError());
    };

    if (signal?.aborted) {
      onAbort();
      return;
    }

    signal?.addEventListener("abort", onAbort, { once: true });

    work.then(
      (value) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error: unknown) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
        reject(error);
      },
    );
  });
}

function failureResult(error: unknown): BootTaskResult {
  if (error instanceof Error && error.message === "timeout") {
    return { status: "warning", message: "Timed out — continuing" };
  }

  return { status: "warning", message: "Unavailable — continuing offline" };
}

export async function runBoot(
  tasks: BootTask[],
  options: {
    clock?: BootClock;
    signal?: AbortSignal;
    onSnapshot: (snapshot: BootSnapshot) => void;
  },
): Promise<BootCompletion> {
  const clock = options.clock ?? realClock;
  const origin = clock.now();
  const lines: LogLine[] = [];
  const completed: BootSnapshot["completed"] = {};
  let phase: BootPhase = "BOOT_START";
  let cursorLineId: string | null = null;
  let activeTaskId: string | null = null;
  let report: BootCompletion["diagnostics"] | undefined;
  let completion: BootCompletion | null = null;

  const publish = () => {
    options.onSnapshot({
      phase,
      lines: lines.slice(),
      cursorLineId,
      activeTaskId,
      completed: { ...completed },
      completion,
    });
  };

  const pushLine = (line: Omit<LogLine, "elapsedMs">) => {
    lines.push({
      ...line,
      elapsedMs: Math.max(0, clock.now() - origin),
    });
    cursorLineId = line.kind === "command" ? line.id : cursorLineId;
    publish();
  };

  for (const task of tasks) {
    if (options.signal?.aborted) {
      throw new BootAbortedError();
    }

    phase = task.phase;
    activeTaskId = task.id;
    const commandId = `${task.id}:command`;
    pushLine({
      id: commandId,
      kind: "command",
      text: task.command,
      status: "running",
    });
    cursorLineId = commandId;

    const started = clock.now();
    let result: BootTaskResult;

    try {
      result = await withTimeout(
        task.run({
          emit: (line) => {
            pushLine(line);
          },
        }),
        task.timeoutMs,
        options.signal,
      );
    } catch (error) {
      if (error instanceof BootAbortedError) {
        throw error;
      }
      result = failureResult(error);
    }

    const elapsed = clock.now() - started;
    const remaining = Math.max(0, task.minDurationMs - elapsed);
    if (remaining > 0) {
      await clock.sleep(remaining, options.signal);
    }

    if (result.report) {
      report = result.report;
    }

    completed[task.id] = result.status;
    if (!result.report && result.status !== "success") {
      pushLine({
        id: `${task.id}:result`,
        kind: "result",
        text: result.message,
        status: result.status,
      });
    }
    activeTaskId = null;
  }

  const diagnostics = report ?? fallbackCompletion().diagnostics;
  completion = {
    status: "complete",
    diagnostics,
    tasks: { ...completed } as BootCompletion["tasks"],
  };

  phase = "BOOT_COMPLETE";
  activeTaskId = null;

  for (let index = 0; index < 3; index += 1) {
    pushLine({
      id: `checking-${index}`,
      kind: "command",
      text: "Checking...",
      status: "running",
    });
  }

  pushLine({
    id: "anomaly",
    kind: "command",
    text: formatAnomalyCount(diagnostics.anomalyCount),
    status: "error",
  });
  pushLine({
    id: "integrity",
    kind: "command",
    text: `Integrity: ${diagnostics.integrity}%`,
  });
  const investigationId = "diagnostic-investigation";
  pushLine({
    id: investigationId,
    kind: "command",
    text: "INVESTIGATION REQUIRED",
    status: "warning",
  });
  cursorLineId = investigationId;
  publish();

  return completion;
}
