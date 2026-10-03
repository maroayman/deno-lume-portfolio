/**
 * Shared build-time helpers for blog templates.
 *
 * These functions implement the data preparation that used to live inline
 * in Vento templates (`blog.vto`, `layouts/blog.vto`) and in
 * `src/blog/tags.page.ts`:
 *
 * - post sorting (date desc, title asc tiebreak — Lume ignores multi-field
 *   order strings, so the secondary sort must be explicit everywhere),
 * - tag counting for the filter UI,
 * - related-post selection,
 * - cover thumbnail URLs.
 *
 * Templates consume them through Vento filters registered in `_config.ts`
 * (`|> sortPosts`, `|> tagCounts`, `|> relatedPosts`, `|> thumb`), and
 * `tags.page.ts` imports `sortPosts` directly.
 *
 * Rule of thumb: TypeScript prepares data, Vento renders it. Simple
 * presentation conditionals stay in the templates.
 *
 * WARNING — Lume search caching: `search.pages()` results are cached per
 * query string, and `tags.page.ts` (a generator, running before page
 * rendering) makes the first call. As a result:
 * - `search.pages("type=post", "date=desc")` returns the 18 posts
 *   (tag pages don't exist yet when the generator runs),
 * - a later bare `search.pages("type=post")` returns all 37 type=post
 *   pages (18 posts + 19 generated tag pages, which inherit
 *   `type: post` from the `/blog` data cascade).
 * `blog.vto` relies on both: the ordered query feeds the card grid and
 * tag counts, while the unordered query feeds the "All (N)" total.
 * Do NOT collapse these into a single call — the rendered total would
 * change from 37 to 18. See also the note in `src/blog.vto`.
 */

export interface TagCount {
  tag: string;
  count: number;
}

function postTime(value: unknown): number {
  const time = value instanceof Date
    ? value.getTime()
    : new Date(String(value)).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function postTags(post: Lume.Data): string[] {
  return Array.isArray(post.tags) ? (post.tags as string[]) : [];
}

/**
 * Sort posts date-descending with a title-ascending tiebreak so same-date
 * posts order deterministically.
 */
export function sortPosts(posts: Lume.Data[]): Lume.Data[] {
  return posts.slice().sort((a, b) =>
    postTime(b.date) - postTime(a.date) ||
    String(a.title).localeCompare(String(b.title))
  );
}

/** Count tag usage across posts, sorted by count descending. */
export function tagCounts(posts: Lume.Data[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of postTags(post)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Up to `limit` posts sharing at least one tag with the current page,
 * excluding the page itself. Input order does not matter — sorting is
 * applied internally.
 */
export function relatedPosts(
  posts: Lume.Data[],
  url: string,
  tags: string[],
  limit = 3,
): Lume.Data[] {
  return sortPosts(posts)
    .filter((post) =>
      post.url !== url && postTags(post).some((tag) => tags.includes(tag))
    )
    .slice(0, limit);
}

/** Thumbnail variant of a cover path ("photo.jpg" -> "photo-thumb.jpg"). */
export function thumb(cover: string): string {
  return cover.replace(/(\.[a-z]+)$/, "-thumb$1");
}
