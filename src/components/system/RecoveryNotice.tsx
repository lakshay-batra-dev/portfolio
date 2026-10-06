import Link from "next/link";
import type { ReactNode } from "react";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export function RecoveryNotice({
  code,
  title,
  detail,
  action,
}: {
  code: string;
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <main className="flex min-h-full flex-col bg-boot-bg text-boot-text">
      <header className="shrink-0 border-b border-boot-line px-4 py-3 font-mono text-[12px] tracking-[0.12em]">LAKSHAY BATRA</header>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-16">
        <p className="font-mono text-[12px] tracking-[0.14em] text-boot-dim">{code}</p>
        <h1 className="mt-3 font-sans text-[1.75rem] font-medium tracking-tight">{title}</h1>
        <p className="mt-8 border border-boot-line px-4 py-3 font-mono text-[13px] leading-6 whitespace-pre-wrap text-boot-dim">{detail}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {action}
          <Link href="/" className={`border border-boot-text px-3 py-2 font-mono text-[12px] tracking-[0.12em] text-boot-text ${focus}`}>
            RETURN HOME
          </Link>
        </div>
      </div>
    </main>
  );
}
