import { Grain } from "~/components/ui/Grain";
import { Icon } from "~/components/ui/Icon";
import { photos } from "~/content/photos";
import { hero } from "~/content/site";
import { HeroStats } from "./HeroStats";
import "./Hero.scss";

// kašnjenje ulazne animacije po retku naslova (vidi .dl1–.dl4 u _motion.scss)
const lineDelay = ["dl1", "dl2", "dl3", "dl4"];

export function Hero() {
  const photo = photos.heroGym;

  return (
    <header className="hero" id="top">
      <div className="hero__bg">
        <img
          className="bw"
          src={photo.src}
          alt={photo.alt}
          style={{ objectPosition: photo.position }}
          fetchPriority="high"
        />
        <span className="grid-ov" />
        <Grain />
      </div>
      <div className="hero__shade" />

      <div className="wrap hero__in">
        <h1 className="disp hero__h">
          {hero.title.map((block, b) => (
            <span className={b === 0 ? "hero__l" : "hero__r"} key={b}>
              {block.map((line, i) => (
                <span className="ln" key={line}>
                  <span className={lineDelay[b * 2 + i]}>{line}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="hero__bottom">
          <div className="in dl5">
            <p className="hero__third">{hero.third}</p>
            <p className="hero__lead">{hero.lead}</p>
            <div className="btns">
              <a className="pill pill--white" href="#kontakt">
                {hero.cta}
                <span className="pill__dot">
                  <Icon name="arrowDownRight" />
                </span>
              </a>
              <a className="pill pill--line" href="#za-koga">
                {hero.secondary}
              </a>
            </div>
          </div>
        </div>

        <HeroStats />
      </div>
    </header>
  );
}
