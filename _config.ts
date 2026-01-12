import lume from "lume/mod.ts";
import vento from "lume/plugins/vento.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";

const site = lume({
    src: "./src",
    dest: "./dist",
    location: new URL("https://yourportfolio.com"),
});

site.use(vento());
site.use(postcss());
site.use(terser());
site.use(sitemap());
site.use(minifyHTML());

site.copy("assets");
site.copy("public", ".");
site.copy([".pdf"]);

export default site;
