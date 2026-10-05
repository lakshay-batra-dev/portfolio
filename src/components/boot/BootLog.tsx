import type { TypedLogLine } from "./useTypedLog";
import { TerminalCursor } from "./TerminalCursor";

function BootLine({ line }: { line: TypedLogLine }) {
  if (line.kind === "rule") {
    return <div className="my-4 border-t border-boot-line" />;
  }

  const cursor = line.cursor ? <TerminalCursor /> : null;
  const tone = line.status === "error" ? "text-boot-err" : line.status === "warning" ? "text-boot-warn" : undefined;
  const lead = line.id === "diagnostics:command" ? "mt-6" : "";

  return (
    <p className={`leading-7 ${tone ?? ""} ${lead}`}>
      <span className="sr-only">{line.kind === "command" ? `> ${line.text}` : line.text}</span>
      <span aria-hidden="true">
        {line.kind === "command" ? <span className="text-boot-dim">{"> "}</span> : null}
        {line.shown}
        {cursor}
      </span>
    </p>
  );
}

export function BootLog({ lines }: { lines: TypedLogLine[] }) {
  return (
    <div role="log" aria-live="polite" aria-relevant="additions" aria-label="Boot log" className="text-[14px] sm:text-[15px]">
      {lines.map((line) => (
        <BootLine key={line.id} line={line} />
      ))}
    </div>
  );
}
