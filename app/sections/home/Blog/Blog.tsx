import { useState } from "react";
import { Icon } from "~/components/ui/Icon";
import { audiences } from "~/content/audiences";
import { formatDate, posts } from "~/content/blog";
import type { Audience, Post } from "~/content/types";
import { orderByAudience, useAudience } from "~/features/audience/useAudience";
import { cx } from "~/lib/cx";
import "./Blog.scss";

type Filter = Audience | "sve";

const shortOf = (id: Audience) => audiences.find((a) => a.id === id)!.short;
const filters: Filter[] = ["sve", ...audiences.map((a) => a.id)];

/** Popis članaka kao tablica; članci odabrane skupine idu prvi, filter suzi na jednu skupinu. */
export function Blog() {
  const selected = useAudience();
  const [filter, setFilter] = useState<Filter>("sve");

  const byDate = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const ordered = orderByAudience(byDate, selected, (p) => p.audience);
  const shown = filter === "sve" ? ordered : ordered.filter((p) => p.audience === filter);

  return (
    <section className="blog" id="blog">
      <div className="wrap">
        <div className="blog__head rv">
          <h2 className="title">Bilješke s terena.</h2>
          <p>
            Kratki članci o treningu, oporavku i razvoju mladih sportaša. Svaki se otvara kao PDF u novom
            prozoru.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filtriraj članke">
          {filters.map((f) => (
            <button
              type="button"
              key={f}
              className={cx("fchip", filter === f && "is-on")}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === "sve" ? "Sve" : shortOf(f)}{" "}
              <sup>{f === "sve" ? posts.length : posts.filter((p) => p.audience === f).length}</sup>
            </button>
          ))}
        </div>

        <ol className="posts">
          {shown.map((p, i) => (
            <li key={`${filter}-${p.slug}`}>
              <Row post={p} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Row({ post, index }: { post: Post; index: number }) {
  const body = (
    <>
      <span className="post__n">{String(index + 1).padStart(2, "0")}</span>
      <span className="post__t">{post.title}</span>
      <span className="post__tag">
        <span className="tag">{shortOf(post.audience)}</span>
      </span>
      <span className="post__m post__date">
        {formatDate(post.date)} · {post.minutes} min
      </span>
      <span className="post__m post__go">{post.pdf ? <Icon name="arrowUpRight" /> : "Uskoro"}</span>
    </>
  );

  return post.pdf ? (
    <a className="post" href={post.pdf} target="_blank" rel="noopener">
      {body}
    </a>
  ) : (
    <div className="post">{body}</div>
  );
}
