import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const SRC_DIR = path.join(process.cwd(), "images", "productImages");
const DEST_DIR = path.join(process.cwd(), "images", "product_images");

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

async function main() {
  // List all files in SRC_DIR
  const srcFiles = fs.readdirSync(SRC_DIR);
  // List all files in DEST_DIR
  const destFiles = new Set(fs.readdirSync(DEST_DIR));

  let moved = 0;
  let processed = 0;
  let uploaded = 0;
  let failed = [];

  for (const file of srcFiles) {
    const baseName = path.basename(file, path.extname(file));
    const destPngName = baseName + ".png";
    if (!destFiles.has(destPngName)) {
      const srcPath = path.join(SRC_DIR, file);
      const destPath = path.join(DEST_DIR, destPngName);
      const buffer = fs.readFileSync(srcPath);
      if (path.extname(file).toLowerCase() !== ".png") {
        try {
          // Try remove.bg first (optional, can be commented out)
          // If remove.bg fails, convert to PNG locally
          let pngBuffer;
          try {
            pngBuffer = await removeBgConvertToPng(buffer);
          } catch (err) {
            // If remove.bg fails, convert locally
            pngBuffer = await sharp(buffer).png().toBuffer();
            console.log(`Converted to PNG locally: ${file}`);
          }
          fs.writeFileSync(destPath, pngBuffer);
          await uploadToSupabase(pngBuffer, destPngName);
          processed++;
          uploaded++;
          console.log(`Processed and uploaded: ${destPngName}`);
        } catch (err) {
          console.error(`Error converting/uploading ${file}:`, err.message);
          failed.push(file);
        }
      } else {
        // Already PNG, just copy and upload
        fs.copyFileSync(srcPath, destPath);
        await uploadToSupabase(buffer, destPngName);
        moved++;
        uploaded++;
        console.log(`Moved and uploaded: ${destPngName}`);
      }
    }
  }

  console.log(
    `\nMoved: ${moved}, Processed: ${processed}, Uploaded: ${uploaded}`,
  );
  if (failed.length) {
    console.log(`Failed to process: ${failed.length}`);
    failed.forEach((f) => console.log(`  - ${f}`));
  }
}

main().catch(console.error);
