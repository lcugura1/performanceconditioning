// Linijske ikone iz dizajna (24×24, stroke = currentColor, stil u _icons.scss).

const paths = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  whatsapp: <path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.3A8.5 8.5 0 1 1 20.5 12z" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const STAR = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z";

export function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}
