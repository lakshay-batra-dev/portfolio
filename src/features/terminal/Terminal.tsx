"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { executeCommand } from "./terminalParser";
import { emptyHistory, submitHistory } from "./terminalHistory";
import { TerminalInput } from "./TerminalInput";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalResizeHandle } from "./TerminalResizeHandle";
import { clampTerminalHeight, TERMINAL_DEFAULT_HEIGHT, terminalHeightLimits } from "./terminalResize";
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
  const [height, setHeight] = useState(TERMINAL_DEFAULT_HEIGHT);
  const [limits, setLimits] = useState({ min: 160, max: TERMINAL_DEFAULT_HEIGHT });
  const panelRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const workspace = panelRef.current?.parentElement;
    if (!workspace) {
      return;
    }

    const measure = () => {
      const next = terminalHeightLimits(workspace.clientHeight);
      setLimits((current) => (current.min === next.min && current.max === next.max ? current : next));
      setHeight((current) => {
        const clamped = clampTerminalHeight(current, workspace.clientHeight);
        return clamped === current ? current : clamped;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(workspace);
    return () => observer.disconnect();
  }, []);

  function resize(next: number) {
    const workspace = panelRef.current?.parentElement?.clientHeight ?? 0;
    const bounded = terminalHeightLimits(workspace);
    setHeight(Math.min(bounded.max, Math.max(bounded.min, Math.round(next))));
  }

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
      ref={panelRef}
      id="terminal-panel"
      aria-label="Terminal"
      aria-hidden={open ? undefined : true}
      className={
        open
          ? "terminal-open terminal-panel fixed inset-0 z-30 flex min-h-0 flex-col bg-boot-bg md:relative md:z-auto md:border-t md:border-boot-line"
          : "hidden"
      }
      style={{ "--terminal-height": `${height}px` } as CSSProperties}
    >
      {open ? <TerminalResizeHandle height={height} min={limits.min} max={limits.max} onResize={resize} /> : null}
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
