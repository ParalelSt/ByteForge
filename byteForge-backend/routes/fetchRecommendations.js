import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:id/recommendations", async (req, res) => {
  try {
    const { id } = req.params;

    const [productRows] = await db.query(
      "SELECT category FROM products WHERE id = ?",
      [id]
    );
    if (!productRows || productRows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const category = productRows[0].category;

    const [recommendations] = await db.query(
      "SELECT id, name, image, price FROM products WHERE category = ? AND id != ? ORDER BY RAND() LIMIT 20",
      [category, id]
    );
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching product recommendations: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
