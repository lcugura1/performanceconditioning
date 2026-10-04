import { photos } from "~/content/photos";
import { about, aboutQuote } from "~/content/site";
import "./About.scss";

/**
 * Tri stupca: uvod lijevo, uokvireni portret u sredini s citatom kao
 * svijetlom etiketom preko ruba fotke, numerirane točke desno.
 */
export function About() {
  const [intro, ...points] = about;

  return (
    <section className="about" id="o-meni">
      <div className="wrap about__grid">
        <div className="about__main rv">
          <span className="label">O treneru</span>
          <h2 className="title">Tko sam ja?</h2>
          {intro && <p>{intro.text}</p>}
          <span className="label about__where">Zagreb · uživo i online</span>
        </div>

        <figure className="about__fig rv rd1">
          <div className="about__photo">
            <img
              src={photos.about.src}
              alt={photos.about.alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: photos.about.position }}
            />
          </div>
          <figcaption className="about__quote">
            {aboutQuote[0]}
            <br />
            {aboutQuote[1]}
          </figcaption>
        </figure>

        <ol className="about__points rv rd2">
          {points.map((point, i) => (
            <li key={point.title}>
              <span className="about__n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
