import { gallery } from "~/content/site";
import "./Gallery.scss";

// Traka se vrti beskonačno: niz se ponavlja dvaput, animacija ide do -50 %.
const loop = [...gallery, ...gallery];

/** Traka fotki koja se sama vrti; staje dok je miš iznad nje. */
export function Gallery() {
  return (
    <section className="gal" id="galerija">
      <div className="wrap gal__head rv">
        <h2 className="disp">S terena.</h2>
      </div>
      <div className="strip">
        <div className="strip__track">
          {loop.map((photo, i) => (
            <div className={`strip__item strip__item--${photo.shape}`} key={i} aria-hidden={i >= gallery.length}>
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes={photo.sizes}
                alt={i < gallery.length ? photo.alt : ""}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
