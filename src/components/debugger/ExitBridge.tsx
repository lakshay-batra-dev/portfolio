export function ExitBridge({ lines }: { lines: string[] }) {
  return (
    <div role="status" className="text-[14px] leading-7 sm:text-[15px]">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

export const exitLines = {
  solved: ["BUG FIXED", "Get a life, nerd."],
  skipped: ["Skipping debugger...", "Fair enough.", "Get a life, nerd."],
  timeout: ["30 seconds.", "You know what?", "Never mind.", "Get a life, nerd."],
  mobile: ["You're debugging C++ on a phone?", "I'm not making you suffer through this.", "Continuing..."],
} as const;
