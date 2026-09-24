/** Spaja CSS klase, preskače falsy vrijednosti. */
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
