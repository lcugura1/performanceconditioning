import { Icon } from "~/components/ui/Icon";
import { Media } from "~/components/ui/Media";
import { services } from "~/content/site";
import { useHorizontalScroll } from "./useHorizontalScroll";
import "./Services.scss";

export function Services() {
  const { sectionRef, stickyRef, trackRef } = useHorizontalScroll();

  return (
    <section className="hs" id="usluge" data-theme="dark" ref={sectionRef}>
      <div className="hs__sticky" ref={stickyRef}>
        <div className="hs__track" ref={trackRef}>
          <div className="hs__intro">
            <h2 className="h h2">
              Kako vam mogu <span className="serif">pomoći?</span>
            </h2>
            <div className="hs__hint" aria-hidden="true">
              <span className="hs__meter">
                <span className="hs__bar" />
              </span>
              Scrollaj dalje
            </div>
          </div>

          {services.map((s, i) => (
            <article className="hcard" key={s.title} style={{ "--i": i } as React.CSSProperties}>
              <Media photo={s.photo} className="hcard__img" />
              <div>
                <div className="hcard__head">
                  <span className="hcard__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                </div>
                <p>{s.text}</p>
              </div>
            </article>
          ))}

          <div className="hs__end">
            <h3 className="h">
              Želim biti <span className="serif">bolji sportaš.</span>
            </h3>
            <a className="btn btn--accent" href="#kontakt">
              Pošalji poruku
              <Icon name="arrowRight" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
