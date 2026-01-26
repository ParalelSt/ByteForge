import fs from "fs";
import path from "path";
import supabase from "../supabase.js";

const IMAGES_DIR = path.join(process.cwd(), "images", "product_images");

async function addNewProductsForImages() {
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
  // Find images not referenced by any product
  const referencedImages = new Set(
    products.map((p) => p.image).filter(Boolean),
  );
  const newImages = Array.from(localImages).filter(
    (img) => !referencedImages.has(img),
  );
  console.log("Images not referenced by any product:");
  newImages.forEach((img) => console.log(img));
  // Create new product records for these images
  for (const img of newImages) {
    const name = img
      .replace(/\.png$/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    await supabase
      .from("products")
      .insert({
        name,
        image: img,
        description: "",
        price: 0,
        category: "",
        subcategory: "",
      });
    console.log(`Created product for image: ${img} with name: ${name}`);
  }
}

addNewProductsForImages();
