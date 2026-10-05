import assert from "node:assert/strict";
import { test } from "node:test";
import { bootTasks } from "./tasks";
import { immediateClock, runBoot } from "./runBoot";
import type { BootSnapshot, BootTask } from "./types";
import { BootAbortedError } from "./types";

async function settle(
  tasks: BootTask[],
  signal?: AbortSignal,
): Promise<{ completion: Awaited<ReturnType<typeof runBoot>>; snapshot: BootSnapshot }> {
  let snapshot: BootSnapshot | null = null;
  const completion = await runBoot(tasks, {
    clock: immediateClock,
    signal,
    onSnapshot: (next) => {
      snapshot = next;
    },
  });

  if (!snapshot) {
    throw new Error("Boot did not publish a snapshot");
  }

  return { completion, snapshot };
}

test("boot initializes local data and ends on the diagnostic handoff", async () => {
  const { completion, snapshot } = await settle(bootTasks);
  const text = snapshot.lines.map((line) => line.text);

  assert.equal(completion.status, "complete");
  assert.equal(completion.diagnostics.anomalyCount, 1);
  assert.equal(completion.diagnostics.integrity, 87);
  assert.equal(snapshot.phase, "BOOT_COMPLETE");
  assert.equal(completion.tasks.kernel, "success");
  assert.equal(completion.tasks.control, "success");
  assert.equal(completion.tasks.diagnostics, "warning");
  assert.equal(text.filter((line) => line === "Checking...").length, 3);
  assert.ok(text.indexOf("[ OK ] Checking if `it works on my machine`...") < text.indexOf("SYSTEM DIAGNOSTICS"));
  assert.ok(text.includes('[WARN] 47 commits named "final_final_v2".'));
  assert.ok(!text.some((line) => line.includes("questionable life choices")));
  assert.ok(text.indexOf("SYSTEM DIAGNOSTICS") < text.indexOf("1 anomaly detected"));
  assert.ok(text.indexOf("1 anomaly detected") < text.indexOf("Integrity: 87%"));
  assert.ok(!text.some((line) => line.includes("LAKSHAY BATRA") || line.includes("SOFTWARE ENGINEER")));
  assert.ok(!text.some((line) => line.includes("3 anomalies")));
  assert.equal(text.at(-1), "INVESTIGATION REQUIRED");
  assert.equal(snapshot.cursorLineId, "diagnostic-investigation");
});

test("a failed task warns and the boot still completes", async () => {
  const tasks: BootTask[] = [
    {
      id: "repository",
      phase: "PREPARE_APPLICATION",
      command: "Loading repository metadata...",
      minDurationMs: 0,
      timeoutMs: 1000,
      async run() {
        throw new Error("offline");
      },
    },
  ];

  const { completion, snapshot } = await settle(tasks);
  assert.equal(completion.status, "complete");
  assert.equal(completion.tasks.repository, "warning");
  assert.ok(snapshot.lines.some((line) => line.text === "Unavailable — continuing offline"));
  assert.equal(snapshot.lines.at(-1)?.text, "INVESTIGATION REQUIRED");
});

test("a task that exceeds its timeout continues", async () => {
  const tasks: BootTask[] = [
    {
      id: "repository",
      phase: "PREPARE_APPLICATION",
      command: "Loading repository metadata...",
      minDurationMs: 0,
      timeoutMs: 20,
      run: () => new Promise(() => {}),
    },
  ];

  const { completion, snapshot } = await settle(tasks);
  assert.equal(completion.status, "complete");
  assert.ok(snapshot.lines.some((line) => line.text === "Timed out — continuing"));
});

test("an aborted boot does not complete", async () => {
  const controller = new AbortController();
  const tasks: BootTask[] = [
    {
      id: "kernel",
      phase: "INITIALIZE_KERNEL",
      command: "Initializing portfolio kernel...",
      minDurationMs: 0,
      timeoutMs: 2000,
      run: () => new Promise(() => {}),
    },
  ];

  const pending = runBoot(tasks, {
    clock: immediateClock,
    signal: controller.signal,
    onSnapshot: () => {},
  });

  controller.abort();
  await assert.rejects(pending, BootAbortedError);
});
