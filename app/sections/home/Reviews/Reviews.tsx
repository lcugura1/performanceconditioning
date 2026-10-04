import { Stars } from "~/components/ui/Icon";
import { reviews, reviewScore } from "~/content/site";
import { orderByAudience, useAudience } from "~/features/audience/useAudience";
import { cx } from "~/lib/cx";
import "./Reviews.scss";

const SHOWN = 3;

/** Ocjena lijevo, tri recenzije desno; recenzije odabrane skupine idu prve. */
export function Reviews() {
  const audience = useAudience();
  const shown = orderByAudience(reviews, audience, (r) => r.audience ?? "sportasi").slice(0, SHOWN);
  const rating = reviewScore.rating.toFixed(1).replace(".", ",");

  return (
    <section className="rev" id="recenzije">
      <div className="wrap rev__grid">
        <div className="rev__score rv">
          <h2 className="label">Što kažu sportaši</h2>
          <span className="disp" aria-label={`Ocjena ${rating} od 5`}>
            {rating}
          </span>
          <div>
            <Stars />
            <a className="label rev__src" href={reviewScore.url ?? undefined} target="_blank" rel="noopener">
              Google recenzije{reviewScore.count ? ` · ${reviewScore.count}` : null}
            </a>
          </div>
        </div>

        {shown.map((r, i) => (
          <blockquote className={cx("rq rv", `rd${i + 1}`)} key={r.author}>
            <p>„{r.quote}"</p>
            <footer>
              <b>{r.author}</b>
              {r.source}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
