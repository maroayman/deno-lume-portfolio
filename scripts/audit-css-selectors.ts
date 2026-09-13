const STYLE_ROOT = "src/styles";
const SEARCH_DIRS = ["src", "scripts", "plugins"];
const CSS_EXTENSIONS = new Set([".css"]);
const SOURCE_EXTENSIONS = new Set([
  ".vto",
  ".ts",
  ".js",
  ".md",
  ".yml",
  ".json",
]);

function hasAllowedExtension(path: string, allowed: Set<string>) {
  return [...allowed].some((ext) => path.endsWith(ext));
}

async function collectFiles(
  root: string,
  allowed: Set<string>,
): Promise<string[]> {
  const files: string[] = [];
  for await (const entry of Deno.readDir(root)) {
    const full = `${root}/${entry.name}`;
    if (entry.isDirectory) {
      files.push(...await collectFiles(full, allowed));
      continue;
    }
    if (entry.isFile && hasAllowedExtension(full, allowed)) {
      files.push(full);
    }
  }
  return files;
}

const cssFiles = await collectFiles(STYLE_ROOT, CSS_EXTENSIONS);

const classNames = new Set<string>();
const classRegex = /(^|[^a-zA-Z0-9_-])\.([a-zA-Z][a-zA-Z0-9_-]*)/g;

for (const file of cssFiles) {
  const css = await Deno.readTextFile(file);
  for (const match of css.matchAll(classRegex)) {
    classNames.add(match[2]);
  }
}

const sourceFiles = (
  await Promise.all(
    SEARCH_DIRS.map((dir) => collectFiles(dir, SOURCE_EXTENSIONS)),
  )
).flat();

const sourceText = (
  await Promise.all(sourceFiles.map((file) => Deno.readTextFile(file)))
).join("\n");

const unused = [...classNames].filter((className) =>
  !sourceText.includes(className)
).sort();

if (unused.length === 0) {
  console.log(
    `No unused CSS classes found across ${cssFiles.length} style files.`,
  );
  Deno.exit(0);
}

console.log("Potentially unused CSS classes:");
for (const className of unused) {
  console.log(`- ${className}`);
}

console.log("\nTip: review dynamic class usage before deleting selectors.");
