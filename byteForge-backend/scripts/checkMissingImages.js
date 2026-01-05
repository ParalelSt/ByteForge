import db from "../db.js";
import fs from "fs";

async function checkMissingImages() {
  try {
    // Get all products with their image filenames
    const [products] = await db.query(
      "SELECT id, name, image FROM products WHERE image IS NOT NULL ORDER BY id"
    );

    // Get list of actual image files
    const imagesDir = "./images/product_images";
    const imageFiles = fs.readdirSync(imagesDir);

    console.log("Checking for missing product images...\n");

    let missingCount = 0;
    const missingProducts = [];

    for (const product of products) {
      if (!imageFiles.includes(product.image)) {
        missingCount++;
        missingProducts.push({
          id: product.id,
          name: product.name,
          image: product.image,
        });
      }
    }

    if (missingCount === 0) {
      console.log("✅ All products have their images in the folder!");
    } else {
      console.log(`❌ Found ${missingCount} products missing images:\n`);
      missingProducts.forEach((p) => {
        console.log(`  Product ID: ${p.id}`);
        console.log(`  Name: ${p.name}`);
        console.log(`  Missing image: ${p.image}`);
        console.log("");
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkMissingImages();
