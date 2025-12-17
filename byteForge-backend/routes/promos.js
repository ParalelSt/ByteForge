import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/promo", async (req, res) => {
  console.log("Received GET /promos/promo");
  try {
    const [rows] = await db.query(
      "SELECT * FROM promos WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1"
    );
    console.log(
      "Promos query rows length:",
      Array.isArray(rows) ? rows.length : "non-array"
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No active promo found" });
    }

    const promo = rows[0];
    console.log("Promo row:", promo);
    const backendUrl = req.protocol + "://" + req.get("host");
    const imageFile = promo.image || null;
    const imageUrl = imageFile
      ? `${backendUrl}/images/promo_images/${imageFile}`
      : null;
    res.json({
      id: promo.id,
      title: promo.title,
      description: promo.description,
      image: imageFile,
      imageUrl,
      link: promo.link,
      is_active: promo.is_active,
      created_at: promo.created_at,
    });
  } catch (err) {
    console.error("Promo route error:", err.stack || err);
    res.status(500).json({ error: err.message || "Failed to fetch promo" });
  }
});

// Fallback test endpoint to isolate issues
router.get("/promo-test", (req, res) => {
  const backendUrl = req.protocol + "://" + req.get("host");
  res.json({
    id: 0,
    title: "Test Promo",
    description: "This is a test promo response.",
    imageUrl: `${backendUrl}/images/promo_images/1764615377699.png`,
    link: "/shop/promo",
    is_active: 1,
  });
});

export default router;
