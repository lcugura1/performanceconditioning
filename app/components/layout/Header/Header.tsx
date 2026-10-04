import { Link } from "react-router";
import { Icon } from "~/components/ui/Icon";
import { contactNav, nav } from "~/content/site";
import { cx } from "~/lib/cx";
import { scrollToSection } from "~/lib/scroll-to";
import { Logo } from "../Logo/Logo";
import { useHeaderScroll } from "./useHeaderScroll";
import { useMobileMenu } from "./useMobileMenu";
import "./Header.scss";

const mobileNav = [...nav, contactNav];

/** Proziran iznad hera, tamno staklo nakon skrola; ispod 1100px burger i izbornik preko cijelog ekrana. */
export function Header() {
  const solid = useHeaderScroll();
  const menu = useMobileMenu();

  // Na početnoj stranici glatko skrolaj; drugdje (blog) pusti Link da navigira na /#id.
  const goTo = (id: string) => (e: React.MouseEvent) => {
    if (scrollToSection(id)) e.preventDefault();
    menu.close();
  };

  return (
    <>
      <header className={cx("hdr", (solid || menu.open) && "is-solid")}>
        <div className="wrap hdr__row">
          <Logo onClick={goTo("top")} />

          <nav className="nav" aria-label="Glavna navigacija">
            {nav.map((item) => (
              <Link key={item.id} to={`/#${item.id}`} onClick={goTo(item.id)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link className="pill pill--white" to={`/#${contactNav.id}`} onClick={goTo(contactNav.id)}>
            Javi se
          </Link>

          <button
            className="burger"
            type="button"
            aria-expanded={menu.open}
            aria-controls="mobile-menu"
            aria-label={menu.open ? "Zatvori izbornik" : "Otvori izbornik"}
            onClick={menu.toggle}
            ref={menu.burgerRef}
          >
            <Icon name={menu.open ? "close" : "menu"} />
          </button>
        </div>
      </header>

      {menu.open && (
        <nav className="mnav" id="mobile-menu" aria-label="Mobilni izbornik">
          {mobileNav.map((item) => (
            <Link key={item.id} to={`/#${item.id}`} onClick={goTo(item.id)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
