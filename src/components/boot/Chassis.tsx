import type { ReactNode } from "react";
import { StatusLamps, type Lamp } from "./StatusLamps";

export function Chassis({
  phaseLabel,
  lamps,
  children,
}: {
  phaseLabel: string;
  lamps: Lamp[];
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 py-8 sm:px-12 sm:py-14">
      <header className="flex flex-col gap-1 border-b border-boot-line pb-3 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-[14px] tracking-[0.12em]">DEBUG//LAKSHAY</h1>
        <p className="text-[12px] tracking-[0.14em] text-boot-dim">{phaseLabel}</p>
      </header>
      <div className="mt-6">{children}</div>
      <StatusLamps lamps={lamps} />
    </main>
  );
}
