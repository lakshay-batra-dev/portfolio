"use client";

import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-boot-warn";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full`}>
      <body className="h-full bg-boot-bg font-mono text-boot-text antialiased">
        <main className="flex min-h-full flex-col">
          <header className="border-b border-boot-line px-4 py-3 text-[12px] tracking-[0.12em]">LAKSHAY BATRA</header>
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-16">
            <p className="text-[12px] tracking-[0.14em] text-boot-dim">ERROR</p>
            <h1 className="mt-3 font-sans text-[1.75rem] font-medium tracking-tight">Something went wrong</h1>
            <p className="mt-8 border border-boot-line px-4 py-3 text-[13px] leading-6 text-boot-dim">This view could not be displayed.</p>
            <button type="button" onClick={() => retry()} className={`mt-8 w-fit border border-boot-text px-3 py-2 text-[12px] tracking-[0.12em] ${focus}`}>
              TRY AGAIN
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
