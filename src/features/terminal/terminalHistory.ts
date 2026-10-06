import type { HistoryState } from "./terminalTypes";

export function emptyHistory(): HistoryState {
  return { entries: [], cursor: 0, draft: "" };
}

export function submitHistory(state: HistoryState, line: string): HistoryState {
  const trimmed = line.trim();
  const entries = trimmed ? [...state.entries, line] : state.entries;
  return { entries, cursor: entries.length, draft: "" };
}

export function moveHistory(state: HistoryState, direction: "up" | "down", current: string): { state: HistoryState; value: string } {
  if (direction === "up") {
    if (state.cursor === 0) return { state, value: state.entries[0] ?? current };
    const draft = state.cursor === state.entries.length ? current : state.draft;
    const cursor = state.cursor - 1;
    return { state: { ...state, cursor, draft }, value: state.entries[cursor] ?? current };
  }

  if (state.cursor >= state.entries.length) return { state, value: state.draft };
  const cursor = state.cursor + 1;
  const value = cursor === state.entries.length ? state.draft : (state.entries[cursor] ?? "");
  return { state: { ...state, cursor }, value };
}
