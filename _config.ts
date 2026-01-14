import lume from "lume/mod.ts";
import vento from "lume/plugins/vento.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import date from "lume/plugins/date.ts";
import toc from "lume_markdown_plugins/toc.ts";

const site = lume({
    src: "./src",
    dest: "./dist",
    location: new URL("https://yourportfolio.com"),
});

// Template engine
site.use(vento());

// Date formatting
site.use(date());

// Reading time
site.use(readingInfo());

// Code highlighting
site.use(codeHighlight());

// TOC generator
site.use(toc());

// Assets
site.add("styles");
site.add("assets");
site.add("public", ".");
site.add([".pdf"]);

// Optimizations
site.use(postcss());
site.use(terser());
site.use(sitemap());
site.use(minifyHTML());

export default site;
