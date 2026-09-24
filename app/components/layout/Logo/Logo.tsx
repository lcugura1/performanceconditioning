import { Link } from "react-router";
import { LogoMark } from "~/components/ui/LogoMark";
import { siteName } from "~/content/site";
import { cx } from "~/lib/cx";
import "./Logo.scss";

type LogoProps = {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

/** Znak + riječi. Boja dolazi iz `color` roditelja (npr. .hdr.on-dark). */
export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link className={cx("logo", className)} to="/#top" onClick={onClick}>
      <LogoMark className="logo__mark" />
      <span className="logo__word" aria-hidden="true">
        Performance
        <br />
        Conditioning
      </span>
      <span className="sr-only">{siteName}</span>
    </Link>
  );
}
