import { useRef } from "react";
import { Icon } from "~/components/ui/Icon";
import { Media } from "~/components/ui/Media";
import { photos } from "~/content/photos";
import { useReducedMotion } from "~/hooks/useMediaQuery";
import { useScrollFrame } from "~/hooks/useScrollFrame";
import { HeroStats } from "./HeroStats";
import "./Hero.scss";

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  // Lagani zoom-out fotke dok prolazi kroz ekran (1.12 → 1).
  useScrollFrame(() => {
    const img = imgRef.current;
    if (!img || reduced) return;
    const vh = window.innerHeight;
    const r = img.parentElement!.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    img.style.transform = `scale(${(1.12 - p * 0.12).toFixed(4)})`;
  });

  return (
    <header className="hero" id="top">
      <div className="wrap">
        {/* stepenice: svaki red korak dalje — progresija */}
        <h1 className="h hero__title">
          <span className="ln"><span className="dl1">Bolja izvedba,</span></span>
          <span className="ln"><span className="dl2">manje ozljeda,</span></span>
          <span className="ln"><span className="serif dl3">struktura treninga.</span></span>
        </h1>

        <div className="hero__stage">
          <figure className="hero__figure in dl5">
            <Media photo={photos.heroHandshake} className="hero__media" eager imgRef={imgRef} />
            <HeroStats />
          </figure>

          <div className="hero__aside">
            <p className="hero__meta in dl4">
              <b>Kondicijski trener</b>
              <br />
              Zagreb, uživo i online
            </p>
            <p className="hero__lead in dl5">
              Poboljšaj svoje sportske performanse i riješi se ozljeda. Rad s djecom sportašima,
              sportašima i rehabilitacija ozljeda.
            </p>
            <a className="btn btn--accent hero__cta in dl6" href="#kontakt">
              Želim biti bolji sportaš
              <Icon name="arrowRight" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
