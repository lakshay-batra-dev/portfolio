import type { ChallengeVisualization } from "@/data/challenges";

export function TwoSumVisualization({ visualization }: { visualization: ChallengeVisualization }) {
  const { nums, target, pair } = visualization;

  return (
    <figure className="mt-3" aria-label={`Two Sum. nums ${nums.join(", ")}. target ${target}.`}>
      <figcaption className="text-[13px] leading-6 text-boot-dim">
        nums = [{nums.join(", ")}]
        <span className="mx-3 text-boot-line">/</span>
        target = {target}
      </figcaption>
      <div className="mt-3 grid max-w-sm grid-cols-4 gap-2 text-center text-[13px] leading-6">
        {nums.map((value, index) => {
          const marked = pair.includes(index);
          return (
            <div
              key={`${value}-${index}`}
              className={`border px-2 py-1 ${marked ? "border-boot-warn text-boot-text" : "border-boot-line text-boot-dim"}`}
            >
              {value}
            </div>
          );
        })}
        {nums.map((value, index) => (
          <span key={`mark-${value}-${index}`} className="text-boot-warn" aria-hidden="true">
            {pair.includes(index) ? "↑" : "\u00a0"}
          </span>
        ))}
      </div>
      <p className="mt-1 text-[12px] tracking-[0.08em] text-boot-dim">
        {nums[pair[0]]} + {nums[pair[1]]} = {target}
      </p>
    </figure>
  );
}
