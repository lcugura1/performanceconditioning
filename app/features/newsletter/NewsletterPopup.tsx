import { useEffect, useState } from "react";
import { Icon } from "~/components/ui/Icon";
import { Media } from "~/components/ui/Media";
import { photos } from "~/content/photos";
import { useDelayedOncePerSession } from "./useDelayedOncePerSession";
import "./NewsletterPopup.scss";

const DELAY_MS = 4000;

export function NewsletterPopup() {
  const [open, close] = useDelayedOncePerSession("pc:newsletter-shown", DELAY_MS);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: spojiti na Brevo / MailerLite / Mailchimp
    setSubscribed(true);
  };

  return (
    <div className="pop" onClick={close}>
      <div
        className="pop__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pop-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="pop__x" type="button" aria-label="Zatvori" onClick={close}>
          <Icon name="close" />
        </button>

        <Media
          photo={{ ...photos.coachDrill, alt: "Trener vodi trening s mladim sportašima", position: "60% center" }}
          className="pop__img"
          eager
        />

        <div className="pop__body">
          <p className="pop__kicker">Samo za pretplatnike</p>
          <h2 className="pop__title" id="pop-title">
            Postani <span className="serif">bolji sportaš.</span>
          </h2>

          {subscribed ? (
            <div className="pop__ok" role="status">
              <strong>Hvala!</strong>
              <p className="pop__txt">Poklon stiže na tvoj email.</p>
            </div>
          ) : (
            <>
              <p className="pop__txt">Ekskluzivni savjeti na email — i mali poklon za dobrodošlicu.</p>
              <form className="pop__form" onSubmit={subscribe}>
                <label className="pop__field" htmlFor="pop-name">
                  <span className="pop__lbl">Ime</span>
                  <input className="pop__in" id="pop-name" type="text" name="name" placeholder="Tvoje ime" autoComplete="given-name" />
                </label>
                <label className="pop__field" htmlFor="pop-email">
                  <span className="pop__lbl">Email</span>
                  <input className="pop__in" id="pop-email" type="email" name="email" placeholder="ime@email.com" required autoComplete="email" />
                </label>
                <button className="btn btn--ink btn--block" type="submit">
                  Pošalji mi savjete
                  <Icon name="arrowRight" />
                </button>
              </form>
              <p className="pop__note">Bez spama. Odjava jednim klikom.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
