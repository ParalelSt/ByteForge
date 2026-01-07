import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import axios from "axios";
import supabase from "../supabase.js";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Utility: remove background and save to Supabase Storage
async function processImage(imageBuffer, outputFilename) {
  const form = new FormData();
  form.append("size", "auto");
  form.append("image_file", imageBuffer);

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

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("product_images")
    .upload(`product_images/${outputFilename}`, response.data, {
      contentType: "image/png",
      upsert: false,
    });

  if (error) throw error;

  return outputFilename;
}

/* 
==============================
  CREATE PRODUCT
==============================
POST /admin/products
==============================
*/
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;

    if (!name || !price)
      return res.status(400).json({ error: "Name and price required" });

    let imageFilename = null;

    if (req.file) {
      // Save as PNG
      const newFileName = req.file.filename + ".png";

      // Background removal and Supabase upload
      await processImage(req.file.buffer, newFileName);

      imageFilename = newFileName;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description: description ?? "",
          price,
          image: imageFilename,
          category: category ?? null,
          subcategory: subcategory ?? null,
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: "Product created",
      productId: data[0].id,
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
router.get("/", async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
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
router.get("/:id", async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id);

    if (error) throw error;

    if (!rows || rows.length === 0)
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
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;
    const productId = req.params.id;

    // Fetch old image
    const { data: oldProduct, error: fetchError } = await supabase
      .from("products")
      .select("image")
      .eq("id", productId);

    if (fetchError) throw fetchError;

    if (!oldProduct || oldProduct.length === 0)
      return res.status(404).json({ error: "Product not found" });

    let newImage = oldProduct[0].image;

    // If new image uploaded → remove old one + process new one
    if (req.file) {
      const newFileName = req.file.filename + ".png";

      // Remove background + upload to Supabase
      await processImage(req.file.buffer, newFileName);

      // Delete old file from Supabase if exists
      if (newImage) {
        await supabase.storage
          .from("product_images")
          .remove([`product_images/${newImage}`])
          .catch(() => {}); // Ignore errors if file doesn't exist
      }

      newImage = newFileName;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        image: newImage,
        category: category ?? null,
        subcategory: subcategory ?? null,
      })
      .eq("id", productId);

    if (error) throw error;

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
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const { data: rows, error: fetchError } = await supabase
      .from("products")
      .select("image")
      .eq("id", productId);

    if (fetchError) throw fetchError;

    if (!rows || !rows.length)
      return res.status(404).json({ error: "Product not found" });

    const image = rows[0].image;

    // Delete image from Supabase Storage
    if (image) {
      await supabase.storage
        .from("product_images")
        .remove([`product_images/${image}`])
        .catch(() => {}); // Ignore errors if file doesn't exist
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

/* 
==============================
  TOGGLE FEATURED STATUS
==============================
PATCH /admin/products/:id/featured
==============================
*/
router.patch("/:id/featured", async (req, res) => {
  try {
    const { featured } = req.body;
    const productId = req.params.id;

    if (typeof featured !== "boolean") {
      return res.status(400).json({ error: "Featured must be a boolean" });
    }

    const { error } = await supabase
      .from("products")
      .update({ featured })
      .eq("id", productId);

    if (error) throw error;

    res.json({ success: true, message: "Featured status updated", featured });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update featured status" });
  }
});

export default router;
