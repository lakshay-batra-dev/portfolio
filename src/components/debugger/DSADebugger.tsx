"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { twoSumChallenge } from "@/data/challenges";
import type { BootCompletion, TaskStatus } from "@/lib/boot/types";
import { browserDebuggerStore, rememberDebuggerOutcome, type DebuggerOutcome } from "@/lib/debugger/storage";
import { isCorrectFix } from "@/lib/debugger/validation";
import { Chassis } from "@/components/boot/Chassis";
import type { Lamp } from "@/components/boot/StatusLamps";
import { ExitBridge, exitLines } from "./ExitBridge";
import { FlaggedCode } from "./FlaggedCode";
import { TwoSumVisualization } from "./TwoSumVisualization";

const LIMIT_MS = 30_000;
const challenge = twoSumChallenge;
const flaggedText = challenge.lines.find((line) => line.number === challenge.flaggedLine)?.text ?? "";

const exitDelay: Record<DebuggerOutcome, number> = {
  solved: 1600,
  skipped: 1900,
  timeout: 2200,
};

function lampsFor(completion: BootCompletion): Lamp[] {
  const statusFor = (id: string, fallback: TaskStatus): TaskStatus => completion.tasks[id] ?? fallback;

  return [
    { id: "kernel", label: "Kernel", status: statusFor("kernel", "success") },
    { id: "control", label: "Runtime", status: statusFor("control", "success") },
    { id: "diagnostics", label: "Diag", status: statusFor("diagnostics", "warning") },
  ];
}

export function DSADebugger({ completion, onDone }: { completion: BootCompletion; onDone: () => void }) {
  const [draft, setDraft] = useState(flaggedText);
  const [incorrect, setIncorrect] = useState(false);
  const [remaining, setRemaining] = useState(LIMIT_MS);
  const [exit, setExit] = useState<DebuggerOutcome | null>(null);
  const [skipHover, setSkipHover] = useState(false);
  const exitRef = useRef<DebuggerOutcome | null>(null);
  const onDoneRef = useRef(onDone);
  const finishRef = useRef<(outcome: DebuggerOutcome) => void>(() => {});

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    finishRef.current = (outcome) => {
      if (exitRef.current) {
        return;
      }
      exitRef.current = outcome;
      setExit(outcome);
      rememberDebuggerOutcome(browserDebuggerStore(), outcome);
      window.setTimeout(() => onDoneRef.current(), exitDelay[outcome]);
    };
  }, []);

  useEffect(() => {
    const started = performance.now();
    const id = window.setInterval(() => {
      if (exitRef.current) {
        window.clearInterval(id);
        return;
      }
      const left = Math.max(0, LIMIT_MS - (performance.now() - started));
      setRemaining(left);
      if (left === 0) {
        window.clearInterval(id);
        finishRef.current("timeout");
      }
    }, 250);

    return () => window.clearInterval(id);
  }, []);

  const seconds = Math.ceil(remaining / 1000);

  function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (exitRef.current) {
      return;
    }
    if (isCorrectFix(draft, challenge.expectedFix)) {
      finishRef.current("solved");
      return;
    }
    setIncorrect(true);
  }

  return (
    <Chassis phaseLabel="DEBUG" lamps={lampsFor(completion)}>
      <section data-screen="debugger" aria-labelledby="debugger-anomaly">
        {exit ? (
          <ExitBridge lines={[...exitLines[exit]]} />
        ) : (
          <form onSubmit={verify}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="debugger-anomaly" className="text-[14px] tracking-[0.14em] text-boot-warn">
                ANOMALY DETECTED
              </h2>
              <p role="timer" aria-live="off" aria-label={`${seconds} seconds remaining`} className="text-[12px] tabular-nums text-boot-dim">
                {seconds}s
              </p>
            </div>
            <div className="mt-3 h-px bg-boot-line" aria-hidden="true">
              <div className="h-px bg-boot-warn" style={{ width: `${(remaining / LIMIT_MS) * 100}%` }} />
            </div>
            <p className="mt-4 text-[14px] leading-7">One line is off.</p>
            <p className="text-[14px] leading-7">
              Line {challenge.flaggedLine} is flagged. Correct the smallest thing that is wrong.
            </p>
            <div className="mt-6 flex items-baseline justify-between gap-4">
              <h3 className="text-[13px] tracking-[0.14em]">{challenge.title.toUpperCase()}</h3>
              <p className="text-[12px] text-boot-dim">C++</p>
            </div>
            <TwoSumVisualization visualization={challenge.visualization} />
            <FlaggedCode
              challenge={challenge}
              draft={draft}
              incorrect={incorrect}
              disabled={false}
              onDraft={(value) => {
                setDraft(value);
                setIncorrect(false);
              }}
            />
            {incorrect ? (
              <p role="status" className="mt-3 text-[13px] text-boot-warn">
                Not quite.
              </p>
            ) : null}
            <div className="sticky bottom-0 z-10 mt-5 flex flex-wrap items-center gap-3 border-t border-boot-line bg-boot-bg py-3">
              <button
                type="submit"
                className="border border-boot-text px-3 py-2 text-[12px] tracking-[0.12em] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn"
              >
                VERIFY FIX →
              </button>
              <button
                type="button"
                aria-label="Skip debugging"
                onMouseEnter={() => setSkipHover(true)}
                onMouseLeave={() => setSkipHover(false)}
                onClick={() => finishRef.current("skipped")}
                className="inline-grid border border-boot-line px-3 py-2 text-[12px] tracking-[0.12em] text-boot-dim focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn"
              >
                <span className={skipHover ? "invisible col-start-1 row-start-1" : "col-start-1 row-start-1"}>SKIP DEBUGGING →</span>
                <span aria-hidden="true" className={skipHover ? "col-start-1 row-start-1" : "invisible col-start-1 row-start-1"}>
                  I&apos;M DUMB →
                </span>
              </button>
            </div>
          </form>
        )}
      </section>
    </Chassis>
  );
}
