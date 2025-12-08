import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, items } = req.body;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "user_id and items required" });
    }

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const [result] = await db.execute(
      "INSERT INTO orders (user_id, total) VALUES (? , ?)",
      [user_id, total]
    );

    const orderId = result.insertId;

    for (const item of items) {
      await db.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );
    }

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: orderId,
        user_id,
        total,
        items: items.length,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error creating order" });
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
