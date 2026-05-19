import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const TARGET_HUE = 8;
const TARGET_SAT = 0.53;
const TARGET_LIGHT = 0.43;

const DIRS = [
  "public/aud-marca",
  "public/narrativa",
  "public/autoridadimg",
];

const SKIP = new Set([
  "IMG_1577.webp",
  "IMG_1579.webp",
  "grabaccion.webp",
]);

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s; const l = (max + min) / 2;
  if (max === min) { h = 0; s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return [h, s, l];
}
function hslToRgb(h, s, l) {
  h /= 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = (t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [
    Math.round(hk(h + 1 / 3) * 255),
    Math.round(hk(h) * 255),
    Math.round(hk(h - 1 / 3) * 255),
  ];
}

const TARGET_RGB = [166, 67, 51];

function peachMask(h, s, l) {
  let hd = Math.abs(h - 22);
  if (hd > 180) hd = 360 - hd;
  const hueW = Math.max(0, 1 - hd / 14);
  const satW = Math.max(0, Math.min(1, (s - 0.55) / 0.30));
  const lightW = Math.max(0, 1 - Math.abs(l - 0.74) / 0.22);
  return hueW * satW * lightW;
}

function recolor(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const m = peachMask(h, s, l);
  if (m < 0.05) return null;
  const k = Math.min(1, m * 1.6);
  const lightnessFactor = Math.max(0.55, Math.min(1.05, l / 0.75));
  const tr = Math.round(TARGET_RGB[0] * lightnessFactor);
  const tg = Math.round(TARGET_RGB[1] * lightnessFactor);
  const tb = Math.round(TARGET_RGB[2] * lightnessFactor);
  return [
    Math.round(r * (1 - k) + tr * k),
    Math.round(g * (1 - k) + tg * k),
    Math.round(b * (1 - k) + tb * k),
  ];
}

async function process(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let touched = 0;
  for (let i = 0; i < data.length; i += ch) {
    const out = recolor(data[i], data[i + 1], data[i + 2]);
    if (out) {
      data[i] = out[0];
      data[i + 1] = out[1];
      data[i + 2] = out[2];
      touched++;
    }
  }
  const out = file.replace(/\.webp$/, ".new.webp");
  await sharp(data, { raw: { width: info.width, height: info.height, channels: ch } })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(out);
  const sz = (await stat(file)).size;
  const pct = ((touched / (data.length / ch)) * 100).toFixed(1);
  console.log(`${path.basename(file)}: ${pct}% pixels recolored, ${(sz / 1024).toFixed(0)} KB`);
}

for (const dir of DIRS) {
  for (const entry of await readdir(dir)) {
    if (!entry.endsWith(".webp")) continue;
    if (SKIP.has(entry)) { console.log(`skip ${entry}`); continue; }
    await process(path.join(dir, entry));
  }
}
