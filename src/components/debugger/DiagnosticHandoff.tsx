import type { BootCompletion, TaskStatus } from "@/lib/boot/types";
import { formatAnomalyCount } from "@/lib/boot/initialize";
import { Chassis } from "@/components/boot/Chassis";
import type { Lamp } from "@/components/boot/StatusLamps";
import { TerminalCursor } from "@/components/boot/TerminalCursor";

function lampsFor(completion: BootCompletion): Lamp[] {
  const statusFor = (id: string, fallback: TaskStatus): TaskStatus => completion.tasks[id] ?? fallback;

  return [
    { id: "kernel", label: "Kernel", status: statusFor("kernel", "success") },
    { id: "control", label: "Runtime", status: statusFor("control", "success") },
    { id: "diagnostics", label: "Diag", status: statusFor("diagnostics", "warning") },
  ];
}

/**
 * Boot hands off here. The debugger mounts after this beat.
 */
export function DiagnosticHandoff({ completion }: { completion: BootCompletion }) {
  const { anomalyCount, integrity } = completion.diagnostics;

  return (
    <Chassis phaseLabel="DIAGNOSTICS" lamps={lampsFor(completion)}>
      <section id="diagnostic-session" data-state="ready" aria-live="polite" className="text-[14px] leading-7 sm:text-[15px]">
        <p className="text-boot-err">{formatAnomalyCount(anomalyCount)}</p>
        <p className="mt-3">Integrity: {integrity}%</p>
        <p className="mt-8">
          INVESTIGATION REQUIRED
          <TerminalCursor />
        </p>
      </section>
    </Chassis>
  );
}
