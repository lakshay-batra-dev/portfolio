"use client";

import { useState } from "react";
import { executeCommand } from "./terminalParser";
import { emptyHistory, submitHistory } from "./terminalHistory";
import { TerminalInput } from "./TerminalInput";
import { TerminalOutput } from "./TerminalOutput";
import type { HistoryState, NavigateRequest, OutputLine } from "./terminalTypes";
import { HOME_PATH, promptFor } from "./virtualFileSystem";

const INTRO: OutputLine[] = [
  { text: "DEBUG//LAKSHAY terminal", tone: "text" },
  { text: "Type `help` to see available commands.", tone: "dim" },
];

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function Terminal({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (target: NavigateRequest) => void;
}) {
  const [cwd, setCwd] = useState(HOME_PATH);
  const [lines, setLines] = useState<OutputLine[]>(INTRO);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<HistoryState>(emptyHistory());

  function submit(command: string) {
    const result = executeCommand(command, cwd);
    setHistory(submitHistory(history, command));
    setCwd(result.cwd);
    setValue("");
    setLines((current) => (result.clear ? [] : [...current, { text: `${promptFor(cwd)} ${command}`, tone: "dim" }, ...result.lines]));
    if (result.navigate) onNavigate(result.navigate);
  }

  return (
    <section
      id="terminal-panel"
      aria-label="Terminal"
      aria-hidden={open ? undefined : true}
      className={
        open
          ? "terminal-open fixed inset-0 z-30 flex min-h-0 flex-col bg-boot-bg md:static md:z-auto md:h-64 md:max-h-[42%] md:shrink-0 md:border-t md:border-boot-line"
          : "hidden"
      }
    >
      <header className="flex shrink-0 items-center justify-between border-b border-boot-line px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-boot-dim">
        <h2>TERMINAL</h2>
        <button type="button" onClick={onClose} aria-label="Close terminal" className={`px-1 text-boot-text ${focus}`}>
          ×
        </button>
      </header>
      <TerminalOutput lines={lines} />
      <TerminalInput
        prompt={promptFor(cwd)}
        cwd={cwd}
        value={value}
        history={history}
        onValue={setValue}
        onHistory={setHistory}
        onSubmit={submit}
        onMatches={(matches) => setLines((current) => [...current, ...matches])}
        active={open}
      />
    </section>
  );
}
