import db from "../db.js";

const migrateReviewsTable = async () => {
  try {
    const connection = await db.getConnection();

    // Check existing columns
    const [columns] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'reviews'"
    );

    const columnNames = columns.map((col) => col.COLUMN_NAME);
    console.log("Current columns:", columnNames);

    // Add missing columns if they don't exist
    if (!columnNames.includes("title")) {
      console.log("Adding 'title' column...");
      await connection.query(
        "ALTER TABLE reviews ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'Review'"
      );
      console.log("✓ Added 'title' column");
    }

    if (!columnNames.includes("text")) {
      console.log("Adding 'text' column...");
      await connection.query("ALTER TABLE reviews ADD COLUMN text LONGTEXT");
      console.log("✓ Added 'text' column");
    }

    if (!columnNames.includes("helpful_count")) {
      console.log("Adding 'helpful_count' column...");
      await connection.query(
        "ALTER TABLE reviews ADD COLUMN helpful_count INT DEFAULT 0"
      );
      console.log("✓ Added 'helpful_count' column");
    }

    // Migrate data from 'comment' to 'text' if both columns exist
    if (columnNames.includes("comment")) {
      console.log("Migrating data from 'comment' to 'text'...");
      await connection.query(
        "UPDATE reviews SET text = comment WHERE text IS NULL OR text = ''"
      );
      console.log("✓ Data migrated");
    }

    connection.release();
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  }
};

migrateReviewsTable();
