import { useEffect, useRef } from "react";
import { completeInput } from "./terminalCommands";
import { moveHistory } from "./terminalHistory";
import type { HistoryState, OutputLine } from "./terminalTypes";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function TerminalInput({
  prompt,
  cwd,
  value,
  history,
  onValue,
  onHistory,
  onSubmit,
  onMatches,
  active,
}: {
  prompt: string;
  cwd: string;
  value: string;
  history: HistoryState;
  onValue: (value: string) => void;
  onHistory: (history: HistoryState) => void;
  onSubmit: (value: string) => void;
  onMatches: (lines: OutputLine[]) => void;
  active: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  return (
    <form
      className="flex shrink-0 items-center gap-2 border-t border-boot-line px-3 py-2 font-mono text-[13px]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <label htmlFor="terminal-command" className="shrink-0 text-boot-ok">
        {prompt}
      </label>
      <input
        ref={inputRef}
        id="terminal-command"
        value={value}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="Terminal command"
        className={`min-w-0 flex-1 bg-transparent text-boot-text caret-boot-warn outline-none ${focus}`}
        onChange={(event) => onValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            const next = moveHistory(history, "up", value);
            onHistory(next.state);
            onValue(next.value);
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            const next = moveHistory(history, "down", value);
            onHistory(next.state);
            onValue(next.value);
          }
          if (event.key === "Tab") {
            event.preventDefault();
            const completed = completeInput(value, cwd);
            onValue(completed.line);
            if (completed.matches.length > 1) {
              onMatches(completed.matches.map((match) => ({ text: match, tone: "dim" })));
            }
          }
        }}
      />
    </form>
  );
}
