import { useRef } from "react";
import { stats } from "~/content/site";
import { useCountUp } from "~/hooks/useCountUp";
import { useInView } from "~/hooks/useInView";

/** Staklena traka s brojkama preko donjeg ruba hero fotke. */
export function HeroStats() {
  const ref = useRef<HTMLDListElement>(null);
  const progress = useCountUp(useInView(ref));

  return (
    <dl className="hstats glass glass-rim squircle" ref={ref}>
      {stats.map((s) => (
        <div className="hstats__item" key={s.label}>
          <dt className="hstats__lbl">{s.label}</dt>
          <dd className={s.kind === "text" ? "hstats__num serif" : "hstats__num"}>
            {s.kind === "text" ? s.value : `${Math.round(s.value * progress)}+`}
          </dd>
        </div>
      ))}
    </dl>
  );
}
