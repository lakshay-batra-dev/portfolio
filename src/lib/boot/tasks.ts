import {
  checkCaffeine,
  initializeDiagnosticEngine,
  initializeKernel,
  loadExperienceModule,
  loadProjectRegistry,
  negotiateWithCpu,
  prepareApplicationState,
  prepareRepositoryLayer,
  runSystemDiagnostics,
  searchForSemicolons,
} from "./initialize";
import type { BootTask } from "./types";

export const bootTasks: BootTask[] = [
  {
    id: "kernel",
    phase: "INITIALIZE_KERNEL",
    command: "Initializing questionable life choices...",
    minDurationMs: 220,
    timeoutMs: 2000,
    async run() {
      const kernel = initializeKernel();
      if (!kernel.ready) {
        throw new Error("Kernel did not start");
      }
      return { status: "success", message: "Ready" };
    },
  },
  {
    id: "caffeine",
    phase: "INITIALIZE_KERNEL",
    command: "Checking caffeine reserves... OK",
    minDurationMs: 220,
    timeoutMs: 2000,
    async run() {
      const caffeine = checkCaffeine();
      return {
        status: caffeine.acceptable ? "success" : "warning",
        message: "OK",
      };
    },
  },
  {
    id: "cpu",
    phase: "INITIALIZE_KERNEL",
    command: "Negotiating with the CPU...",
    minDurationMs: 220,
    timeoutMs: 2000,
    async run() {
      const cpu = negotiateWithCpu();
      if (!cpu.agreed) {
        throw new Error("CPU declined");
      }
      return { status: "success", message: "Agreed" };
    },
  },
  {
    id: "javascript",
    phase: "LOAD_PROJECTS",
    command: "Loading suspicious amounts of JavaScript...",
    minDurationMs: 220,
    timeoutMs: 2000,
    async run() {
      loadProjectRegistry();
      return { status: "success", message: "Loaded" };
    },
  },
  {
    id: "bugs",
    phase: "LOAD_PROJECTS",
    command: "Looking for bugs before they look for me...",
    minDurationMs: 220,
    timeoutMs: 2000,
    async run() {
      loadExperienceModule();
      return { status: "success", message: "Looking" };
    },
  },
  {
    id: "semicolons",
    phase: "PREPARE_APPLICATION",
    command: "Searching for missing semicolons...",
    minDurationMs: 220,
    timeoutMs: 2000,
    async run() {
      searchForSemicolons();
      return { status: "success", message: "Searched" };
    },
  },
  {
    id: "compiler",
    phase: "INITIALIZE_DIAGNOSTICS",
    command: "Asking the compiler nicely...",
    minDurationMs: 220,
    timeoutMs: 2000,
    async run() {
      initializeDiagnosticEngine();
      return { status: "success", message: "Ready" };
    },
  },
  {
    id: "control",
    phase: "PREPARE_APPLICATION",
    command: "Pretending everything is under control...",
    minDurationMs: 220,
    timeoutMs: 2000,
    async run() {
      const repository = prepareRepositoryLayer();
      const session = prepareApplicationState();
      if (!repository.ready || !session.diagnosticsReady) {
        throw new Error("Application state is incomplete");
      }
      return { status: "success", message: "Prepared" };
    },
  },
  {
    id: "diagnostics",
    phase: "RUN_DIAGNOSTICS",
    command: "SYSTEM DIAGNOSTICS",
    minDurationMs: 120,
    timeoutMs: 2000,
    async run() {
      const report = runSystemDiagnostics();
      return {
        status: "warning",
        message: "Investigation required",
        report,
      };
    },
  },
];
