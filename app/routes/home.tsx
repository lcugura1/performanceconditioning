import { About } from "~/sections/home/About/About";
import { Blog } from "~/sections/home/Blog/Blog";
import { Contact } from "~/sections/home/Contact/Contact";
import { Gallery } from "~/sections/home/Gallery/Gallery";
import { Hero } from "~/sections/home/Hero/Hero";
import { Programs } from "~/sections/home/Programs/Programs";
import { Reviews } from "~/sections/home/Reviews/Reviews";
import { Services } from "~/sections/home/Services/Services";
import { Start } from "~/sections/home/Start/Start";
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
  { property: "og:image", content: "/images/hero-gym.jpg" },
];

export default function Home() {
  return (
    <main>
      <Hero />
      <Start />
      <Services />
      <Programs />
      <About />
      <Reviews />
      <Blog />
      <Gallery />
      <Contact />
    </main>
  );
}
