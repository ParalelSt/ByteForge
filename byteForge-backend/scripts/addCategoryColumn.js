import db from "../db.js";

async function addCategoryColumn() {
  try {
    console.log("Adding category column to products table...");

    await db.query("ALTER TABLE products ADD COLUMN category VARCHAR(50) NULL");

    console.log("✅ Category column added successfully!");
    process.exit(0);
  } catch (error) {
    if (error.code === "ER_DUP_FIELDNAME") {
      console.log("✓ Category column already exists");
      process.exit(0);
    } else {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }
}

addCategoryColumn();
