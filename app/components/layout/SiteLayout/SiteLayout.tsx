import { Outlet, useLocation } from "react-router";
import { useReveal } from "~/hooks/useReveal";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";

/** Zajednički okvir svih stranica: header, footer, reveal animacije. */
export default function SiteLayout() {
  const { pathname } = useLocation();
  useReveal(pathname);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
