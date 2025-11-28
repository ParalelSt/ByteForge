import express from "express";

const router = express.Router();

router.get("/promo", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM promos WHERE is_active = TRUE LIMIT 1"
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "No active promo found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch promo" });
  }
});

export default router;
