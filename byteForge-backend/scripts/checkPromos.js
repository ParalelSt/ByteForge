import db from "../db.js";

async function checkPromos() {
  try {
    console.log("Checking promos table...\n");

    // Check if table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'promos'");
    console.log("Promos table exists:", tables.length > 0);

    if (tables.length > 0) {
      // Check table structure
      const [columns] = await db.query("DESCRIBE promos");
      console.log("\nPromos table structure:");
      console.log(columns);

      // Check all promos
      const [promos] = await db.query("SELECT * FROM promos");
      console.log("\nAll promos:");
      console.log(promos);

      // Check active promos
      const [activePromos] = await db.query(
        "SELECT * FROM promos WHERE is_active = 1"
      );
      console.log("\nActive promos:");
      console.log(activePromos);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

checkPromos();
