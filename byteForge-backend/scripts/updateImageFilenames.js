import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function updateFilenames() {
  // Connect to DB
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("Connected to database.");

  // Read image folder
  const imageFiles = fs.readdirSync("images/product_images");

  // Get all products
  const [products] = await db.query("SELECT id, image FROM products");

  for (const product of products) {
    const { id, image } = product;

    // Build the new filename with .png extension
    const baseName = image.replace(/\.\w+$/, ""); // remove extension
    const newFileName = baseName + ".png";

    // Check if file exists in images/product_images/ (case-insensitive)
    const matchedFile = imageFiles.find(
      (file) => file.toLowerCase() === newFileName.toLowerCase()
    );

    if (matchedFile) {
      await db.query("UPDATE products SET image = ? WHERE id = ?", [
        matchedFile,
        id,
      ]);

      console.log(`✔ Updated product ${id}: ${image} → ${matchedFile}`);
    } else {
      console.log(`✖ NO MATCH for product ${id} (${image})`);
    }
  }

  await db.end();
  console.log("\n🎉 Finished auto-updating database image filenames!");
}

updateFilenames();
