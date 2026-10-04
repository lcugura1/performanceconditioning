import { useState } from "react";
import { Icon } from "~/components/ui/Icon";
import { photos } from "~/content/photos";
import { contact, contactHead } from "~/content/site";
import "./Contact.scss";

/** Poruka za WhatsApp iz polja forme (prazna polja se preskaču). */
function whatsappMessage(form: FormData) {
  const field = (name: string) => String(form.get(name) ?? "").trim();
  const name = field("name");
  const lines = [
    name ? `Pozdrav, ja sam ${name}.` : "Pozdrav!",
    "Želim dogovoriti prvi trening.",
    field("phone") && `Telefon: ${field("phone")}`,
    field("email") && `Email: ${field("email")}`,
  ];
  return lines.filter(Boolean).join("\n");
}

/** Kontakt: okvir preko fotke s naslovom i formom (podaci i mreže su u podnožju). */
export function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = whatsappMessage(new FormData(e.currentTarget));
    window.open(`${contact.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
  };

  return (
    <section className="ct" id="kontakt">
      <div className="ct__bg" aria-hidden="true">
        <img src={photos.contact.src} alt="" loading="lazy" decoding="async" />
      </div>

      <div className="ct__panel">
        <img className="bw" src={photos.contact.src} alt={photos.contact.alt} loading="lazy" decoding="async" />
        <span className="grid-ov" />

        <h2 className="disp ct__h rv">
          {contactHead.title.map((part, i) => (
            <span className={i === 0 ? "ct__l" : "ct__r"} key={i}>
              {part[0]}
              <br />
              {part[1]}
            </span>
          ))}
        </h2>

        <div className="ct__mid">
          <form className="ct__form rv" onSubmit={submit}>
            {sent ? (
              <p className="ct__sent" role="status">
                {contactHead.sent}
              </p>
            ) : (
              <>
                <p>{contactHead.intro}</p>
                <label className="ufield">
                  <span>Ime</span>
                  <input name="name" type="text" autoComplete="name" placeholder="Tvoje ime" />
                </label>
                <label className="ufield">
                  <span>Telefon</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="+385" />
                </label>
                <label className="ufield">
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" placeholder="ime@email.com" required />
                </label>
                <button className="pill pill--white" type="submit">
                  {contactHead.submit}
                  <span className="pill__dot">
                    <Icon name="arrowDownRight" />
                  </span>
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
