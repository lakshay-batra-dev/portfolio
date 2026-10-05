import type { BootCompletion, TaskStatus } from "@/lib/boot/types";
import { Chassis } from "@/components/boot/Chassis";
import type { Lamp } from "@/components/boot/StatusLamps";

function lampsFor(completion: BootCompletion): Lamp[] {
  const statusFor = (id: string, fallback: TaskStatus): TaskStatus => completion.tasks[id] ?? fallback;

  return [
    { id: "kernel", label: "Kernel", status: statusFor("kernel", "success") },
    { id: "control", label: "Runtime", status: statusFor("control", "success") },
    { id: "diagnostics", label: "Diag", status: statusFor("diagnostics", "warning") },
  ];
}

export function PortfolioGate({ completion }: { completion: BootCompletion }) {
  return (
    <Chassis phaseLabel="PORTFOLIO" lamps={lampsFor(completion)}>
      <p className="text-[13px] tracking-[0.16em] text-boot-dim">OPENING COMPLETE</p>
    </Chassis>
  );
}
