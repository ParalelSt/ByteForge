import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

// GET /cart/:userId - Get all cart items for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(
        `
        id as cart_item_id,
        product_id,
        quantity,
        products(name, image, price)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;

    // Format response to match old format
    const formattedCart = cartItems.map((item) => ({
      cart_item_id: item.cart_item_id,
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.products?.name,
      image: item.products?.image,
      price: item.products?.price,
    }));

    res.json(formattedCart);
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
    const { data: existing, error: checkError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      // Update quantity
      const currentQuantity = existing[0].quantity;
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: currentQuantity + quantity })
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (updateError) throw updateError;
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert([{ user_id: userId, product_id: productId, quantity }]);

      if (insertError) throw insertError;
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
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;
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

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;

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

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

export default router;
