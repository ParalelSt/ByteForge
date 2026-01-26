import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function checkMissing() {
  // Get all products from DB
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image");
  if (error) {
    console.error("DB Error:", error);
    return;
  }

  // Get all files in Supabase storage (excluding nested folder marker)
  const { data: files, error: listError } = await supabase.storage
    .from("product_images")
    .list("", { limit: 1000 });
  if (listError) {
    console.error("Storage Error:", listError);
    return;
  }

  const uploadedFiles = new Set(
    files.filter((f) => f.name !== "product_images").map((f) => f.name),
  );

  // Find products with missing images (no image field or image not in storage)
  const missing = [];
  for (const p of products) {
    if (!p.image) {
      missing.push({ ...p, reason: "no_image_field" });
    } else if (!uploadedFiles.has(p.image)) {
      missing.push({ ...p, reason: "not_in_storage" });
    }
  }

  // Also get local images folder
  const localImagesPath = path.join(
    __dirname,
    "..",
    "images",
    "product_images",
  );
  const localFiles = fs.existsSync(localImagesPath)
    ? fs.readdirSync(localImagesPath)
    : [];

  console.log("=== IMAGE STATUS ===\n");
  console.log("Total products in DB:", products.length);
  console.log("Images in Supabase storage:", uploadedFiles.size);
  console.log("Local images available:", localFiles.length);
  console.log("Products with missing/invalid images:", missing.length);
  console.log("");

  if (missing.length > 0) {
    console.log("=== PRODUCTS MISSING IMAGES ===\n");

    // Group by reason
    const noImageField = missing.filter((p) => p.reason === "no_image_field");
    const imageNotInStorage = missing.filter(
      (p) => p.reason === "not_in_storage",
    );

    if (noImageField.length > 0) {
      console.log(`Products with NO image field (${noImageField.length}):`);
      noImageField.forEach((p) => {
        console.log(`  - [${p.id}] ${p.name}`);
      });
      console.log("");
    }

    if (imageNotInStorage.length > 0) {
      console.log(
        `Products with image field but NOT in storage (${imageNotInStorage.length}):`,
      );
      imageNotInStorage.forEach((p) => {
        // Check if local file exists
        const localExists = localFiles.includes(p.image);
        // Check for similar files
        const baseName = p.image.replace(/\.[^.]+$/, "");
        const similar = [...uploadedFiles].filter((f) =>
          f.startsWith(baseName),
        );
        console.log(`  - [${p.id}] ${p.name}`);
        console.log(
          `      image: "${p.image}"${localExists ? " (EXISTS locally)" : ""}`,
        );
        if (similar.length > 0) {
          console.log(`      similar in storage: ${similar.join(", ")}`);
        }
      });
      console.log("");
    }
  }

  // Show working count
  const working = products.length - missing.length;
  console.log(
    `=== WORKING: ${working}/${products.length} products have valid images ===`,
  );
}

checkMissing();
