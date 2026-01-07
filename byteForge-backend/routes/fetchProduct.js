import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: rows, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id);

    if (error) throw error;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching product: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
