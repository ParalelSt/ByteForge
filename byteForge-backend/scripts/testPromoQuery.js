import db from "../db.js";

async function testQuery() {
  try {
    console.log("Testing promo query...\n");

    const result = await db.query(
      "SELECT * FROM promos WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1"
    );

    console.log("Full result:", result);
    console.log("\nResult type:", typeof result);
    console.log("Is array:", Array.isArray(result));
    console.log("Result length:", result.length);

    const [rows] = result;
    console.log("\nRows:", rows);
    console.log("Rows is array:", Array.isArray(rows));
    console.log("Rows length:", rows ? rows.length : "null/undefined");

    if (rows && rows.length > 0) {
      console.log("\nFirst row:", rows[0]);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testQuery();
