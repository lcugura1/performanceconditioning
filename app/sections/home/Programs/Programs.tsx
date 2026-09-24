import { useState } from "react";
import { Icon } from "~/components/ui/Icon";
import { Media, MediaPlaceholder } from "~/components/ui/Media";
import { programs } from "~/content/site";
import { cx } from "~/lib/cx";
import "./Programs.scss";

// Naslov "Uživo ili online." je ujedno i prekidač: riječi su gumbi.
// Oba panela su u HTML-u (tražilice), neaktivni je `hidden`; kad se prikaže,
// CSS animacije ulaska krenu ispočetka.
export function Programs() {
  const [active, setActive] = useState(0);

  const option = (index: number, label: string, className?: string) => (
    <button
      type="button"
      className={cx("prog__opt", className, active === index && "is-active")}
      aria-pressed={active === index}
      aria-controls={`program-${index}`}
      onClick={() => setActive(index)}
    >
      {label}
    </button>
  );

  return (
    <section className="prog" id="programi">
      <div className="wrap">
        <h2 className="h h2 prog__title rv">
          {option(0, "Uživo")} <span className="prog__or serif">ili</span> {option(1, "online")}
        </h2>

        {programs.map((p, i) => (
          <div className="prog__panel" id={`program-${i}`} key={p.title} hidden={i !== active}>
            {p.photo ? (
              <Media photo={p.photo} className="prog__media" />
            ) : (
              <MediaPlaceholder label={p.placeholder ?? p.title} className="prog__media" />
            )}
            <div className="prog__body">
              <span className="prog__tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <a className="link" href="#kontakt">
                Saznaj više <Icon name="arrowRight" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
