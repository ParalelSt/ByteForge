import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /products with discounts
router.get("/", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    const [discounts] = await db.query(
      "SELECT * FROM discounts WHERE active = 1"
    );

    // Attach discount info to products
    const productsWithDiscounts = products.map((product) => {
      const discount = discounts.find((d) => d.productId === product.id);
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
    const [products] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = products[0];

    // Get discount if active
    const [discounts] = await db.query(
      "SELECT * FROM discounts WHERE productId = ? AND active = 1",
      [product.id]
    );

    const discount = discounts.length > 0 ? discounts[0] : null;

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
    const [product] = await db.query(
      "SELECT category, subcategory FROM products WHERE id = ?",
      [req.params.id]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { category, subcategory } = product[0];

    const [recommendedProducts] = await db.query(
      "SELECT * FROM products WHERE (category = ? OR subcategory = ?) AND id != ? LIMIT 8",
      [category, subcategory, req.params.id]
    );

    // Attach discount info
    const [discounts] = await db.query(
      "SELECT * FROM discounts WHERE active = 1"
    );

    const productsWithDiscounts = recommendedProducts.map((prod) => {
      const discount = discounts.find((d) => d.productId === prod.id);
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
