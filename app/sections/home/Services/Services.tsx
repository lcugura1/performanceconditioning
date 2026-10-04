import { useEffect, useState } from "react";
import { Icon } from "~/components/ui/Icon";
import { audiences, defaultAudience } from "~/content/audiences";
import type { Audience } from "~/content/types";
import { useAudience } from "~/features/audience/useAudience";
import { cx } from "~/lib/cx";
import { scrollToSection } from "~/lib/scroll-to";
import { BlogCard } from "./BlogCard";
import { NewsletterForm } from "./NewsletterForm";
import { VideoBlock } from "./VideoBlock";
import "./Services.scss";

/**
 * Usluge: cijela sekcija prikazuje jednu skupinu (fotka, način rada, video,
 * članak, newsletter). Prikazana je ona odabrana u "Za koga je trening?",
 * a tabovi samo pregledavaju ostale, bez mijenjanja odabira.
 */
export function Services() {
  const selected = useAudience();
  const [viewing, setViewing] = useState<Audience | null>(null);

  // novi odabir skupine poništava ručno pregledavanje
  useEffect(() => setViewing(null), [selected]);

  const currentId = viewing ?? selected ?? defaultAudience;
  const index = audiences.findIndex((a) => a.id === currentId);
  const current = audiences[index]!;
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section className="svc" id="usluge">
      <div className="wrap">
        <div className="svc__top">
          <h2 className="title">Kako vam mogu pomoći?</h2>
          <div className="tabs" role="tablist" aria-label="Skupine">
            {audiences.map((a, i) => (
              <button
                type="button"
                role="tab"
                id={`svc-tab-${a.id}`}
                aria-controls="svc-panel"
                aria-selected={a === current}
                tabIndex={a === current ? 0 : -1}
                className={cx("tab", a === current && "is-active")}
                key={a.id}
                onClick={() => setViewing(a.id)}
                onKeyDown={(e) => {
                  const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!step) return;
                  const next = audiences[(i + step + audiences.length) % audiences.length]!;
                  setViewing(next.id);
                  document.getElementById(`svc-tab-${next.id}`)?.focus();
                }}
              >
                {a.short}
              </button>
            ))}
          </div>
        </div>

        {/* key: promjena skupine ponovno pokreće ulaznu animaciju panela */}
        <div className="pane" id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${current.id}`} key={current.id}>
          <div className="feat">
            <div className="feat__copy">
              <div className="feat__stack">
                <span className="label">
                  {num(index)} / {num(audiences.length - 1)} · {current.short}
                </span>
                <h3 className="disp feat__h">
                  {current.title[0]}
                  <br />
                  {current.title[1]}
                </h3>
                <p className="feat__lead">{current.lead}</p>
              </div>
              <div className="feat__stack">
                <dl className="spec">
                  <div>
                    <dt className="label">Fokus</dt>
                    <dd>{current.pick.focus}</dd>
                  </div>
                  <div>
                    <dt className="label">Za</dt>
                    <dd>{current.pick.for}</dd>
                  </div>
                </dl>
                <div className="btns">
                  <a className="pill pill--white" href="#kontakt">
                    Pošalji poruku
                    <span className="pill__dot">
                      <Icon name="arrowDownRight" />
                    </span>
                  </a>
                  <a
                    className="pill pill--line"
                    href="#video"
                    onClick={(e) => scrollToSection("video") && e.preventDefault()}
                  >
                    Pogledaj kako radimo
                  </a>
                </div>
              </div>
            </div>
            <div className="feat__media">
              <img
                src={current.photo.src}
                alt={current.photo.alt}
                loading="lazy"
                decoding="async"
                style={current.photo.position ? { objectPosition: current.photo.position } : undefined}
              />
            </div>
          </div>

          <div className="steps__head">
            <h3>Način rada</h3>
            <span className="label">Od analize do rezultata</span>
          </div>
          <ol className="steps">
            {current.method.map((step, i) => (
              <li className="step" key={step.title}>
                <span className="step__n">{num(i)}</span>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="media-row" id="video">
            <VideoBlock video={current.video} poster={current.poster} title={`Video o ${current.about}`} />
            <BlogCard audience={current.id} />
          </div>

          <NewsletterForm audience={current} />
        </div>
      </div>
    </section>
  );
}
