// PC znak iz logotipa, precrtan u SVG (izvor: design/originals/performance-conditioning-logo-1.png).
// Slova su currentColor, pa znak sam prati boju teksta (svijetla/tamna podloga); kosi potez je lime.

type LogoMarkProps = {
  className?: string;
  title?: string;
};

export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 382 546"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 0H300L362 64V168L284 246H146L81 316V546H0Z M81 80H268L283 100V145L263 165H166L81 214Z"
      />
      <path fill="currentColor" d="M99 332L166 266H330L380 308L338 342H190L173 358V450L190 466H348L376 494L332 546H166L98 480Z" />
      <path fill="var(--accent)" d="M298 391L382 335V392L298 448Z" />
    </svg>
  );
}
