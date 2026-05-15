import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "public");
const EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

function fmt(n) {
  return (n / 1024).toFixed(1) + " KB";
}

const files = await walk(ROOT);
let savedTotal = 0;
let origTotal = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const out = file.slice(0, -ext.length) + ".webp";
  const origSize = (await stat(file)).size;
  origTotal += origSize;

  const img = sharp(file);
  const meta = await img.metadata();
  const hasAlpha = meta.hasAlpha;

  await img
    .webp({
      quality: 82,
      alphaQuality: 90,
      effort: 6,
      smartSubsample: true,
      nearLossless: false,
    })
    .toFile(out);

  const newSize = (await stat(out)).size;
  savedTotal += newSize;
  console.log(
    `${path.relative(ROOT, file)} ${fmt(origSize)} -> ${path.relative(ROOT, out)} ${fmt(newSize)} (${((1 - newSize / origSize) * 100).toFixed(0)}% smaller, alpha=${hasAlpha})`,
  );
  await unlink(file);
}

console.log(
  `\nTotal: ${fmt(origTotal)} -> ${fmt(savedTotal)} (saved ${fmt(origTotal - savedTotal)}, ${((1 - savedTotal / origTotal) * 100).toFixed(0)}%)`,
);
