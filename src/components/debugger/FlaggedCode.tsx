import type { Challenge } from "@/data/challenges";

export function FlaggedCode({
  challenge,
  draft,
  incorrect,
  disabled,
  onDraft,
}: {
  challenge: Challenge;
  draft: string;
  incorrect: boolean;
  disabled: boolean;
  onDraft: (value: string) => void;
}) {
  return (
    <div className="mt-5 overflow-x-auto border border-boot-line" role="group" aria-label="C++ source">
      <ol>
        {challenge.lines.map((line) => {
          const flagged = line.number === challenge.flaggedLine;
          return (
            <li
              key={line.number}
              className={`grid grid-cols-[2.75rem_minmax(0,1fr)] text-[13px] leading-6 ${
                flagged ? "border-l-2 border-boot-warn bg-boot-warn/10" : "border-l-2 border-transparent"
              }`}
            >
              <span className={`pr-3 text-right ${flagged ? "text-boot-warn" : "text-boot-dim"}`}>{line.number}</span>
              {flagged ? (
                <input
                  value={draft}
                  disabled={disabled}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  aria-label={`Line ${line.number}, flagged`}
                  aria-invalid={incorrect}
                  autoFocus
                  onChange={(event) => onDraft(event.target.value)}
                  className="m-0 w-full min-w-0 border-0 bg-transparent p-0 pr-3 font-mono text-[13px] leading-6 text-boot-text outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn disabled:opacity-70"
                />
              ) : (
                <code className="block whitespace-pre pr-3 text-boot-text">{line.text || " "}</code>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
