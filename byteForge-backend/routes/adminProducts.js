import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import axios from "axios";
import db from "../db.js";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Utility: remove background and save cleaned image

async function processImage(inputPath, outputFilename) {
  const outputPath = path.join("images/product_images", outputFilename);

  const form = new FormData();
  form.append("size", "auto");
  form.append("image_file", fs.createReadStream(inputPath));

  const response = await axios({
    method: "post",
    url: "https://api.remove.bg/v1.0/removebg",
    data: form,
    headers: {
      ...form.getHeaders(),
      "X-Api-Key": process.env.REMOVE_BG_KEY,
    },
    responseType: "arraybuffer",
  });

  fs.writeFileSync(outputPath, response.data);
  fs.unlinkSync(inputPath);

  return outputFilename;
}

/* 
==============================
  CREATE PRODUCT
==============================
POST /admin/products
==============================
*/
router.post("/admin/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price)
      return res.status(400).json({ error: "Name and price required" });

    let imageFilename = null;

    if (req.file) {
      // Save as PNG
      const newFileName = req.file.filename + ".png";

      // Background removal
      await processImage(req.file.path, newFileName);

      imageFilename = newFileName;
    }

    const [result] = await db.query(
      "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)",
      [name, description ?? "", price, imageFilename]
    );

    res.json({
      success: true,
      message: "Product created",
      productId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

/* 
==============================
  GET ALL PRODUCTS
==============================
*/
router.get("/admin/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* 
==============================
  GET SINGLE PRODUCT
==============================
*/
router.get("/admin/products/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/* 
==============================
  UPDATE PRODUCT
==============================
PUT /admin/products/:id
==============================
*/
router.put("/admin/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const productId = req.params.id;

    // Fetch old image
    const [oldProduct] = await db.query(
      "SELECT image FROM products WHERE id = ?",
      [productId]
    );

    if (!oldProduct.length)
      return res.status(404).json({ error: "Product not found" });

    let newImage = oldProduct[0].image;

    // If new image uploaded → remove old one + process new one
    if (req.file) {
      const newFileName = req.file.filename + ".png";

      // Remove background + save PNG
      await processImage(req.file.path, newFileName);

      // Delete old file if exists
      if (newImage) {
        const oldPath = path.join("images/product_images", newImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      newImage = newFileName;
    }

    await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?",
      [name, description, price, newImage, productId]
    );

    res.json({ success: true, message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/* 
==============================
  DELETE PRODUCT
==============================
DELETE /admin/products/:id
==============================
*/
router.delete("/admin/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const [rows] = await db.query("SELECT image FROM products WHERE id = ?", [
      productId,
    ]);

    if (!rows.length)
      return res.status(404).json({ error: "Product not found" });

    const image = rows[0].image;

    // Delete image from folder
    if (image) {
      const imgPath = path.join("images/product_images", image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await db.query("DELETE FROM products WHERE id = ?", [productId]);

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
