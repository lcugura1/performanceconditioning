import type { Photo } from "~/content/types";
import { cx } from "~/lib/cx";
import { Icon } from "./Icon";

type MediaProps = {
  photo: Photo;
  className?: string;
  /** Hero i popup su iznad pregiba — ne odgađaj učitavanje */
  eager?: boolean;
  imgRef?: React.Ref<HTMLImageElement>;
};

/** Fotografija u okviru koji je obrezuje (object-fit: cover). */
export function Media({ photo, className, eager, imgRef }: MediaProps) {
  return (
    <div className={cx("media", className)}>
      <img
        ref={imgRef}
        src={photo.src}
        alt={photo.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={photo.position ? { objectPosition: photo.position } : undefined}
      />
    </div>
  );
}

/** Mjesto za sliku koju klijent još nije dostavio. */
export function MediaPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cx("media ph", className)} role="img" aria-label={`Mjesto za sliku: ${label}`}>
      <div className="ph__in">
        <Icon name="monitor" />
        <span>{label}</span>
      </div>
    </div>
  );
}
