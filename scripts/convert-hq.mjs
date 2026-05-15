import sharp from "sharp";
import { stat, unlink } from "node:fs/promises";
import path from "node:path";

const files = [
  "public/gsap3/normalita.png",
  "public/gsap3/opaca-negra.png",
  "public/gsap3/sin-fondo.png",
];

for (const file of files) {
  const out = file.replace(/\.png$/, ".webp");
  const origSize = (await stat(file)).size;

  await sharp(file)
    .webp({
      quality: 95,
      alphaQuality: 100,
      effort: 6,
      smartSubsample: false,
      nearLossless: true,
    })
    .toFile(out);

  const newSize = (await stat(out)).size;
  console.log(
    `${path.basename(file)} ${(origSize / 1024).toFixed(0)} KB -> ${path.basename(out)} ${(newSize / 1024).toFixed(0)} KB (${((1 - newSize / origSize) * 100).toFixed(0)}% smaller)`,
  );
  await unlink(file);
}
