import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEBUGGER_MEMORY_KEY,
  DEBUGGER_MEMORY_MS,
  readDebuggerVisit,
  rememberDebuggerOutcome,
  type DebuggerStore,
} from "./storage";

function memoryStore(initial?: string | null): DebuggerStore & { value: string | null } {
  const box = { value: initial ?? null };
  return {
    get value() {
      return box.value;
    },
    set value(next: string | null) {
      box.value = next;
    },
    getItem() {
      return box.value;
    },
    setItem(_key, value) {
      box.value = value;
    },
  };
}

test("a visit is remembered for three days and then forgotten", () => {
  const now = 1_700_000_000_000;
  const store = memoryStore();
  rememberDebuggerOutcome(store, "solved", now);

  assert.equal(readDebuggerVisit(store, now + DEBUGGER_MEMORY_MS - 1)?.outcome, "solved");
  assert.equal(readDebuggerVisit(store, now + DEBUGGER_MEMORY_MS), null);
  assert.ok(store.getItem(DEBUGGER_MEMORY_KEY));
});

test("skip and timeout are stored the same way", () => {
  const store = memoryStore();
  rememberDebuggerOutcome(store, "skipped", 10);
  assert.equal(readDebuggerVisit(store, 10)?.outcome, "skipped");

  rememberDebuggerOutcome(store, "timeout", 20);
  assert.equal(readDebuggerVisit(store, 20)?.outcome, "timeout");
});

test("corrupt memory does not count as a visit", () => {
  assert.equal(readDebuggerVisit(memoryStore("not-json"), 0), null);
  assert.equal(readDebuggerVisit(memoryStore(JSON.stringify({ outcome: "mobile", at: 1 })), 1), null);
  assert.equal(readDebuggerVisit(memoryStore(null), 0), null);
});
