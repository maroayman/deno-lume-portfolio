import lume from "lume/mod.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";

const site = lume({
    src: "./src",
    dest: "./dist",
    location: new URL("https://yourportfolio.com"),
});

site.use(nunjucks());
site.use(postcss());
site.use(terser());
site.use(sitemap());
site.use(minifyHTML());

site.copy("assets");
site.copy("public", ".");
site.copy([".pdf"]);
site.copy("sw.js");

export default site;
