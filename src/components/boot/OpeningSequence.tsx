"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DiagnosticHandoff } from "@/components/debugger/DiagnosticHandoff";
import { DSADebugger } from "@/components/debugger/DSADebugger";
import { ExitBridge, exitLines } from "@/components/debugger/ExitBridge";
import { Workspace } from "@/components/portfolio/Workspace";
import type { BootCompletion, TaskStatus } from "@/lib/boot/types";
import { browserDebuggerStore, browserSessionStore, readBootSession, readDebuggerVisit, rememberBootSession } from "@/lib/debugger/storage";
import { Chassis } from "./Chassis";
import { BootScreen } from "./BootScreen";
import { CrtOverlay } from "./CrtOverlay";
import type { Lamp } from "./StatusLamps";

type Stage = "pending" | "boot" | "handoff" | "debugger" | "bridge" | "portfolio";

const MOBILE_QUERY = "(max-width: 720px)";

function lampsFor(completion: BootCompletion): Lamp[] {
  const statusFor = (id: string, fallback: TaskStatus): TaskStatus => completion.tasks[id] ?? fallback;

  return [
    { id: "kernel", label: "Kernel", status: statusFor("kernel", "success") },
    { id: "control", label: "Runtime", status: statusFor("control", "success") },
    { id: "diagnostics", label: "Diag", status: statusFor("diagnostics", "warning") },
  ];
}

export function OpeningSequence() {
  const [completion, setCompletion] = useState<BootCompletion | null>(null);
  const [stage, setStage] = useState<Stage>("pending");
  const [flicker, setFlicker] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    setStage(readBootSession(browserSessionStore()) ? "portfolio" : "boot");
  }, []);

  useEffect(() => {
    if (stage === "portfolio") {
      rememberBootSession(browserSessionStore());
    }
  }, [stage]);

  const handleComplete = useCallback((result: BootCompletion) => {
    const reveal = () => {
      setCompletion(result);
      setStage("handoff");
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      reveal();
      return;
    }

    setFlicker(true);
    timers.current.push(window.setTimeout(reveal, 80));
    timers.current.push(window.setTimeout(() => setFlicker(false), 220));
  }, []);

  useEffect(() => {
    if (stage !== "handoff") {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => {
      if (window.matchMedia(MOBILE_QUERY).matches) {
        setStage("bridge");
        return;
      }
      if (readDebuggerVisit(browserDebuggerStore())) {
        setStage("portfolio");
        return;
      }
      setStage("debugger");
    }, reduceMotion ? 500 : 1100);

    return () => window.clearTimeout(id);
  }, [stage]);

  useEffect(() => {
    if (stage !== "bridge") {
      return;
    }

    const id = window.setTimeout(() => setStage("portfolio"), 2000);
    return () => window.clearTimeout(id);
  }, [stage]);

  const showPortfolio = useCallback(() => setStage("portfolio"), []);

  return (
    <div className={`${stage === "portfolio" ? "" : "boot-glow"} relative min-h-dvh bg-boot-bg text-boot-text`}>
      {stage === "boot" ? <BootScreen onComplete={handleComplete} /> : null}
      {stage === "handoff" && completion ? <DiagnosticHandoff completion={completion} /> : null}
      {stage === "debugger" && completion ? <DSADebugger completion={completion} onDone={showPortfolio} /> : null}
      {stage === "bridge" && completion ? (
        <Chassis phaseLabel="DEBUG" lamps={lampsFor(completion)}>
          <ExitBridge lines={[...exitLines.mobile]} />
        </Chassis>
      ) : null}
      {stage === "portfolio" ? <Workspace /> : null}
      {stage === "portfolio" || stage === "pending" ? null : <CrtOverlay />}
      {flicker ? <div className="boot-flicker" aria-hidden="true" /> : null}
    </div>
  );
}
