import fs from "fs";
import path from "path";
import supabase from "../supabase.js";

const IMAGES_DIR = path.join(process.cwd(), "images", "product_images");

async function fixProductImages() {
  // Get all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image");
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
  // List all PNG images in product_images
  const localImages = new Set(
    fs.readdirSync(IMAGES_DIR).filter((f) => f.endsWith(".png")),
  );
  // Find products with missing or mismatched images
  let mismatched = [];
  for (const p of products) {
    if (!p.image || !localImages.has(p.image)) {
      mismatched.push(p);
    }
  }
  console.log("Products with missing or mismatched images:");
  mismatched.forEach((p) =>
    console.log(`ID: ${p.id}, Name: ${p.name}, DB Image: ${p.image}`),
  );
  // Attempt to auto-fix by matching product name to image file
  for (const p of mismatched) {
    const base = p.name.trim().toLowerCase().replace(/\s+/g, "_");
    const candidates = Array.from(localImages).filter((img) =>
      img.toLowerCase().includes(base),
    );
    if (candidates.length) {
      const newImg = candidates[0];
      await supabase.from("products").update({ image: newImg }).eq("id", p.id);
      console.log(`Updated product ${p.id} (${p.name}) to image ${newImg}`);
    } else {
      console.log(`No suitable image found for product ${p.id} (${p.name})`);
    }
  }
}

fixProductImages();
