const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Glatko skrola do sekcije na trenutnoj stranici i ažurira hash bez skoka.
 * Vraća false ako sekcija ne postoji (npr. na blogu) — tada pusti normalnu navigaciju.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });

  if (location.hash !== `#${id}`) {
    history.replaceState(history.state, "", `#${id}`);
  }
  return true;
}
