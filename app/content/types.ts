export type Photo = {
  src: string;
  alt: string;
  /** CSS object-position kad fokus fotke nije u sredini */
  position?: string;
};

export type NavItem = {
  /** id sekcije na početnoj stranici */
  id: string;
  label: string;
};

export type Service = {
  title: string;
  text: string;
  photo: Photo;
};

export type Program = {
  tag: string;
  title: string;
  text: string;
  /** null = placeholder dok klijent ne dostavi sliku */
  photo: Photo | null;
  placeholder?: string;
};

export type Stat =
  | { kind: "text"; value: string; label: string }
  | { kind: "count"; value: number; label: string };

export type AboutPoint = {
  title: string;
  text: string;
};

export type Review = {
  quote: string;
  author: string;
  source: string;
};

export type GalleryItem = Photo & {
  shape: "portrait" | "landscape";
};

export type ContactLink = {
  /** "direct" = telefon/email/adresa, "social" = profili na mrežama */
  group: "direct" | "social";
  label: string;
  value: string;
  href: string;
  external?: boolean;
};
