import lume from "lume/mod.ts";
import vento from "lume/plugins/vento.ts";
import postcss from "lume/plugins/postcss.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import date from "lume/plugins/date.ts";

const site = lume({
    src: "./src",
    dest: "./dist",
    location: new URL("https://maroayman.vercel.app"),
});

// Template engine
site.use(vento());

// Date formatting
site.use(date());

// Assets
site.add("styles");
site.add("assets");
site.add("public", ".");
site.add([".pdf"]);

// Optimizations
site.use(postcss());
site.use(sitemap());
site.use(minifyHTML());

export default site;
