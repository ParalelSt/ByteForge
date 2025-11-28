import db from "../db.js";

async function checkDatabase() {
  try {
    console.log("Checking database structure...\n");

    // Check table structure
    const [columns] = await db.query("DESCRIBE products");
    console.log("Products table structure:");
    console.log(columns);

    console.log("\n\nChecking first 5 products:");
    const [products] = await db.query("SELECT * FROM products LIMIT 5");
    console.log(products);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkDatabase();
