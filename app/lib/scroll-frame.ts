// Jedan zajednički scroll/resize listener, prigušen na jedan poziv po frameu.
// Svi efekti vezani uz skrol (header, vodoravni skrol, parallax) pretplaćuju
// se ovdje umjesto da svaki kači svoj listener.

type Listener = () => void;

const listeners = new Set<Listener>();
let frame = 0;

function flush() {
  frame = 0;
  listeners.forEach((fn) => fn());
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

export function subscribeScrollFrame(fn: Listener) {
  if (listeners.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  listeners.add(fn);

  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
