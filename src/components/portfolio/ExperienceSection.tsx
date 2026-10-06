import { experience } from "@/data/experience";

export function ExperienceSection() {
  const entry = experience[0];
  if (!entry) {
    return null;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-sans text-[1.75rem] font-medium tracking-tight">{entry.role}</h1>
      <p className="mt-2 font-sans text-[16px]">{entry.org}</p>
      <p className="mt-1 font-mono text-[12px] text-boot-dim">
        {entry.dates} · {entry.place}
      </p>
      <p className="mt-6 font-mono text-[12px] tracking-[0.12em] text-boot-dim">FOCUS</p>
      <p className="mt-2 font-sans text-[15px] leading-7">{entry.focus}</p>
      <ol className="mt-6 border border-boot-line px-3 py-3 font-mono text-[13px] leading-7" aria-label="Signal processing pipeline">
        {entry.pipeline.map((step, index) => (
          <li key={step}>
            {index > 0 ? <span className="mr-2 text-boot-dim">→</span> : null}
            {step}
          </li>
        ))}
      </ol>
      <ul className="mt-6 list-disc space-y-3 pl-5 font-sans text-[15px] leading-7">
        {entry.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
