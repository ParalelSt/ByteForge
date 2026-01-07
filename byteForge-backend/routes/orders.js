import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, items } = req.body;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "You need to add items to be able to checkout" });
    }

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([{ user_id, total }])
      .select();

    if (orderError) throw orderError;

    const orderId = orderData[0].id;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

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

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
