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
 * Tag-lowercasing preprocessor — runs on every Markdown page before build.
 *
 * Ensures tags are always stored in lowercase regardless of how they are
 * written in frontmatter (e.g. "DevOps" → "devops"). This keeps tag-based
 * filtering and the `|> slug` filter output consistent across all pages.
 */
site.preprocess([".md"], (pages) => {
  for (const page of pages) {
    if (page.data.tags && Array.isArray(page.data.tags)) {
      page.data.tags = page.data.tags.map((tag: string) => tag.toLowerCase());
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
