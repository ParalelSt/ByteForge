import db from "../db.js";

async function createCartTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `;

    await db.query(createTableQuery);
    console.log("✅ cart_items table created successfully!");

    // Verify the table structure
    const [structure] = await db.query("DESCRIBE cart_items");
    console.log("\nTable structure:");
    console.table(structure);

    await db.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await db.end();
    process.exit(1);
  }
}

createCartTable();
