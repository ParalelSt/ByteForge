import db from "../db.js";

const createTable = async () => {
  try {
    const connection = await db.getConnection();

    const query = `
      CREATE TABLE IF NOT EXISTS review_helpful (
        id INT AUTO_INCREMENT PRIMARY KEY,
        review_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_review_user (review_id, user_id),
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await connection.query(query);
    console.log("✅ review_helpful table created successfully!");
    connection.release();
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createTable();
