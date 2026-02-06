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

// Helper function to parse date strings like "Jan 2026", "Jun 2025 – Dec 2025", "2025", "Aug 2025"
function parseDateString(dateStr: string): Date {
    if (!dateStr) return new Date(0);
    
    // Handle "Present" - return far future date
    if (dateStr.toLowerCase().includes("present")) {
        return new Date(2099, 11, 31);
    }
    
    // Extract first date from range (e.g., "Jun 2025 – Dec 2025" -> "Jun 2025")
    const firstPart = dateStr.split(/[–-]/)[0].trim();
    
    // Handle year only (e.g., "2025")
    if (/^\d{4}$/.test(firstPart)) {
        return new Date(parseInt(firstPart), 11, 31); // End of year
    }
    
    // Handle "Mon YYYY" format
    const monthMatch = firstPart.match(/^(\w+)\s+(\d{4})$/);
    if (monthMatch) {
        const months: { [key: string]: number } = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        };
        const month = months[monthMatch[1].toLowerCase().slice(0, 3)] ?? 0;
        const year = parseInt(monthMatch[2]);
        return new Date(year, month, 1);
    }
    
    return new Date(0);
}

// Sort data arrays by date (newest first)
site.process("*", (pages) => {
    for (const page of pages) {
        // Sort experience by period (newest first)
        if (page.data.experience && Array.isArray(page.data.experience)) {
            page.data.experience.sort((a: { period: string }, b: { period: string }) => {
                const dateA = parseDateString(a.period);
                const dateB = parseDateString(b.period);
                return dateB.getTime() - dateA.getTime();
            });
        }
        
        // Sort projects by period (newest first)
        if (page.data.projects && Array.isArray(page.data.projects)) {
            page.data.projects.sort((a: { period: string }, b: { period: string }) => {
                const dateA = parseDateString(a.period);
                const dateB = parseDateString(b.period);
                return dateB.getTime() - dateA.getTime();
            });
        }
        
        // Sort certifications by date (newest first)
        if (page.data.certifications && Array.isArray(page.data.certifications)) {
            page.data.certifications.sort((a: { date: string }, b: { date: string }) => {
                const dateA = parseDateString(a.date);
                const dateB = parseDateString(b.date);
                return dateB.getTime() - dateA.getTime();
            });
        }
    }
});

// Tag normalization processor
site.preprocess([".md"], (pages) => {
    for (const page of pages) {
        if (page.data.tags && Array.isArray(page.data.tags)) {
            // Normalize tags to lowercase
            page.data.tags = page.data.tags.map((tag: string) => tag.toLowerCase());
        }
    }
});

// Inline plugin for critical CSS
site.use(inline());

// Optimizations
site.use(postcss());
site.use(sitemap());

// Production optimizations
if (isProduction) {
    site.use(minifyHTML());
}

export default site;
