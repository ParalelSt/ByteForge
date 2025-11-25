import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /products
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    res.json(results);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
