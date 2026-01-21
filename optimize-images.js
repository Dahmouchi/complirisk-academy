// optimize-images.js
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";

// === CONFIGURATION ===
const INPUT_DIR = "./public/cinq"; // folder containing your original images
const OUTPUT_DIR = "./public/optimized"; // where optimized images will be saved
const MAX_WIDTH = 1600; // resize max width (you can adjust)
const QUALITY = 80; // image quality (0–100)

// === FUNCTION ===
async function optimizeImages() {
  await fs.ensureDir(OUTPUT_DIR);
  const files = await fs.readdir(INPUT_DIR);

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);

    // Skip non-image files
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

    const outputWebP = path.join(OUTPUT_DIR, `${name}.webp`);

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Resize if too large
      const width = metadata.width > MAX_WIDTH ? MAX_WIDTH : metadata.width;

      await image.resize(width).webp({ quality: QUALITY }).toFile(outputWebP);

      console.log(`✅ Optimized: ${file} → ${name}.webp`);
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err);
    }
  }

  console.log("\n🎉 All images optimized successfully!");
}

optimizeImages();
