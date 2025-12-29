import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /cart/:userId - Get all cart items for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [cartItems] = await db.query(
      `SELECT 
        c.id as cart_item_id,
        c.product_id,
        c.quantity,
        p.name,
        p.image,
        p.price
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?`,
      [userId]
    );

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// POST /cart - Add item to cart or update quantity
router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if item already exists in cart
    const [existing] = await db.query(
      "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      // Update quantity
      await db.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, productId]
      );
    } else {
      // Insert new item
      await db.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity]
      );
    }

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// PATCH /cart/:userId/:productId - Update quantity
router.patch("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      // If quantity is 0 or negative, delete the item
      await db.query(
        "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
        [userId, productId]
      );
    } else {
      await db.query(
        "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, productId]
      );
    }

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// DELETE /cart/clear/:userId - Clear entire cart for a user (must be before the /:userId/:productId route)
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await db.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// DELETE /cart/:userId/:productId - Remove item from cart
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    await db.query(
      "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

export default router;
