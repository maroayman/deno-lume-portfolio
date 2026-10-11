// Build-time image dimensions for CLS-safe <img> output (no deps).
//
// Markdown images (`![](...)`) render as <img> without width/height, so
// every image load shifts the content below it. This module reads the
// headers of local post images (WebP VP8/VP8L/VP8X, PNG, GIF, JPEG) and
// lets the `.md` preprocessor rewrite them as sized <img> tags,
// reserving space before the file arrives. Unknown/corrupt files return
// null and the original Markdown is left untouched.

const cache = new Map<string, [number, number] | null>();

function parseImage(buf: Uint8Array): [number, number] | null {
  const tag = (at: number) =>
    String.fromCharCode(buf[at], buf[at + 1], buf[at + 2], buf[at + 3]);
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  // PNG: 8-byte signature, IHDR width/height at fixed offsets.
  if (
    buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 &&
    buf[2] === 0x4e && buf[3] === 0x47 && tag(12) === "IHDR"
  ) {
    const w = view.getUint32(16, false);
    const h = view.getUint32(20, false);
    return w > 0 && h > 0 ? [w, h] : null;
  }

  // GIF: "GIF87a"/"GIF89a", dimensions at bytes 6-9 (LE).
  if (
    buf.length > 10 && tag(0) === "GIF8" &&
    (buf[4] === 0x37 || buf[4] === 0x39) && buf[5] === 0x61
  ) {
    const w = view.getUint16(6, true);
    const h = view.getUint16(8, true);
    return w > 0 && h > 0 ? [w, h] : null;
  }

  // JPEG: scan segments for a Start-Of-Frame marker (baseline,
  // progressive, extended — not DHT/DAC), which carries height then
  // width (BE).
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2;
    while (off + 9 <= buf.length) {
      if (buf[off] !== 0xff) break;
      const marker = buf[off + 1];
      if (marker === 0xd8 || marker === 0xd9) {
        off += 2;
        continue;
      }
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        off += 2;
        continue;
      }
      const len = view.getUint16(off + 2, false);
      if (len < 2) break;
      if (
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8
      ) {
        const h = view.getUint16(off + 5, false);
        const w = view.getUint16(off + 7, false);
        return w > 0 && h > 0 ? [w, h] : null;
      }
      off += 2 + len;
    }
    return null;
  }

  // WebP: RIFF....WEBP container, VP8/VP8L/VP8X chunks.
  if (tag(0) !== "RIFF" || tag(8) !== "WEBP") return null;
  let off = 12;
  while (off + 8 <= buf.length) {
    const chunk = tag(off);
    const size = view.getUint32(off + 4, true);
    const d = off + 8;
    if (chunk === "VP8 ") {
      if (buf[d + 3] === 0x9d && buf[d + 4] === 0x01 && buf[d + 5] === 0x2a) {
        const w = (buf[d + 6] | (buf[d + 7] << 8)) & 0x3fff;
        const h = (buf[d + 8] | (buf[d + 9] << 8)) & 0x3fff;
        if (w > 0 && h > 0) return [w, h];
        return null;
      }
    } else if (chunk === "VP8L") {
      if (buf[d] === 0x2f) {
        const w = 1 + (((buf[d + 2] & 0x3f) << 8) | buf[d + 1]);
        const h = 1 +
          (((buf[d + 4] & 0x0f) << 10) | (buf[d + 3] << 2) |
            ((buf[d + 2] & 0xc0) >> 6));
        if (w > 0 && h > 0) return [w, h];
        return null;
      }
    } else if (chunk === "VP8X") {
      const w = 1 + (buf[d + 4] | (buf[d + 5] << 8) | (buf[d + 6] << 16));
      const h = 1 + (buf[d + 7] | (buf[d + 8] << 8) | (buf[d + 9] << 16));
      if (w > 0 && h > 0) return [w, h];
      return null;
    }
    off = d + size + (size % 2);
  }
  return null;
}

/** Pixel dimensions of a local image file, or null when unreadable. */
export function imageDims(path: string): [number, number] | null {
  const hit = cache.get(path);
  if (hit !== undefined) return hit;
  let out: [number, number] | null = null;
  try {
    out = parseImage(Deno.readFileSync(path));
  } catch {
    out = null;
  }
  cache.set(path, out);
  return out;
}
