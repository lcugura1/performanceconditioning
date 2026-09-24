import "./Divider.scss";

/**
 * Razdjelnik između svijetlih sekcija: tanka linija po kojoj kosi lime potez
 * iz logotipa "sprinta" slijeva nadesno dok skrolaš preko njega.
 */
export function Divider() {
  return (
    <div className="wrap" aria-hidden="true">
      <div className="divider">
        <span className="divider__run">
          <span className="divider__shard" />
        </span>
      </div>
    </div>
  );
}
