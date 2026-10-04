import { Icon } from "~/components/ui/Icon";
import { audiences } from "~/content/audiences";
import { startHere } from "~/content/site";
import type { Audience } from "~/content/types";
import { setAudience, useAudience } from "~/features/audience/useAudience";
import { cx } from "~/lib/cx";
import { scrollToSection } from "~/lib/scroll-to";
import "./Start.scss";

/**
 * "Za koga je trening?": tri kartice skupina. Odabir se pamti (useAudience),
 * preslaže Usluge, Blog i Recenzije i vodi na Usluge.
 */
export function Start() {
  const selected = useAudience();

  const choose = (id: Audience) => {
    setAudience(id);
    scrollToSection("usluge");
  };

  return (
    <section className="start" id="za-koga">
      <div className="wrap">
        <div className="start__head rv">
          <h2 className="disp">
            {startHere.title[0]}
            <br />
            {startHere.title[1]}
          </h2>
          <p>{startHere.lead}</p>
        </div>

        <div className="cards">
          {audiences.map((a, i) => (
            <button
              type="button"
              className={cx("scard rv", i > 0 && `rd${i}`, a.id === selected && "is-on")}
              aria-pressed={a.id === selected}
              key={a.id}
              onClick={() => choose(a.id)}
            >
              <span className="scard__img">
                <img
                  src={a.card.src}
                  srcSet={a.card.srcSet}
                  sizes={a.card.sizes}
                  alt={a.card.alt}
                  loading="lazy"
                  decoding="async"
                  style={a.card.position ? { objectPosition: a.card.position } : undefined}
                />
              </span>
              <span className="scard__lbl">
                {a.short}
                <small>{String(i + 1).padStart(2, "0")}</small>
              </span>
              <span className="scard__txt">{a.pick.text}</span>
              <span className="scard__more">
                Saznaj više
                <Icon name="arrowDown" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
