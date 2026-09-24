import { Link } from "react-router";
import { LogoMark } from "~/components/ui/LogoMark";
import { contact, siteName } from "~/content/site";
import { scrollToSection } from "~/lib/scroll-to";
import "./Footer.scss";

const email = contact.links.find((l) => l.label === "Email");
const social = contact.links.filter((l) => l.group === "social");

const links = [
  ...social.map((l) => ({ label: l.label.toLowerCase(), href: l.href, external: true })),
  { label: "whatsapp", href: contact.whatsapp, external: true },
  ...(email ? [{ label: "e-mail", href: email.href, external: false }] : []),
];

export function Footer() {
  // Na početnoj glatko skrolaj na vrh; drugdje pusti Link da navigira.
  const toTop = (e: React.MouseEvent) => {
    if (scrollToSection("top")) e.preventDefault();
  };

  return (
    <footer className="foot" data-theme="dark">
      <div className="wrap foot__in">
        <Link className="foot__brand" to="/#top" onClick={toTop}>
          <LogoMark className="foot__mark" />
          <span className="foot__name">{siteName}</span>
        </Link>

        <p className="foot__sub">
          Kondicijski trener <span aria-hidden="true">•</span> Zagreb
        </p>

        <ul className="foot__links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} {...(l.external && { target: "_blank", rel: "noopener" })}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="foot__copy">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
