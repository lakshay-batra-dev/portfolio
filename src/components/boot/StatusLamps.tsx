import type { TaskStatus } from "@/lib/boot/types";

export type Lamp = {
  id: string;
  label: string;
  status: TaskStatus;
};

const lampClass: Record<TaskStatus, string> = {
  pending: "border border-boot-dim/40",
  running: "border border-boot-text bg-boot-text/50",
  success: "bg-boot-ok",
  warning: "bg-boot-warn",
  error: "bg-boot-err",
};

export function StatusLamps({ lamps }: { lamps: Lamp[] }) {
  return (
    <ul
      aria-label="Subsystem status"
      className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-boot-line pt-3 text-[12px] tracking-[0.12em] text-boot-dim uppercase"
    >
      {lamps.map((lamp) => (
        <li key={lamp.id} className="flex items-center gap-2" aria-label={`${lamp.label} ${lamp.status}`}>
          <span aria-hidden="true" className={`inline-block size-1.5 ${lampClass[lamp.status]}`} />
          {lamp.label}
        </li>
      ))}
    </ul>
  );
}
