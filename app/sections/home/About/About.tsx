import { Media } from "~/components/ui/Media";
import { photos } from "~/content/photos";
import { about } from "~/content/site";
import "./About.scss";

export function About() {
  const [intro, ...points] = about;

  return (
    <section className="about" id="o-meni">
      <div className="wrap about__grid">
        <Media photo={photos.thumbsUp} className="about__photo rv-img" />

        <div className="about__text">
          <h2 className="h about__title rv">
            Tko sam <span className="serif">ja?</span>
          </h2>

          <div className="about__lead">
            {intro && <p className="about__intro serif rv">{intro.text}</p>}
            <Media photo={photos.coachSmile} className="about__second rv-img" />
          </div>

          <dl className="about__points">
            {points.map((point, i) => (
              <div className={`about__point rv rd${i + 1}`} key={point.title}>
                <dt>{point.title}</dt>
                <dd>{point.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
