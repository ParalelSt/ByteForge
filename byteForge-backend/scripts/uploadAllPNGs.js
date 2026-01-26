import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const localPath = path.join(__dirname, "..", "images", "product_images");

async function uploadAllPNGs() {
  const localFiles = fs.existsSync(localPath) ? fs.readdirSync(localPath) : [];
  const pngs = localFiles.filter((f) => f.toLowerCase().endsWith(".png"));
  let uploaded = 0;
  for (const file of pngs) {
    const filePath = path.join(localPath, file);
    const fileBuffer = fs.readFileSync(filePath);
    const { error } = await supabase.storage
      .from("product_images")
      .upload(file, fileBuffer, { upsert: true, contentType: "image/png" });
    if (error) {
      console.error(`Failed to upload ${file}:`, error.message);
    } else {
      console.log(`Uploaded: ${file}`);
      uploaded++;
    }
  }
  console.log(`\nTotal PNGs uploaded: ${uploaded}`);
}

uploadAllPNGs();
