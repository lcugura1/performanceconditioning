import { useId } from "react";

/** Zrno preko fotke (SVG šum). Roditelj mora biti position: relative. Stil: .grain u _photo.scss. */
export function Grain() {
  // useId može sadržavati znakove koji ne prolaze u url(#…)
  const id = `grain${useId().replace(/[^\w-]/g, "")}`;
  return (
    <svg className="grain" aria-hidden="true">
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}
