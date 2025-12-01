import express from "express";
import multer from "multer";
import db from "../db.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM promos ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch promos" });
  }
});

import fs from "fs";
import path from "path";

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and desription required" });
    }

    let imageFileName = null;

    if (req.file) {
      const promoImagesDir = path.join(process.cwd(), "images/promo_images");
      if (!fs.existsSync(promoImagesDir)) {
        fs.mkdirSync(promoImagesDir, { recursive: true });
      }
      const newFileName = Date.now() + ".png";
      const outPutPath = path.join(promoImagesDir, newFileName);
      fs.renameSync(req.file.path, outPutPath);
      imageFileName = newFileName;
    }

    await db.query("UPDATE promos SET is_active = FALSE");

    const [result] = await db.query(
      "INSERT INTO promos (title, description, image, link, is_active, created_at) VALUES (?, ?, ?, ?, TRUE, NOW())",
      [title, description, imageFileName, link]
    );

    res.json({
      success: true,
      message: "Promo created and set as active",
      promoId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create promo" });
  }
});

router.patch("/:id/activate", async (req, res) => {
  try {
    const promoId = req.params.id;

    await db.query("UPDATE promos SET is_active = FALSE");
    const [result] = await db.query(
      "UPDATE promos SET is_active = TRUE WHERE id = ?",
      [promoId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Promo not found" });
    }

    res.json({ success: true, message: "Promo activated", promoId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to activate promo" });
  }
});

export default router;
