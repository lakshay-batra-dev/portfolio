export const DEBUGGER_MEMORY_KEY = "debug-lakshay.debugger";
export const BOOT_SESSION_KEY = "debug-lakshay.boot-session";
export const DEBUGGER_MEMORY_MS = 3 * 24 * 60 * 60 * 1000;

export type DebuggerOutcome = "solved" | "skipped" | "timeout";

export type DebuggerVisit = {
  outcome: DebuggerOutcome;
  at: number;
};

export type DebuggerStore = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const outcomes = new Set<DebuggerOutcome>(["solved", "skipped", "timeout"]);

function parseVisit(raw: string | null): DebuggerVisit | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const outcome = "outcome" in parsed ? parsed.outcome : null;
    const at = "at" in parsed ? parsed.at : null;
    if (typeof outcome !== "string" || !outcomes.has(outcome as DebuggerOutcome) || typeof at !== "number") {
      return null;
    }

    return { outcome: outcome as DebuggerOutcome, at };
  } catch {
    return null;
  }
}

export function readDebuggerVisit(store: DebuggerStore, now = Date.now()): DebuggerVisit | null {
  let raw: string | null = null;
  try {
    raw = store.getItem(DEBUGGER_MEMORY_KEY);
  } catch {
    return null;
  }

  const visit = parseVisit(raw);
  if (!visit) {
    return null;
  }

  if (now - visit.at >= DEBUGGER_MEMORY_MS) {
    return null;
  }

  return visit;
}

export function rememberDebuggerOutcome(store: DebuggerStore, outcome: DebuggerOutcome, now = Date.now()) {
  const visit: DebuggerVisit = { outcome, at: now };
  try {
    store.setItem(DEBUGGER_MEMORY_KEY, JSON.stringify(visit));
  } catch {
    // Private mode or a full disk should not trap the visitor on the debugger.
  }
}

export function browserDebuggerStore(): DebuggerStore {
  return window.localStorage;
}

export function readBootSession(store: DebuggerStore) {
  try {
    return store.getItem(BOOT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberBootSession(store: DebuggerStore) {
  try {
    store.setItem(BOOT_SESSION_KEY, "1");
  } catch {
    // A blocked session store should fall back to showing the boot.
  }
}

export function browserSessionStore(): DebuggerStore {
  return window.sessionStorage;
}
