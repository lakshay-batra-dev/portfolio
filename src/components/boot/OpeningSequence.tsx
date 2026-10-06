"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
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

function subscribeBootSession() {
  return () => {};
}

function clientBootStage(): "portfolio" | "boot" {
  return readBootSession(browserSessionStore()) ? "portfolio" : "boot";
}

function serverBootStage(): "pending" {
  return "pending";
}

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
  const resumed = useSyncExternalStore(subscribeBootSession, clientBootStage, serverBootStage);
  const visible: Stage = stage === "pending" ? resumed : stage;
  const [flicker, setFlicker] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (visible === "portfolio") {
      rememberBootSession(browserSessionStore());
    }
  }, [visible]);

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
    if (visible !== "handoff") {
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
  }, [visible]);

  useEffect(() => {
    if (visible !== "bridge") {
      return;
    }

    const id = window.setTimeout(() => setStage("portfolio"), 2000);
    return () => window.clearTimeout(id);
  }, [visible]);

  const showPortfolio = useCallback(() => setStage("portfolio"), []);

  return (
    <div
      className={`relative bg-boot-bg text-boot-text ${visible === "portfolio" ? "h-full overflow-hidden" : "boot-glow min-h-dvh"}`}
    >
      {visible === "boot" ? <BootScreen onComplete={handleComplete} /> : null}
      {visible === "handoff" && completion ? <DiagnosticHandoff completion={completion} /> : null}
      {visible === "debugger" && completion ? <DSADebugger completion={completion} onDone={showPortfolio} /> : null}
      {visible === "bridge" && completion ? (
        <Chassis phaseLabel="DEBUG" lamps={lampsFor(completion)}>
          <ExitBridge lines={[...exitLines.mobile]} />
        </Chassis>
      ) : null}
      {visible === "portfolio" ? <Workspace /> : null}
      {visible === "portfolio" || visible === "pending" ? null : <CrtOverlay />}
      {flicker ? <div className="boot-flicker" aria-hidden="true" /> : null}
    </div>
  );
}
