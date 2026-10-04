// Linijske ikone iz dizajna (24×24, stroke = currentColor, stil u _icons.scss).

const paths = {
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
  arrowDownRight: <path d="M7 7l10 10M17 9v8H9" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
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
