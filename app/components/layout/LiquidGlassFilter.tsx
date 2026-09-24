// SVG filter koji .glass koristi u backdrop-filteru (vidi styles/components/_glass.scss).
// Vrijednosti su iz dizajna — ne mijenjati.
export function LiquidGlassFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <filter
        id="liquid-glass"
        x="-4%"
        y="-4%"
        width="108%"
        height="108%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves={2} seed={11} result="noise" />
        <feGaussianBlur in="noise" stdDeviation={6} result="swell" />
        <feDisplacementMap in="SourceGraphic" in2="swell" scale={9} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
