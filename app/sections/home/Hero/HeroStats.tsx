import { useRef } from "react";
import { stats } from "~/content/site";
import { useCountUp } from "~/hooks/useCountUp";
import { useInView } from "~/hooks/useInView";
import { cx } from "~/lib/cx";

/** Staklena kartica s brojkama preko donjeg dijela hero fotke; brojke se odbroje kad uđu u ekran. */
export function HeroStats() {
  const ref = useRef<HTMLDListElement>(null);
  const progress = useCountUp(useInView(ref));

  return (
    <dl className="gstats in dl6" ref={ref} aria-label="Iskustvo u brojkama">
      {stats.map((s) => (
        <div className="gstat" key={s.label}>
          {/* dt mora biti prije dd; broj se vizualno diže iznad oznake (order u Hero.scss) */}
          <dt className="gstat__l">
            {s.short ? (
              <>
                <span className="gstat__full">{s.label}</span>
                <span className="gstat__short">{s.short}</span>
              </>
            ) : (
              s.label
            )}
          </dt>
          <dd className={cx("gstat__n", s.kind === "text" && "gstat__n--sm")}>
            {s.kind === "text" ? s.value : `${Math.round(s.value * progress)}+`}
          </dd>
        </div>
      ))}
    </dl>
  );
}
