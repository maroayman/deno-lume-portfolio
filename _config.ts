import lume from "lume/mod.ts";
import vento from "lume/plugins/vento.ts";
import lightningcss from "lume/plugins/lightningcss.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import date from "lume/plugins/date.ts";
import markdown from "lume/plugins/markdown.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import inline from "lume/plugins/inline.ts";
import feed from "lume/plugins/feed.ts";

const isProduction = Deno.env.get("DENO_ENV") === "production";

const site = lume({
  src: "./src",
  dest: "./_site",
  location: new URL("https://maroayman.vercel.app"),
});

site.use(vento());
site.use(markdown());
site.use(date());
site.use(slugifyUrls());

/**
 * Custom "slug" filter — available in all Vento templates as `|> slug`.
 *
 * Usage: `{{ tag |> slug }}` → URL-safe lowercase string, spaces → hyphens.
 *
 * Deliberately does NOT rely on the `slugifyUrls` plugin's internal helper so
 * that tag-link generation in templates is decoupled from the URL-slug plugin.
 */
site.filter("slug", (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
});

site.add("styles");
site.add("assets");
site.add("public", ".");
site.add([".pdf"]);

site.data("layout", "layouts/blog.vto", "/blog");
site.data("type", "post", "/blog");

/**
 * Tag-lowercasing + reading-time preprocessor — runs on every Markdown page before build.
 *
 * 1. Tag lowercasing: ensures tags are always stored in lowercase regardless of
 *    how they are written in frontmatter (e.g. "DevOps" → "devops"). Keeps
 *    tag-based filtering and the `|> slug` filter output consistent.
 *
 * 2. Reading-time: strips Markdown syntax from the raw source, counts words at
 *    200 wpm, and exposes the result as `page.data.readingTime` (number, minutes,
 *    minimum 1). Templates can render it directly without any client-side JS.
 */
site.preprocess([".md"], (pages) => {
  for (const page of pages) {
    // --- tag lowercasing ---
    if (page.data.tags && Array.isArray(page.data.tags)) {
      page.data.tags = page.data.tags.map((tag: string) => tag.toLowerCase());
    }

    // --- reading time ---
    // page.content holds the raw Markdown source string at preprocess time.
    const rawContent = page.content;
    if (typeof rawContent === "string") {
      // Strip fenced code blocks, inline code, HTML tags, images, links,
      // heading markers, blockquote markers, and horizontal rules so that
      // non-prose tokens don't inflate the word count.
      const plain = rawContent
        .replace(/```[\s\S]*?```/g, "") // fenced code blocks
        .replace(/`[^`]*`/g, "") // inline code
        .replace(/!\[.*?\]\(.*?\)/g, "") // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links — keep label text
        .replace(/<[^>]+>/g, "") // HTML tags
        .replace(/^#{1,6}\s+/gm, "") // heading markers
        .replace(/^>\s+/gm, "") // blockquote markers
        .replace(/^[-*_]{3,}\s*$/gm, "") // horizontal rules
        .replace(/[*_~`#>|]/g, ""); // remaining Markdown punctuation

      const words = plain.trim().split(/\s+/).filter((w) => w.length > 0).length;
      page.data.readingTime = Math.max(1, Math.ceil(words / 200));
    }
  }
});

site.use(inline());
site.use(lightningcss());

site.use(sitemap());

// RSS feed — generates /feed.rss from all pages with type=post
site.use(feed({
  output: "/feed.rss",
  query: "type=post",
  sort: "date=desc",
  limit: 20,
  info: {
    title: "Marwan Ayman Shawky — Blog",
    description: "Cloud & DevOps Engineering articles by Marwan Ayman Shawky",
    lang: "en",
    authorName: "Marwan Ayman Shawky",
    authorUrl: "https://maroayman.vercel.app",
    generator: true,
  },
  items: {
    title: "=title",
    description: "=description",
    published: "=date",
    content: "=children",
    lang: "=lang",
    image: "=cover",
  },
}));

if (isProduction) {
  site.use(minifyHTML());
}

export default site;
