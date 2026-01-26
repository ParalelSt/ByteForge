import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const localPath = path.join(__dirname, "..", "images", "product_images");

// Heuristic: placeholder images are often small, have generic names, or are below a certain size threshold
const PLACEHOLDER_SIZE_KB = 10; // Images smaller than 10KB are likely placeholders
const PLACEHOLDER_NAMES = [
  "placeholder",
  "default",
  "noimage",
  "missing",
  "sample",
  "test",
];

function isPlaceholder(file) {
  const filePath = path.join(localPath, file);
  const stats = fs.statSync(filePath);
  const sizeKB = stats.size / 1024;
  const lowerName = file.toLowerCase();
  return (
    sizeKB < PLACEHOLDER_SIZE_KB ||
    PLACEHOLDER_NAMES.some((name) => lowerName.includes(name))
  );
}

async function removePlaceholders() {
  const localFiles = fs.existsSync(localPath) ? fs.readdirSync(localPath) : [];
  const pngs = localFiles.filter((f) => f.toLowerCase().endsWith(".png"));
  const placeholders = pngs.filter(isPlaceholder);

  if (placeholders.length === 0) {
    console.log("No placeholder images found.");
    return;
  }

  console.log("Removing placeholder images:");
  placeholders.forEach((f) => console.log(f));

  // Remove locally
  for (const file of placeholders) {
    fs.unlinkSync(path.join(localPath, file));
  }

  // Remove from Supabase
  const { error } = await supabase.storage
    .from("product_images")
    .remove(placeholders);
  if (error) {
    console.error("Error removing from Supabase:", error.message);
  } else {
    console.log("Removed placeholder images from Supabase storage.");
  }
}

removePlaceholders();
