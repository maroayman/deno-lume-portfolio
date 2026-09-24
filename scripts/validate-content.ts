import { parse } from "jsr:@std/yaml@1.1.0";

const errors: string[] = [];

function requireString(value: unknown, field: string, source: string) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${source}: ${field} must be a non-empty string`);
  }
}

function requireArray(value: unknown, field: string, source: string) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${source}: ${field} must contain at least one item`);
  }
}

async function readYaml(path: string): Promise<unknown> {
  try {
    return parse(await Deno.readTextFile(path));
  } catch (error) {
    errors.push(
      `${path}: invalid YAML (${
        error instanceof Error ? error.message : error
      })`,
    );
    return null;
  }
}

const collections = [
  {
    path: "src/_data/experience.yml",
    fields: [
      "title",
      "company",
      "period",
      "description",
      "responsibilities",
      "tags",
    ],
  },
  {
    path: "src/_data/projects.yml",
    fields: ["title", "period", "summary", "highlights", "tech"],
  },
  { path: "src/_data/certifications.yml", fields: ["title", "issuer", "date"] },
  { path: "src/_data/stack.yml", fields: ["name", "description", "items"] },
];

for (const collection of collections) {
  const data = await readYaml(collection.path);
  if (!Array.isArray(data)) {
    errors.push(`${collection.path}: expected a YAML list`);
    continue;
  }

  data.forEach((entry, index) => {
    const source = `${collection.path}[${index}]`;
    if (!entry || typeof entry !== "object") {
      errors.push(`${source}: expected an object`);
      return;
    }
    for (const field of collection.fields) {
      const value = (entry as Record<string, unknown>)[field];
      if (
        ["responsibilities", "tags", "highlights", "tech", "items"].includes(
          field,
        )
      ) {
        requireArray(value, field, source);
      } else {
        requireString(value, field, source);
      }
    }
  });
}

// uses.json drives the Uses page (src/uses.vto) — same guarantees apply.
try {
  const groups: unknown = JSON.parse(
    await Deno.readTextFile("src/_data/uses.json"),
  );
  if (!Array.isArray(groups) || groups.length === 0) {
    errors.push("src/_data/uses.json: expected a non-empty list");
  } else {
    groups.forEach((group: unknown, index: number) => {
      const source = `src/_data/uses.json[${index}]`;
      if (!group || typeof group !== "object") {
        errors.push(`${source}: expected an object`);
        return;
      }
      const g = group as Record<string, unknown>;
      requireString(g.group, "group", source);
      if (!Array.isArray(g.items) || g.items.length === 0) {
        errors.push(`${source}: items must contain at least one item`);
        return;
      }
      g.items.forEach((item: unknown, itemIndex: number) => {
        const itemSource = `${source}.items[${itemIndex}]`;
        if (!item || typeof item !== "object") {
          errors.push(`${itemSource}: expected an object`);
          return;
        }
        const it = item as Record<string, unknown>;
        requireString(it.name, "name", itemSource);
        requireString(it.desc, "desc", itemSource);
      });
    });
  }
} catch (error) {
  errors.push(
    `src/_data/uses.json: unreadable (${
      error instanceof Error ? error.message : error
    })`,
  );
}

const blogFiles = [...Deno.readDirSync("src/blog")]
  .filter((entry) => entry.isFile && entry.name.endsWith(".md"));
const slugs = new Set<string>();

for (const file of blogFiles) {
  const path = `src/blog/${file.name}`;
  const source = await Deno.readTextFile(path);
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${path}: missing frontmatter`);
    continue;
  }

  let frontmatter: unknown;
  try {
    frontmatter = parse(match[1]);
  } catch (error) {
    errors.push(
      `${path}: invalid frontmatter YAML (${
        error instanceof Error ? error.message : error
      })`,
    );
    continue;
  }
  if (!frontmatter || typeof frontmatter !== "object") {
    errors.push(`${path}: frontmatter must be an object`);
    continue;
  }

  const data = frontmatter as Record<string, unknown>;
  requireString(data.title, "title", path);
  requireString(data.description, "description", path);
  // YAML auto-parses unquoted dates (e.g. `date: 2026-09-04`) into Date
  // objects — accept those exactly as Lume's date plugin does.
  if (
    !(typeof data.date === "string" && data.date.trim() !== "") &&
    !(data.date instanceof Date)
  ) {
    errors.push(`${path}: date must be a non-empty string or date`);
  }
  requireArray(data.tags, "tags", path);

  // Covers render via 320px thumbnails (blog-card + related posts) with the
  // full file in srcset — every cover needs its `-thumb` sibling, generated
  // with: magick cover.jpg -resize '320x>' -quality 70 cover-thumb.jpg
  // (see docs/ADDING_BLOG.md). Thumbs ship inside the GHCR images artifact.
  if (typeof data.cover === "string" && data.cover.startsWith("/images/")) {
    const thumb = data.cover.replace(/(\.[a-z]+)$/i, "-thumb$1");
    try {
      Deno.statSync(`src/public${thumb}`);
    } catch {
      errors.push(`${path}: cover thumbnail missing (${thumb})`);
    }
  }

  const slug = file.name.replace(/\.md$/, "");
  if (slugs.has(slug)) errors.push(`${path}: duplicate slug`);
  slugs.add(slug);
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  Deno.exit(1);
}

console.log(
  `Content validation passed: ${blogFiles.length} blog posts and ${collections.length} data collections checked.`,
);
