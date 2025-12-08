import db from "../db.js";

async function checkAllTables() {
  try {
    console.log("=== USERS TABLE ===\n");
    const [users] = await db.query("DESCRIBE users");
    console.log(users);

    console.log("\n\n=== PRODUCTS TABLE ===\n");
    const [products] = await db.query("DESCRIBE products");
    console.log(products);

    console.log("\n\n=== CHECKING IF ORDERS TABLE EXISTS ===\n");
    try {
      const [orders] = await db.query("DESCRIBE orders");
      console.log(orders);
    } catch (e) {
      console.log("❌ orders table does not exist yet");
    }

    console.log("\n\n=== CHECKING IF ORDER_ITEMS TABLE EXISTS ===\n");
    try {
      const [items] = await db.query("DESCRIBE order_items");
      console.log(items);
    } catch (e) {
      console.log("❌ order_items table does not exist yet");
    }

    await db.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await db.end();
    process.exit(1);
  }
}

checkAllTables();
