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

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const promoId = req.params.id;

    const { title, description, link } = req.body;

    const [existing] = await db.query("SELECT * FROM promos WHERE id = ?", [
      promoId,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Promo not found" });
    }

    let imageFileName = existing[0].image;

    if (req.file) {
      if (existing[0].image) {
        const oldImagePath = path.join(
          process.cwd(),
          "images/promo_images",
          existing[0].image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const promoImagesDir = path.join(process.cwd(), "images/promo_images");
      if (!fs.existsSync(promoImagesDir)) {
        fs.mkdirSync(promoImagesDir, { recursive: true });
      }
      const newFileName = Date.now() + ".png";
      const outputPath = path.join(promoImagesDir, newFileName);
      fs.renameSync(req.file.path, outputPath);
      imageFileName = newFileName;
    }

    await db.query(
      "UPDATE promos SET title = ?, description = ?, image = ?, link = ? WHERE id = ?",
      [title, description, imageFileName, link, promoId]
    );

    res.json({
      success: true,
      message: "Promo updated successfully",
      promoId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to update promo" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const promoId = req.params.id;

    const [existing] = await db.query("SELECT * FROM promos WHERE id = ?", [
      promoId,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Promo not found" });
    }

    if (existing[0].image) {
      const imagePath = path.join(
        process.cwd(),
        "images/promo_images",
        existing[0].image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.query("DELETE FROM promos WHERE id = ?", [promoId]);

    res.json({ success: true, message: "Promo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to delete promo" });
  }
});

export default router;
