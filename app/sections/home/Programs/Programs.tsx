import { Fragment } from "react";
import { Icon } from "~/components/ui/Icon";
import { programs, programsTitle } from "~/content/site";
import { cx } from "~/lib/cx";
import "./Programs.scss";

/**
 * Svijetla traka s kosim rubovima: naslov u uskom stupcu lijevo, dva formata
 * (uživo, online) kao visoke fotke s tekstom preko donjeg dijela.
 */
export function Programs() {
  return (
    <section className="prog" id="programi">
      <div className="wrap prog__grid">
        <h2 className="disp prog__title rv">
          {programsTitle.map((line, i) => (
            <Fragment key={line}>
              {/* razmak ostaje kad se <br> sakrije (Programs.scss) */}
              {i > 0 && (
                <>
                  {" "}
                  <br />
                </>
              )}
              {line}
            </Fragment>
          ))}
        </h2>

        {programs.map((p, i) => (
          <article className={cx("pcard rv", `rd${i + 1}`)} key={p.title}>
            {p.photo ? (
              <img
                className="pcard__img"
                src={p.photo.src}
                srcSet={p.photo.srcSet}
                sizes={p.photo.sizes}
                alt={p.photo.alt}
                loading="lazy"
                decoding="async"
                style={p.photo.position ? { objectPosition: p.photo.position } : undefined}
              />
            ) : (
              <div className="pcard__img pcard__ph">{p.placeholder ?? p.title}</div>
            )}
            <div className="pcard__body">
              <div className="pcard__head">
                <h3>{p.title}</h3>
                <span className="pcard__tag">{p.tag}</span>
              </div>
              <p>{p.text}</p>
              <a className="ulink" href="#kontakt">
                Saznaj više
                <Icon name="arrowUpRight" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
