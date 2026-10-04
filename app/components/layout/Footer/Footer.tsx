import { Link } from "react-router";
import { contact, contactNav, nav, siteName } from "~/content/site";
import { scrollToSection } from "~/lib/scroll-to";
import { Logo } from "../Logo/Logo";
import "./Footer.scss";

const links = contact.links.filter((l) => l.group === "direct");
const instagram = contact.links.find((l) => l.label === "Instagram");
const email = contact.links.find((l) => l.label === "Email");

const social = [
  ...(instagram ? [{ label: "Instagram", href: instagram.href, external: true }] : []),
  { label: "WhatsApp", href: contact.whatsapp, external: true },
  ...(email ? [{ label: "E-mail", href: email.href, external: false }] : []),
];

/** Kompaktno, centrirano podnožje: logo, podnaslov, navigacija, kontakt, mreže, ©. */
export function Footer() {
  // Na početnoj stranici glatko skrolaj; drugdje pusti Link da navigira na /#id.
  const goTo = (id: string) => (e: React.MouseEvent) => {
    if (scrollToSection(id)) e.preventDefault();
  };

  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <Logo onClick={goTo("top")} />
        <p className="foot__sub">Kondicijski trener · Zagreb · uživo i online</p>

        <nav className="foot__nav" aria-label="Podnožje">
          {[...nav, contactNav].map((item) => (
            <Link key={item.id} to={`/#${item.id}`} onClick={goTo(item.id)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="foot__contact">
          {links.map((l) => (
            <a key={l.label} href={l.href} {...(l.external && { target: "_blank", rel: "noopener" })}>
              {l.value}
            </a>
          ))}
        </div>

        <div className="foot__social">
          {social.map((l) => (
            <a key={l.label} href={l.href} {...(l.external && { target: "_blank", rel: "noopener" })}>
              {l.label}
            </a>
          ))}
        </div>

        <p className="foot__legal">
          © {new Date().getFullYear()} {siteName}
          {instagram && <> · {instagram.value}</>}
        </p>
      </div>
    </footer>
  );
}
