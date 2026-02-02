import lume from "lume/mod.ts";
import vento from "lume/plugins/vento.ts";
import postcss from "lume/plugins/postcss.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import date from "lume/plugins/date.ts";
import markdown from "lume/plugins/markdown.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";

const isProduction = Deno.env.get("DENO_ENV") === "production";

const site = lume({
    src: "./src",
    dest: "./dist",
    location: new URL("https://maroayman.vercel.app"),
});

// Template engine
site.use(vento());

// Markdown for blog posts
site.use(markdown());

// Date formatting
site.use(date());

// URL slugification
site.use(slugifyUrls());

// Custom slug filter for templates
site.filter("slug", (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
});

// Assets
site.add("styles");
site.add("assets");
site.add("public", ".");
site.add([".pdf"]);

// Blog post defaults
site.data("layout", "layouts/blog.vto", "/blog");
site.data("type", "post", "/blog");

// Optimizations
site.use(postcss());
site.use(sitemap());

// Production optimizations
if (isProduction) {
    site.use(minifyHTML());
}

export default site;
