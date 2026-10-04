import { Icon } from "~/components/ui/Icon";
import { formatDate, posts } from "~/content/blog";
import type { Audience } from "~/content/types";
import { scrollToSection } from "~/lib/scroll-to";

/** Najnoviji članak skupine (PDF u novom prozoru) i link na sekciju Blog. */
export function BlogCard({ audience }: { audience: Audience }) {
  const [post] = posts.filter((p) => p.audience === audience).sort((a, b) => b.date.localeCompare(a.date));
  if (!post) return null;

  return (
    <article className="blogc">
      <span className="label">Blog</span>
      <span className="blogc__meta">
        PDF · {formatDate(post.date)}
      </span>
      <h4>{post.title}</h4>
      <p>{post.excerpt}</p>
      <div className="blogc__foot">
        {post.pdf ? (
          <a className="ulink" href={post.pdf} target="_blank" rel="noopener">
            Otvori PDF
            <Icon name="arrowUpRight" />
          </a>
        ) : (
          <span className="tag">PDF uskoro</span>
        )}
        <a className="ulink" href="#blog" onClick={(e) => scrollToSection("blog") && e.preventDefault()}>
          Svi članci
          <Icon name="arrowDown" />
        </a>
      </div>
    </article>
  );
}
