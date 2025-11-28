import db from "../db.js";

async function addSubcategoryColumn() {
  try {
    console.log("Adding subcategory column to products table...");

    await db.query(
      "ALTER TABLE products ADD COLUMN subcategory VARCHAR(100) NULL"
    );

    console.log("✅ Subcategory column added successfully!");
    process.exit(0);
  } catch (error) {
    if (error.code === "ER_DUP_FIELDNAME") {
      console.log("✓ Subcategory column already exists");
      process.exit(0);
    } else {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }
}

addSubcategoryColumn();
