import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all discounts
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM discounts WHERE active = 1"
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching discounts:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET discounts for admin (all including inactive)
router.get("/admin/all", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM discounts");
    res.json(results);
  } catch (err) {
    console.error("Error fetching discounts:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST create a new discount
router.post("/", async (req, res) => {
  try {
    const { productId, percentage } = req.body;

    if (!productId || !percentage) {
      return res
        .status(400)
        .json({ error: "Product ID and percentage are required" });
    }

    // Check if discount already exists for this product
    const [existing] = await db.query(
      "SELECT * FROM discounts WHERE productId = ? AND active = 1",
      [productId]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "This product already has an active discount" });
    }

    const [result] = await db.execute(
      "INSERT INTO discounts (productId, percentage, active) VALUES (?, ?, 1)",
      [productId, percentage]
    );

    res.json({
      success: true,
      discount: {
        id: result.insertId,
        productId,
        percentage,
        active: 1,
      },
    });
  } catch (err) {
    console.error("Error creating discount:", err);
    res.status(500).json({ error: "Failed to create discount" });
  }
});

// PATCH update discount status
router.patch("/:id/active", async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const [result] = await db.execute(
      "UPDATE discounts SET active = ? WHERE id = ?",
      [active ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }

    res.json({ success: true, message: "Discount updated" });
  } catch (err) {
    console.error("Error updating discount:", err);
    res.status(500).json({ error: "Failed to update discount" });
  }
});

// DELETE remove a discount
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute("DELETE FROM discounts WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }

    res.json({ success: true, message: "Discount deleted" });
  } catch (err) {
    console.error("Error deleting discount:", err);
    res.status(500).json({ error: "Failed to delete discount" });
  }
});

export default router;
