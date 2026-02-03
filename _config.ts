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

// Approved tags list - add new tags here
const APPROVED_TAGS = [
    "linux",
    "docker",
    "aws",
    "automation",
    "wsl",
    "storage",
    "security",
    "python",
    "networking",
    "go",
    "containers",
    "ansible",
    "kubernetes",
    "devops",
    "ci-cd",
    "git",
];

// Tag validation and normalization processor
site.preprocess([".md"], (pages) => {
    for (const page of pages) {
        if (page.data.tags && Array.isArray(page.data.tags)) {
            // Normalize tags to lowercase
            page.data.tags = page.data.tags.map((tag: string) => tag.toLowerCase());

            // Validate tags
            for (const tag of page.data.tags) {
                if (tag !== "post" && !APPROVED_TAGS.includes(tag)) {
                    console.warn(
                        `\x1b[33m[Tag Warning]\x1b[0m Unknown tag "${tag}" in: ${page.src.path}${page.src.ext}. Consider adding it to APPROVED_TAGS in _config.ts`
                    );
                }
            }
        }
    }
});

// Optimizations
site.use(postcss());
site.use(sitemap());

// Production optimizations
if (isProduction) {
    site.use(minifyHTML());
}

export default site;
