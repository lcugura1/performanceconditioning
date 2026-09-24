import { Divider } from "~/components/ui/Divider";
import { About } from "~/sections/home/About/About";
import { Contact } from "~/sections/home/Contact/Contact";
import { Gallery } from "~/sections/home/Gallery/Gallery";
import { Hero } from "~/sections/home/Hero/Hero";
import { Programs } from "~/sections/home/Programs/Programs";
import { Reviews } from "~/sections/home/Reviews/Reviews";
import { Services } from "~/sections/home/Services/Services";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "Performance Conditioning — kondicijski trener, Zagreb" },
  {
    name: "description",
    content:
      "Kondicijski trener u Zagrebu, uživo i online. Bolja izvedba, manje ozljeda i struktura treninga za djecu sportaše, sportaše i rehabilitaciju ozljeda.",
  },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "hr_HR" },
  { property: "og:title", content: "Performance Conditioning — kondicijski trener" },
  { property: "og:image", content: "/images/hero-handshake.jpg" },
];

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Programs />
      <About />
      <Reviews />
      <Divider />
      <Gallery />
      <Contact />
    </main>
  );
}
