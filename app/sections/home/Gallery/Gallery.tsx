import { Media } from "~/components/ui/Media";
import { gallery } from "~/content/site";
import "./Gallery.scss";

// Traka se vrti beskonačno: niz se ponavlja dvaput, animacija ide do -50 %.
const loop = [...gallery, ...gallery];

export function Gallery() {
  return (
    <section className="gal" id="galerija">
      <div className="wrap gal__head rv">
        <h2 className="h h2">
          S <span className="serif">terena.</span>
        </h2>
      </div>
      <div className="strip rv">
        <div className="strip__track">
          {loop.map((photo, i) => (
            <Media
              key={i}
              photo={i < gallery.length ? photo : { ...photo, alt: "" }}
              className={`strip__item strip__item--${photo.shape}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
