/**
 * markdown-tabs — custom markdown-it block rule
 *
 * Uses a dedicated :::tabs / ::: fence so inner ```lang blocks are never
 * confused with the outer delimiter.
 *
 * Syntax:
 *
 *   :::tabs
 *   [YAML]
 *   ```yaml
 *   your: yaml
 *   ```
 *
 *   [bash]
 *   ```bash
 *   kubectl apply -f deployment.yaml
 *   ```
 *   :::
 *
 * Each [Label] line starts a new tab. Everything between two labels (or
 * between the last label and :::) is rendered as normal Markdown so inner
 * fenced code blocks work correctly.
 */

// deno-lint-ignore-file no-explicit-any
export default function markdownTabsPlugin(md: any) {
  // ── Block rule ──────────────────────────────────────────────────────────────
  // Runs before the built-in fence rule (priority 100) so we handle :::tabs
  // lines ourselves.
  md.block.ruler.before(
    "fence",
    "tabs",
    function tabsRule(
      state: any,
      startLine: number,
      endLine: number,
      silent: boolean,
    ): boolean {
      const startPos = state.bMarks[startLine] + state.tShift[startLine];
      const lineText = state.src.slice(startPos, state.eMarks[startLine]);

      // Opening marker must be exactly ":::tabs"
      if (lineText.trim() !== ":::tabs") return false;
      if (silent) return true;

      // Scan forward for closing ":::"
      let nextLine = startLine + 1;
      let found = false;
      while (nextLine < endLine) {
        const pos = state.bMarks[nextLine] + state.tShift[nextLine];
        const text = state.src.slice(pos, state.eMarks[nextLine]);
        if (text.trim() === ":::") { found = true; break; }
        nextLine++;
      }
      if (!found) return false;

      // Grab raw content between opening and closing markers
      const rawLines: string[] = [];
      for (let i = startLine + 1; i < nextLine; i++) {
        const pos = state.bMarks[i];
        rawLines.push(state.src.slice(pos, state.eMarks[i]));
      }
      const raw = rawLines.join("\n");

      // Push a custom inline token so we can handle rendering ourselves
      const token = state.push("tabs_block", "", 0);
      token.content = raw;
      token.map = [startLine, nextLine];

      state.line = nextLine + 1;
      return true;
    },
    { alt: ["paragraph", "reference", "blockquote", "list"] },
  );

  // ── Renderer ────────────────────────────────────────────────────────────────
  md.renderer.rules["tabs_block"] = function (
    tokens: any,
    idx: any,
    _options: any,
    env: any,
  ): string {
    const raw: string = tokens[idx].content;
    const tabs: { label: string; content: string }[] = [];
    let currentLabel = "";
    let currentLines: string[] = [];

    for (const line of raw.split("\n")) {
      const labelMatch = line.match(/^\[(.+)\]\s*$/);
      if (labelMatch) {
        if (currentLabel) {
          tabs.push({ label: currentLabel, content: currentLines.join("\n").trim() });
        }
        currentLabel = labelMatch[1];
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }
    if (currentLabel) {
      tabs.push({ label: currentLabel, content: currentLines.join("\n").trim() });
    }

    if (tabs.length === 0) return `<pre><code>${escapeHtml(raw)}</code></pre>\n`;

    let buttons = "";
    let panes = "";

    tabs.forEach((tab, i) => {
      const id = tab.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const activeClass = i === 0 ? " active" : "";
      buttons += `<button class="code-tab-btn${activeClass}" data-tab="${id}">${escapeHtml(tab.label)}</button>`;
      const renderedContent = md.render(tab.content, env);
      panes += `<div class="code-tab-pane${activeClass}" data-tab="${id}">${renderedContent}</div>`;
    });

    return `<div class="code-tabs"><div class="code-tab-buttons">${buttons}</div>${panes}</div>\n`;
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
