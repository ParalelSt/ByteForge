import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function listProductsMissingImages() {
  // Get all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image");
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  // Get all PNGs in storage
  const { data: files, error: storageError } = await supabase.storage
    .from("product_images")
    .list("");
  if (storageError) {
    console.error("Error listing storage files:", storageError);
    return;
  }
  const pngs = new Set(
    files
      .filter((f) => f.name.toLowerCase().endsWith(".png"))
      .map((f) => f.name),
  );

  // Find products with missing images
  const missing = products.filter((p) => !p.image || !pngs.has(p.image));

  if (missing.length === 0) {
    console.log("All products have images in storage.");
    return;
  }

  // Write missing products to temp.json for automation
  const fs = await import("fs");
  const path = await import("path");
  const tempPath = path.join(process.cwd(), "temp.json");
  fs.writeFileSync(tempPath, JSON.stringify(missing, null, 2));
  console.log(
    `Products missing images written to temp.json (${missing.length} products).`,
  );
}

listProductsMissingImages();
