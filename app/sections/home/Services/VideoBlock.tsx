import { useState } from "react";
import type { AudienceInfo, Photo } from "~/content/types";

type Props = {
  video: AudienceInfo["video"];
  /** fotka dok video ne postoji */
  poster: Photo;
  /** "Video o …", natpis preko postera */
  title: string;
};

const PLAY = "M7 4.5v15l13-7.5z";

/**
 * Video se ne učitava dok ga posjetitelj ne pokrene: do tad je to samo poster
 * i gumb. Tek klik ubacuje <video>, pa sekcija ne troši megabajte unaprijed.
 */
export function VideoBlock({ video, poster, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (video && playing) {
    return (
      <div className="vid">
        <video className="vid__el" src={video.src} poster={video.poster} controls autoPlay playsInline />
      </div>
    );
  }

  return (
    <div className="vid">
      <img src={video?.poster ?? poster.src} alt="" loading="lazy" decoding="async" />
      <span className="grid-ov" />
      <button
        type="button"
        className="vid__play"
        disabled={!video}
        aria-label={video ? `Pokreni: ${title}` : `${title} — uskoro`}
        onClick={() => setPlaying(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={PLAY} />
        </svg>
      </button>
      <div className="vid__cap">
        <b>{title}</b>
        {!video && <span className="tag">Uskoro</span>}
      </div>
    </div>
  );
}
