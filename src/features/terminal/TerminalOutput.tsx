import { useEffect, useRef } from "react";
import type { OutputLine } from "./terminalTypes";

const toneClass: Record<OutputLine["tone"], string> = {
  text: "text-boot-text",
  dim: "text-boot-dim",
  warn: "text-boot-warn",
  err: "text-boot-err",
  ok: "text-boot-ok",
};

export function TerminalOutput({ lines }: { lines: OutputLine[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [lines]);

  return (
    <div
      ref={scrollerRef}
      className="min-h-0 flex-1 overflow-y-auto px-3 py-3 font-mono text-[13px] leading-6"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Terminal output"
    >
      {lines.map((entry, index) => (
        <p key={`${index}-${entry.text}`} className={`whitespace-pre-wrap ${toneClass[entry.tone]}`}>
          {entry.text || "\u00a0"}
        </p>
      ))}
    </div>
  );
}
