import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

// GET /products with discounts
router.get("/", async (req, res) => {
  try {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) throw productsError;

    const { data: discounts, error: discountsError } = await supabase
      .from("discounts")
      .select("*")
      .eq("active", true);

    if (discountsError) throw discountsError;

    // Attach discount info to products
    const productsWithDiscounts = products.map((product) => {
      const discount = discounts.find((d) => d.productid === product.id);
      return {
        ...product,
        discount: discount || null,
      };
    });

    res.json(productsWithDiscounts);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /products/:id with discount
router.get("/:id", async (req, res) => {
  try {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .limit(1);

    if (productsError) throw productsError;

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = products[0];

    // Get discount if active
    const { data: discounts, error: discountsError } = await supabase
      .from("discounts")
      .select("*")
      .eq("productid", product.id)
      .eq("active", true)
      .limit(1);

    if (discountsError) throw discountsError;

    const discount = discounts && discounts.length > 0 ? discounts[0] : null;

    res.json({
      ...product,
      discount,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /products/:id/recommendations
router.get("/:id/recommendations", async (req, res) => {
  try {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("category, subcategory")
      .eq("id", req.params.id)
      .limit(1);

    if (productError) throw productError;

    if (!product || product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { category, subcategory } = product[0];

    const { data: recommendedProducts, error: recomError } = await supabase
      .from("products")
      .select("*")
      .or(`category.eq.${category},subcategory.eq.${subcategory}`)
      .neq("id", req.params.id)
      .limit(8);

    if (recomError) throw recomError;

    // Attach discount info
    const { data: discounts, error: discountsError } = await supabase
      .from("discounts")
      .select("*")
      .eq("active", true);

    if (discountsError) throw discountsError;

    const productsWithDiscounts = recommendedProducts.map((prod) => {
      const discount = discounts.find((d) => d.productid === prod.id);
      return {
        ...prod,
        discount: discount || null,
      };
    });

    res.json(productsWithDiscounts);
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
