import { Outlet, useLocation } from "react-router";
import { NewsletterPopup } from "~/features/newsletter/NewsletterPopup";
import { useReveal } from "~/hooks/useReveal";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { LiquidGlassFilter } from "../LiquidGlassFilter";

/** Zajednički okvir svih stranica: header, footer, reveal animacije, newsletter popup. */
export default function SiteLayout() {
  const { pathname } = useLocation();
  useReveal(pathname);

  return (
    <>
      <LiquidGlassFilter />
      <Header />
      <Outlet />
      <Footer />
      <NewsletterPopup />
    </>
  );
}
