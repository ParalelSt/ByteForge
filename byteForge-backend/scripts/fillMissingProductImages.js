import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const PRODUCT_IMAGES_DIR = path.join(
  process.cwd(),
  "byteForge-backend",
  "images",
  "product_images",
);
const GENERAL_IMAGES_DIR = path.join(
  process.cwd(),
  "byteForge-backend",
  "images",
);

// Remove.bg API
async function removeBgConvertToPng(imageBuffer) {
  const form = new FormData();
  form.append("size", "auto");
  form.append("image_file", imageBuffer, { filename: "image.jpg" });
  const response = await axios({
    method: "post",
    url: "https://api.remove.bg/v1.0/removebg",
    data: form,
    headers: {
      ...form.getHeaders(),
      "X-Api-Key": process.env.REMOVE_BG_KEY,
    },
    responseType: "arraybuffer",
  });
  return response.data;
}

// Upload PNG to Supabase
async function uploadToSupabase(imageBuffer, filename) {
  const { error } = await supabase.storage
    .from("product_images")
    .upload(filename, imageBuffer, {
      contentType: "image/png",
      upsert: true,
    });
  if (error) throw error;
}

// Main logic
async function main() {
  // Read missing products from listProductsMissingImages.js output (assume output is in temp.json)
  const missingListPath = path.join(process.cwd(), "temp.json");
  if (!fs.existsSync(missingListPath)) {
    console.error("Missing temp.json with missing products list.");
    return;
  }
  const missingProducts = JSON.parse(fs.readFileSync(missingListPath, "utf8"));

  // List all files in GENERAL_IMAGES_DIR (excluding product_images/ and promo_images/)
  const generalFiles = fs.readdirSync(GENERAL_IMAGES_DIR).filter((f) => {
    const fullPath = path.join(GENERAL_IMAGES_DIR, f);
    return (
      fs.statSync(fullPath).isFile() &&
      !f.startsWith("product_images") &&
      !f.startsWith("promo_images")
    );
  });

  let filled = 0;
  let notFound = [];

  for (const product of missingProducts) {
    const expectedName = product.image;
    if (!expectedName) continue;
    // Try to find a file with the same base name (any extension)
    const baseName = path.basename(expectedName, path.extname(expectedName));
    const match = generalFiles.find(
      (f) => path.basename(f, path.extname(f)) === baseName,
    );
    if (match) {
      const srcPath = path.join(GENERAL_IMAGES_DIR, match);
      const destPngName = baseName + ".png";
      const destPath = path.join(PRODUCT_IMAGES_DIR, destPngName);
      const buffer = fs.readFileSync(srcPath);
      // Convert to PNG if not already
      if (path.extname(match).toLowerCase() !== ".png") {
        try {
          const pngBuffer = await removeBgConvertToPng(buffer);
          fs.writeFileSync(destPath, pngBuffer);
          await uploadToSupabase(pngBuffer, destPngName);
          filled++;
          console.log(`Filled: ${product.name} with ${destPngName}`);
        } catch (err) {
          console.error(`Error converting/uploading ${match}:`, err.message);
          notFound.push(product.name);
        }
      } else {
        // Already PNG, just move/copy and upload
        fs.copyFileSync(srcPath, destPath);
        await uploadToSupabase(buffer, destPngName);
        filled++;
        console.log(`Filled: ${product.name} with ${destPngName}`);
      }
    } else {
      notFound.push(product.name);
      console.log(`No image found for: ${product.name}`);
    }
  }

  console.log(`\nFilled ${filled} products.`);
  if (notFound.length) {
    console.log(`No image found for ${notFound.length} products:`);
    notFound.forEach((n) => console.log(`  - ${n}`));
  }
}

main().catch(console.error);
