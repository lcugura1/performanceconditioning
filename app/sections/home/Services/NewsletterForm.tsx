import { useId, useState } from "react";
import type { AudienceInfo } from "~/content/types";

/** Prijava na newsletter jedne skupine (svaka skupina = svoja grupa u alatu za mailove). */
export function NewsletterForm({ audience }: { audience: AudienceInfo }) {
  const [done, setDone] = useState(false);
  const id = useId();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: spojiti na MailerLite; polje "audience" određuje grupu pretplatnika
    setDone(true);
  };

  return (
    <div className="news">
      <div>
        <span className="label">Newsletter</span>
        <p role={done ? "status" : undefined}>
          {done ? "Hvala, prijavljen si. Prvi broj stiže na tvoj email." : audience.newsletter}
        </p>
      </div>

      {!done && (
        <form className="uform" onSubmit={submit}>
          <input type="hidden" name="audience" value={audience.id} />
          <label className="ufield" htmlFor={id}>
            <span>Email</span>
            <input id={id} type="email" name="email" placeholder="tvoj@email.com" required autoComplete="email" />
          </label>
          <button className="pill pill--white" type="submit">
            Prijavi se
          </button>
        </form>
      )}
    </div>
  );
}
