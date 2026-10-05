import { experience } from "@/data/experience";

export function ExperienceSection() {
  return (
    <div>
      <h1 className="font-sans text-[1.75rem] font-medium tracking-tight">Experience</h1>
      <p className="mt-3 max-w-xl font-sans text-[15px] leading-7 text-boot-dim">
        Research at Thapar. Campus leadership stays on the resume and is not listed here as a job.
      </p>
      <div className="mt-8 space-y-8">
        {experience.map((entry) => (
          <article key={entry.id} className="max-w-2xl border border-boot-line px-4 py-4">
            <h2 className="font-sans text-[1.15rem]">{entry.role}</h2>
            <p className="mt-1 font-sans text-[15px] text-boot-dim">{entry.org}</p>
            <p className="mt-1 font-mono text-[12px] text-boot-dim">
              {entry.dates} · {entry.place}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 font-sans text-[15px] leading-7">
              {entry.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
