import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all reviews for a product
router.get("/products/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.query;
    console.log(`Fetching reviews for product: ${productId}`);

    const query = `
      SELECT 
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.title,
        r.text,
        r.helpful_count,
        r.created_at,
        COALESCE(u.name, u.email) as username,
        NULL as profile_image,
        CASE 
          WHEN rh.user_id IS NOT NULL THEN 1 
          ELSE 0 
        END as user_marked_helpful
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN review_helpful rh ON r.id = rh.review_id AND rh.user_id = ?
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `;

    const connection = await db.getConnection();
    const [reviews] = await connection.query(query, [userId || 0, productId]);
    connection.release();

    console.log(`Found ${reviews.length} reviews for product ${productId}`);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
});

// POST create a new review
router.post("/reviews", async (req, res) => {
  try {
    const { product_id, user_id, rating, title, text } = req.body;

    if (!product_id || !user_id || !rating || !title || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO reviews (product_id, user_id, rating, title, text)
      VALUES (?, ?, ?, ?, ?)
    `;

    const connection = await db.getConnection();
    const [result] = await connection.query(query, [
      product_id,
      user_id,
      rating,
      title,
      text,
    ]);
    connection.release();

    res.status(201).json({
      id: result.insertId,
      product_id,
      user_id,
      rating,
      title,
      text,
      helpful_count: 0,
      created_at: new Date(),
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Error creating review" });
  }
});

// PATCH update helpful count (toggle add/remove with user tracking)
router.patch("/reviews/:reviewId/helpful", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const connection = await db.getConnection();

    // Check if user already marked this review as helpful
    const [existing] = await connection.query(
      "SELECT id FROM review_helpful WHERE review_id = ? AND user_id = ?",
      [reviewId, userId]
    );

    if (existing.length > 0) {
      // User already marked - remove the mark
      await connection.query(
        "DELETE FROM review_helpful WHERE review_id = ? AND user_id = ?",
        [reviewId, userId]
      );
      await connection.query(
        "UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = ?",
        [reviewId]
      );
    } else {
      // User hasn't marked - add the mark
      await connection.query(
        "INSERT INTO review_helpful (review_id, user_id) VALUES (?, ?)",
        [reviewId, userId]
      );
      await connection.query(
        "UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?",
        [reviewId]
      );
    }

    connection.release();
    res.json({ message: "Helpful count updated" });
  } catch (error) {
    console.error("Error updating helpful count:", error);
    res.status(500).json({ message: "Error updating helpful count" });
  }
});

// DELETE a review (only by owner or admin)
router.delete("/reviews/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { user_id } = req.body;

    // Check if user is the review author
    const checkQuery = "SELECT user_id FROM reviews WHERE id = ?";
    const connection = await db.getConnection();
    const [review] = await connection.query(checkQuery, [reviewId]);

    if (!review.length || review[0].user_id !== user_id) {
      connection.release();
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deleteQuery = "DELETE FROM reviews WHERE id = ?";
    await connection.query(deleteQuery, [reviewId]);
    connection.release();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

export default router;
