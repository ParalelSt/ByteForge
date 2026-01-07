import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

router.get("/:id/recommendations", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: productRows, error: fetchError } = await supabase
      .from("products")
      .select("category")
      .eq("id", id);

    if (fetchError) throw fetchError;
    if (!productRows || productRows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const category = productRows[0].category;

    const { data: recommendations, error } = await supabase
      .from("products")
      .select("id, name, image, price")
      .eq("category", category)
      .neq("id", id)
      .limit(20);

    if (error) throw error;
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching product recommendations: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
