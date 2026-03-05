/**
 * Tag index generator — produces one page per unique tag at /blog/tags/[tag]/.
 *
 * Each generated page lists all blog posts that carry that tag, sorted by
 * date descending. Pagination is handled client-side in layouts/tag.vto.
 * The layout is `layouts/tag.vto`.
 */

export const layout = "layouts/tag.vto";

export default function* (
  { search }: Lume.Data,
  { slug }: Lume.Helpers,
): Generator<Partial<Lume.Data>> {
  // Collect every unique tag used across all blog posts.
  const allPosts = search.pages("type=post", "date=desc") as Lume.Data[];
  const tagSet = new Set<string>();
  for (const post of allPosts) {
    if (Array.isArray(post.tags)) {
      for (const tag of post.tags as string[]) {
        tagSet.add(tag);
      }
    }
  }

  for (const tag of tagSet) {
    const posts = allPosts.filter(
      (p) => Array.isArray(p.tags) && (p.tags as string[]).includes(tag),
    );

    yield {
      url: `/blog/tags/${slug(tag)}/`,
      title: `Posts tagged "${tag}" — Marwan Ayman Shawky`,
      description: `All articles tagged with "${tag}" on Marwan Ayman Shawky's blog.`,
      tag,
      posts,
    };
  }
}
