import { Icon } from "~/components/ui/Icon";
import { Media } from "~/components/ui/Media";
import { photos } from "~/content/photos";
import { contact } from "~/content/site";
import "./Contact.scss";

export function Contact() {
  return (
    <section className="ct" id="kontakt" data-theme="dark">
      <div className="wrap ct__grid">
        <div>
          <h2 className="h ct__title rv">
            Pošaljite mi poruku <span className="serif">već danas.</span>
          </h2>
          <a className="btn btn--accent rv" href={contact.whatsapp} target="_blank" rel="noopener">
            <Icon name="whatsapp" />
            Poruka na WhatsApp
          </a>

          <div className="ct__list rv">
            {contact.links.map((link) => (
              <a
                className="crow"
                key={link.label}
                href={link.href}
                {...(link.external && { target: "_blank", rel: "noopener" })}
              >
                <span className="crow__lbl">{link.label}</span>
                <span className="crow__val">{link.value}</span>
                <Icon name="arrowUpRight" />
              </a>
            ))}
          </div>
        </div>

        <Media photo={photos.coachGesture} className="ct__photo rv-img" />
      </div>
    </section>
  );
}
