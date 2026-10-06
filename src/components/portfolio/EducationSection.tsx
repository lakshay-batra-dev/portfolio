import { education } from "@/data/education";

export function EducationSection() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-sans text-[1.75rem] font-medium tracking-tight">Education</h1>
      <ol className="mt-8 divide-y divide-boot-line border-y border-boot-line">
        {education.map((entry, index) => (
          <li key={entry.id} className="py-6">
            <p className="font-mono text-[12px] text-boot-dim">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 font-sans text-[1.25rem] font-medium tracking-tight">{entry.title}</h2>
            <p className="mt-2 font-sans text-[15px] leading-7">{entry.school}</p>
            <p className="font-sans text-[15px] leading-7 text-boot-dim">{entry.place}</p>
            <p className="mt-2 font-mono text-[12px] text-boot-dim">{entry.years}</p>
            {entry.resultLabel ? <p className="mt-4 font-mono text-[12px] tracking-[0.12em] text-boot-dim">{entry.resultLabel}</p> : null}
            <p className={`${entry.resultLabel ? "mt-1" : "mt-4"} font-sans text-[15px]`}>{entry.result}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
