"use client";

import { useEffect, useRef } from "react";
import type { BootCompletion, BootSnapshot, TaskStatus } from "@/lib/boot/types";
import { BootLog } from "./BootLog";
import { Chassis } from "./Chassis";
import type { Lamp } from "./StatusLamps";
import { useBootSequence } from "./useBootSequence";
import { useTypedLog } from "./useTypedLog";

const lampSpecs = [
  { id: "kernel", label: "Kernel" },
  { id: "control", label: "Runtime" },
  { id: "diagnostics", label: "Diag" },
] as const;

function lampsFor(snapshot: BootSnapshot): Lamp[] {
  return lampSpecs.map((spec) => {
    const finished = snapshot.completed[spec.id];
    const status: TaskStatus = finished ?? (snapshot.activeTaskId === spec.id ? "running" : "pending");
    return { id: spec.id, label: spec.label, status };
  });
}

export function BootScreen({ onComplete }: { onComplete: (completion: BootCompletion) => void }) {
  const snapshot = useBootSequence();
  const typed = useTypedLog(snapshot.lines);
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || snapshot.phase !== "BOOT_COMPLETE" || !snapshot.completion || !typed.done) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = window.setTimeout(() => {
      if (!snapshot.completion || sent.current) {
        return;
      }
      sent.current = true;
      onComplete(snapshot.completion);
    }, reduceMotion ? 400 : 700);

    return () => window.clearTimeout(hold);
  }, [onComplete, snapshot.completion, snapshot.phase, typed.done]);

  return (
    <Chassis phaseLabel="BOOT" lamps={lampsFor(snapshot)}>
      <BootLog lines={typed.lines} />
    </Chassis>
  );
}
