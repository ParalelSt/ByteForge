import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

// GET all discounts
router.get("/", async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from("discounts")
      .select("*")
      .eq("active", true);

    if (error) throw error;

    res.json(results);
  } catch (err) {
    console.error("Error fetching discounts:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET discounts for admin (all including inactive)
router.get("/admin/all", async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from("discounts")
      .select("*");

    if (error) throw error;

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
    const { data: existing, error: checkError } = await supabase
      .from("discounts")
      .select("*")
      .eq("productId", productId)
      .eq("active", true);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      return res
        .status(400)
        .json({ error: "This product already has an active discount" });
    }

    const { data: newDiscount, error: insertError } = await supabase
      .from("discounts")
      .insert([{ productId, percentage, active: true }])
      .select();

    if (insertError) throw insertError;

    const discount = newDiscount[0];
    res.json({
      success: true,
      discount: {
        id: discount.id,
        productId: discount.productId,
        percentage: discount.percentage,
        active: discount.active ? 1 : 0,
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

    const { data: updated, error } = await supabase
      .from("discounts")
      .update({ active })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!updated || updated.length === 0) {
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

    const { data: deleted, error } = await supabase
      .from("discounts")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!deleted || deleted.length === 0) {
      return res.status(404).json({ error: "Discount not found" });
    }

    res.json({ success: true, message: "Discount deleted" });
  } catch (err) {
    console.error("Error deleting discount:", err);
    res.status(500).json({ error: "Failed to delete discount" });
  }
});

export default router;
