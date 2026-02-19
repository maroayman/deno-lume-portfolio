import lume from "lume/mod.ts";
import vento from "lume/plugins/vento.ts";
import postcss from "lume/plugins/postcss.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import date from "lume/plugins/date.ts";
import markdown from "lume/plugins/markdown.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import inline from "lume/plugins/inline.ts";

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

site.preprocess([".md"], (pages) => {
  for (const page of pages) {
    if (page.data.tags && Array.isArray(page.data.tags)) {
      page.data.tags = page.data.tags.map((tag: string) => tag.toLowerCase());
    }
  }
});

site.use(inline());
site.use(postcss());
site.use(sitemap());

if (isProduction) {
  site.use(minifyHTML());
}

export default site;
