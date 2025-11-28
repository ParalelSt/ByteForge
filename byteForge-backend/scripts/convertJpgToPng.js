import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, "../images/product_images");
const outputDir = inputDir;

async function convertJpgToPng() {
  console.log("Converting JPG images to PNG...\n");

  const files = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith(".jpg"));

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    try {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace(".jpg", ".png"));

      await sharp(inputPath).png().toFile(outputPath);

      console.log(`✓ Converted: ${file} → ${path.basename(outputPath)}`);

      // Delete the old jpg file
      fs.unlinkSync(inputPath);

      successCount++;
    } catch (error) {
      console.error(`✗ Failed: ${file} - ${error.message}`);
      failCount++;
    }
  }

  console.log(`\n✅ Converted ${successCount} images to PNG`);
  if (failCount > 0) {
    console.log(`❌ Failed ${failCount} images`);
  }
}

convertJpgToPng();
