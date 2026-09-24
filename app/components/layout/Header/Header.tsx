import { useRef } from "react";
import { Link } from "react-router";
import { nav } from "~/content/site";
import { cx } from "~/lib/cx";
import { scrollToSection } from "~/lib/scroll-to";
import { Logo } from "../Logo/Logo";
import { useHeaderScroll } from "./useHeaderScroll";
import { useMobileMenu } from "./useMobileMenu";
import { useNavIndicator } from "./useNavIndicator";
import "./Header.scss";

const sectionIds = nav.map((item) => item.id);

export function Header() {
  const rowRef = useRef<HTMLDivElement>(null);
  const { glass, onDark, active } = useHeaderScroll(sectionIds, rowRef);
  const { navRef, indRef } = useNavIndicator(active);
  const menu = useMobileMenu();

  // Na početnoj stranici glatko skrolaj; drugdje (blog) pusti Link da navigira na /#id.
  const goTo = (id: string) => (e: React.MouseEvent) => {
    if (scrollToSection(id)) e.preventDefault();
    menu.close();
  };

  return (
    <header className={cx("hdr", glass && !menu.open && "glass", onDark && "on-dark", menu.open && "is-open")}>
      <div className="hdr__row" ref={rowRef}>
        <Logo onClick={goTo("top")} />

        <nav className="nav" aria-label="Glavna navigacija" ref={navRef}>
          {nav.map((item) => (
            <Link
              key={item.id}
              className={cx("nav__a", active === item.id && "is-active")}
              to={`/#${item.id}`}
              data-id={item.id}
              aria-current={active === item.id ? "true" : undefined}
              onClick={goTo(item.id)}
            >
              {item.label}
            </Link>
          ))}
          <span className="nav__ind" aria-hidden="true" ref={indRef} />
        </nav>

        <button
          className="burger"
          type="button"
          aria-expanded={menu.open}
          aria-controls="mobile-menu"
          aria-label={menu.open ? "Zatvori izbornik" : "Otvori izbornik"}
          onClick={menu.toggle}
          ref={menu.burgerRef}
        >
          <span className="burger__box" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div
          className={cx("menu-panel glass glass-rim squircle", menu.open && "is-open")}
          id="mobile-menu"
          inert={!menu.open}
          ref={menu.panelRef}
        >
          {nav.map((item) => (
            <Link
              key={item.id}
              className={cx("menu-panel__a", active === item.id && "is-active")}
              to={`/#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={goTo(item.id)}
            >
              <span className="menu-panel__mark" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
