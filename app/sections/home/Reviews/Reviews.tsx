import { Stars } from "~/components/ui/Icon";
import { Media } from "~/components/ui/Media";
import { photos } from "~/content/photos";
import { reviews } from "~/content/site";
import "./Reviews.scss";

/** Ocjena i fotka lijevo, recenzije teku kao jedan tekst desno. */
export function Reviews() {
  return (
    <section className="rev" id="recenzije">
      <div className="wrap">
        <h2 className="h h2 rev__title rv">
          Što kažu <span className="serif">sportaši.</span>
        </h2>

        <div className="rev__grid">
          <aside className="rev__side rv">
            <div className="rev__score">
              <span className="rev__num">5,0</span>
              <div className="rev__meta">
                <Stars />
                <span>Google recenzije</span>
              </div>
            </div>
            <Media photo={photos.coachTalk} className="rev__photo" />
          </aside>

          <div className="rev__flow rv rd1">
            {reviews.map((r) => (
              <figure className="rev__item" key={r.author}>
                <blockquote>
                  <q>{r.quote}</q>
                </blockquote>{" "}
                <figcaption>
                  <b>{r.author}</b> {r.source}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
