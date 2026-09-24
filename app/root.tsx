import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import "./styles/main.scss";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/images/logo-mark-dark.png", type: "image/png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap",
  },
];

// Prije prvog iscrtavanja: uključi skriveno početno stanje za reveal animacije.
// Bez JS-a sadržaj ostaje vidljiv.
const revealBootstrap = `document.documentElement.classList.add("js-reveal")`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Greška";
  let details = "Došlo je do neočekivane greške.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "404" : "Greška";
    details = error.status === 404 ? "Stranica ne postoji." : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="wrap" style={{ paddingBlock: "8rem" }}>
      <h1 className="h h2">{title}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
      <a className="link" href="/">
        Natrag na početnu
      </a>
    </main>
  );
}
