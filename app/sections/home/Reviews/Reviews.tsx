import { useEffect, useMemo, useRef, useState } from "react";
import { Stars } from "~/components/ui/Icon";
import { Media } from "~/components/ui/Media";
import { useReducedMotion } from "~/hooks/useMediaQuery";
import { cx } from "~/lib/cx";
import { photos } from "~/content/photos";
import { reviews, reviewScore } from "~/content/site";
import type { Review } from "~/content/types";
import "./Reviews.scss";

const PAGE_SIZE = 3;
/** Mora odgovarati --rev-interval u Reviews.scss. */
const INTERVAL = 3000;

/** Dijeli recenzije u stranice; zadnju dopunjava s početka da uvijek ima PAGE_SIZE. */
function toPages(list: Review[]) {
  if (list.length <= PAGE_SIZE) return [list];
  const count = Math.ceil(list.length / PAGE_SIZE);
  return Array.from({ length: count }, (_, p) =>
    Array.from({ length: PAGE_SIZE }, (_, i) => list[(p * PAGE_SIZE + i) % list.length]!),
  );
}

/**
 * Ocjena i fotka lijevo, recenzije teku kao jedan tekst desno.
 * Stranice recenzija se izmjenjuju svakih 3 s; klik bilo gdje na sekciji pauzira.
 */
export function Reviews() {
  const pages = useMemo(() => toPages(reviews), []);
  const rotates = pages.length > 1;

  const ref = useRef<HTMLElement>(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  // bez automatskog vrtenja za korisnike koji ne žele animacije
  useEffect(() => {
    if (reducedMotion) setPaused(true);
  }, [reducedMotion]);

  // vrti samo dok je sekcija na ekranu i tab otvoren
  useEffect(() => {
    const el = ref.current;
    if (!el || !rotates) return;
    let onScreen = false;
    const update = () => setVisible(onScreen && document.visibilityState === "visible");
    const io = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [rotates]);

  const running = rotates && visible && !paused;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setPage((p) => (p + 1) % pages.length), INTERVAL);
    return () => window.clearTimeout(id);
  }, [running, page, pages.length]);

  return (
    <section
      ref={ref}
      className={cx("rev", rotates && "rev--rotates")}
      id="recenzije"
      onClick={rotates ? () => setPaused((p) => !p) : undefined}
    >
      <div className="wrap">
        <h2 className="h h2 rev__title rv">
          Što kažu <span className="serif">sportaši.</span>
        </h2>

        <div className="rev__grid">
          <aside className="rev__side rv">
            <div className="rev__score">
              <span className="rev__num">{reviewScore.rating.toFixed(1).replace(".", ",")}</span>
              <div className="rev__meta">
                <Stars />
                <span>
                  Google recenzije
                  {reviewScore.count ? ` · ${reviewScore.count}` : null}
                </span>
              </div>
            </div>
            <Media photo={photos.coachTalk} className="rev__photo" />
          </aside>

          <div className="rev__main rv rd1">
            <div className="rev__pages" aria-live={running ? "off" : "polite"}>
              {pages.map((items, p) => (
                <div
                  className={cx("rev__flow", p === page && "is-active")}
                  key={p}
                  aria-hidden={p !== page}
                  inert={p !== page}
                >
                  {items.map((r) => (
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
              ))}
            </div>

            {rotates && (
              <div className="rev__ctrl">
                <div className="rev__dots" aria-hidden="true">
                  {pages.map((_, p) => (
                    <span className={cx("rev__dot", p === page && "is-active")} key={p}>
                      {p === page && running && <i />}
                    </span>
                  ))}
                </div>
                {/* klik se propagira do sekcije, koja mijenja stanje */}
                <button type="button" className="rev__toggle" aria-pressed={paused}>
                  {paused ? "Pauzirano · klikni za nastavak" : "Klikni za pauzu"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
